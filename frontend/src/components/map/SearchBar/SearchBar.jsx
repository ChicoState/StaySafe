import { useEffect, useRef, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { getUserLocation } from "../getUserLocation";
import axios from 'axios';
import StatsPane from '../../stats-pane/StatsPane';

const SearchBar = ({ setMapCenter, searchValue, setSearchValue, setZoom }) => {
  const map = useMap();
  const searchInputRef = useRef(null); // Reference for the input field
  const [location, setLocation] = useState("Chico");
  const [state, setState] = useState("CA");
  const [county, setCounty] = useState("Butte");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const input = searchInputRef.current;
    if (!input || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ['geocode', 'establishment'],
      fields: ['formatted_address', 'geometry', 'name', 'address_components'],
    });   

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;


      //this section add red pin to the address based on the search result
  if (map) {
    // Add a pin (marker) to the searched location
    const marker = new google.maps.Marker({
      position: place.geometry.location, // Searched location
      map, // Google Map instance
      title: place.formatted_address || "Search Result", // Tooltip
    });

    // Center the map on the searched location
    map.panTo(place.geometry.location);
    map.setZoom(15);
  }

      const addressComponents = place.address_components;

  
      addressComponents.forEach((component) => {
        if (component.types.includes('locality')) {
          let updatedLoc = component.long_name;
          setLocation(updatedLoc);
        } 
        else if (component.types.includes('administrative_area_level_1')) {
          let updatedState = component.short_name;
          setState(updatedState);
        } 
        else if (component.types.includes('administrative_area_level_2')) {
          let updatedCounty = component.long_name;
          updatedCounty = updatedCounty.replace(/\s[Cc]ounty$/, ''); // Remove 'County' from string
          setCounty(updatedCounty);
        }
      });

      setSearchValue(place.formatted_address);
      // checks if the search value is contians Chico, CA, if not show a pop up message to the user
      if (!place.formatted_address.includes("Chico, CA")) {
        // dont use alert, it will block the UI
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 5000); // Hide after 3 seconds
      }

      setMapCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });

    return () => {
      if (autocomplete) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [map, setMapCenter, setSearchValue, state, county, location]);

  return (
    // Search bar container




    <div className="search-container">
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search for Address (Street, City, State)"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{
          border: '1px solid #ccc', // Subtle border for a polished look
          padding: '12px 16px',
          width: '325px',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          fontSize: '16px',
          color: '#333',
          outline: 'none',
        }}
      />

{showMessage && (
      <div style={{
        position: 'absolute',
        top: '7px',
        right: '20%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(255, 69, 0, 0.9)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: '1000',


      }}>
        No street-level data available for this location. Please try another address or check status.
      </div>
    )}
      <button
        // arrow function to call getUserLocation
        onClick={() => getUserLocation({ setSearchValue, setMapCenter, map, setZoom })}
        style={{
          backgroundColor: '#007BFF', // Blue button for attention
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginLeft: '15px',
          fontSize: '16px',
          transition: 'all 0.3s ease', // Smooth transition for hover effect
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'} // Darker shade on hover
        onMouseLeave={(e) => e.target.style.backgroundColor = '#007BFF'} // Original color on leave
      >
        <i className="fas fa-location-arrow" style={{ marginRight: '8px' }}></i> {/* FontAwesome icon */}
        Find Me
      </button>
      <StatsPane 
        location={location}
        state={state}
        county={county}
      />
    </div>
  );
};

export default SearchBar;