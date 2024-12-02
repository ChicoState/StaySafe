import React, { useState } from "react";
import SlidingPane from "react-sliding-pane";
import DatePicker from "react-datepicker";
import axios from "axios";
import stateConvert from "us-state-converter";
import { useQuery } from '@tanstack/react-query';
import "react-datepicker/dist/react-datepicker.css";
import "./StatsPane.css";
import PropagateLoader from "react-spinners/PropagateLoader";

const StatsPane = ({ location, state, county }) => {
  const stats_url = "http://localhost:8080/api/fbi/crime-stats";
  const filter = "rates";
  const [year, setYear] = useState(new Date().getFullYear() - 1);
  const [crimeSelection, setCrimeSelection] = useState("Aggravated Assault");

  let stateFull = stateConvert.fullName(state);

  const {
    data: rateData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['crimeStats', location, state, county, year],
    queryFn: async () => {
      if (!location || !state || !county) {
        throw new Error("Invalid query parameters");
      }
      stateFull = stateConvert.fullName(state);
      const response = await axios.get(stats_url, {
        params: { location, state, county, year, filter },
      });
      return {
        ...response.data,
      };
    },
    enabled: !!location && !!state && !!county, // Only fetch if inputs are valid
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
  });

  const [paneState, setPaneState] = useState({ isPaneOpen: false });

  if (isLoading || isFetching) {
    if (paneState) {
      return (
        <>
          <button className="stats-pane-button" onClick={() => setPaneState({ isPaneOpen: true })}>
            Loading statistics...
          </button>

          <SlidingPane
            width="50%"
            isOpen={paneState.isPaneOpen}
            title={"Crime Rates"}
            subtitle={"As reported to the FBI"}
            onRequestClose={() => setPaneState({ isPaneOpen: false })}
          >
            <div className="year-selection">
              <h4>Select a year to view: {year}</h4>
            </div>
            <div className="crime-selection">
              <select disabled>
                <option>Select Crime</option>
              </select>
            </div>
            <h3>Fetching Data...</h3>
            <div id="stats-table-spin-loader">
              <PropagateLoader 
                color="#17c0ea"
              />
            </div>
          </SlidingPane>
        </>
      );
    }
    else {
      return (
        <>
          <button disabled onClick={() => setPaneState({ isPaneOpen: true })}>
            Loading statistics...
          </button>
        </>
      );
    }
  };

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  let paneTitle = `Crime Rates for ${location}, ${state}`;
  let locRateColumnTitle = `${location} Rate`;
  let tableDescriptor = "Rates per 100,00 people:"
  const rateKeys = Object.keys(rateData[0]?.rates || {});
  const agencyKey = rateKeys[2]; // Agency should always be at index 2... I hope
  const crimeSelectionOptions = listCrimeTypes(rateData);
  const tableRows = listRates(rateData, stateFull, year, agencyKey, crimeSelection);

  if (rateData[0]?.loc_found === false) {
    paneTitle = `Crime Rates for ${county} County`;
    locRateColumnTitle = `County Rate`;
    tableDescriptor = "City not in FBI data — displaying county rates:"
  }

  return (
    <>
      <button className="stats-pane-button" onClick={() => setPaneState({ isPaneOpen: true })}>
        View Crime Rates
      </button>

      <SlidingPane
        width="50%"
        isOpen={paneState.isPaneOpen}
        title={paneTitle}
        subtitle="As reported to the FBI"
        onRequestClose={() => setPaneState({ isPaneOpen: false })}
      >
        <div className="year-selection">
          <h4>Select a year to view: </h4>
          <YearPicker
            location={location}
            state={state}
            county={county}
            year={year}
            onYearChange={(newYear) => setYear(newYear)}
          />
        </div>
        <div className="crime-selection">
          <select
            value={crimeSelection}
            onChange={(e) => setCrimeSelection(e.target.value)}
          >
            {crimeSelectionOptions}
          </select>
        </div>
        <div className="stats-table">
          <h3>{tableDescriptor}</h3>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>{locRateColumnTitle}</th>
                <th>{state} Rate</th>
                <th>USA Rate</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      </SlidingPane>
    </>
  );
};

const YearPicker = ({ year, onYearChange }) => {

  const latestYear = year;
  const maxYear = new Date().getFullYear() - 1;
  const latestDate = new Date(`${latestYear}-12-31`)
  const [selectedDate, setSelectedDate] = useState(latestDate);

  const handleYearChange = (date) => {
    setSelectedDate(date);
    const selectedYear = date.getFullYear();
    onYearChange(selectedYear);
  };

  return (
    <div className="date-picker">
      <DatePicker
        selected={selectedDate}
        onChange={handleYearChange}
        showYearPicker
        dateFormat="yyyy"
        minDate={new Date("1995-01-01")}
        maxDate={new Date(`${maxYear}-12-31`)}
      />
    </div>
  );
};

const listRates = (data, stateFull, year, agencyKey, crimeType) => {

  let index = null;
  crimeType = crimeType.replaceAll(' ', '-').toLowerCase();

  // Check for matching crime type, only 9 should exist
  for (let i = 0; i < 10; i++) {
    if (data[i].crime_type === crimeType) {
      index = i;
    }
  }

  if (index === null) {
    console.error("No index matching crimeType found; setting to 0");
    index = 0;
  }

  const monthsAbbr = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]
  const listArr = [];
  for (let i = 1; i <= monthsAbbr.length; i++) {
    let dateKey = `0${i}-${year}`
    if (i > 9) {
      dateKey = `${i}-${year}`;
    }
    listArr.push(
      <tr key={`${dateKey}-${stateFull}-${agencyKey}`}>
        <td>{monthsAbbr[i - 1]}</td>
        <td>{data[index].rates[stateFull][dateKey]}</td>
        <td>{data[index].rates[agencyKey][dateKey]}</td>
        <td>{data[index].rates["United States"][dateKey]}</td>
      </tr>
    )
  }
  return listArr;
}

const listCrimeTypes = () => {
  const optionsArr = [];
  const crimeTypes = [
    "Aggravated Assault",
    "Arson",
    "Burglary",
    "Larceny",
    "Motor Vehicle Theft",
    "Property Crime",
    "Violent Crime",
    "Homicide",
    "Rape",
    "Robbery",
  ];
  for (let i = 0; i < crimeTypes.length; i++) {
    optionsArr.push(
      <option key={crimeTypes[i]} value={crimeTypes[i]}>{crimeTypes[i]}</option>
    )
  }
  return optionsArr;
};

export default StatsPane;