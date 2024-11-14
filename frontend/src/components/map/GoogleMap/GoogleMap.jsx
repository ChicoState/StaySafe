import { useState, useEffect } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import SearchBar from '../SearchBar/SearchBar.jsx';
import { getUserLocation } from "../getUserLocation";

function GoogleMap() {
  const GMAPS_API_KEY = globalThis.GMAPS_API_KEY ?? process.env.GMAPS_API_KEY;
  const [isHovered, setIsHovered] = useState(false);
  const [isAPILoaded, setIsAPILoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(3);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const checkGoogleAPI = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsAPILoaded(true);
        clearInterval(checkGoogleAPI);
      }
    }, 80);
    return () => clearInterval(checkGoogleAPI);
  }, []);

  return (
    <APIProvider apiKey={GMAPS_API_KEY} libraries={['places']}>
      <div

        style={{
          // move it to center
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'space-between',
          flexDirection: 'row',
          padding: '20px 0',
          // space between 
        }}

      >
        {isAPILoaded && (
          <SearchBar
            setMapCenter={setMapCenter}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setZoom={setZoom}
          />
        )}
      </div>

      <MapComponent
        mapCenter={mapCenter}
        setMapCenter={setMapCenter}
        zoom={zoom}
        setZoom={setZoom}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isHovered={isHovered}
        setIsHovered={setIsHovered}
      />
    </APIProvider>
  );
}

const MapComponent = ({
  mapCenter, setMapCenter, zoom, setZoom, searchValue, setSearchValue,
  isHovered, setIsHovered
}) => {
  const map = useMap(); // Access map instance

  const containerStyle = {
    position: 'relative',
    width: '80%',
    height: '80vh',
    margin: '0 auto',
    marginTop: 10,
    backgroundColor: 'white',
    border: '4px solid #767575',
    borderRadius: '5px',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'scale(1.01)' : 'scale(1)',
    boxShadow: isHovered ? '0 0 20px rgba(81,231,255,0.3)' : 'none'
  };

  // Auto-fetch user's location when the component mounts
  useEffect(() => {
    if (map) {
      getUserLocation({
        setSearchValue,
        setMapCenter,
        setZoom,
        map,
      });
    }
  }, [map]);

  return (
    <div style={containerStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>

      <Map
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}
        defaultZoom={15}
        // on zoom change
        onZoom={(event) => {
          console.log("Zoom changed:", event.zoom);
          setZoom(event.zoom);
        }}
        defaultCenter={mapCenter || { lat: 22.54992, lng: 0 }} // Use defaultCenter for initial map load
        gestureHandling={'greedy'}
        onClick={(event) => {
          setMapCenter({
            lat: event.map.getCenter().lat(),
            lng: event.map.getCenter().lng(),
          });
          setZoom(15);
        }}
        onDragend={(event) => {
          const newCenter = event.map.getCenter().toJSON();
          if (JSON.stringify(newCenter) !== JSON.stringify(mapCenter)) {
            setMapCenter(newCenter); // Update center only when it changes
            console.log("Map center updated:", newCenter);
          }
        }} // Updates map center without forcing a reload
      />
    </div>
  );
};

export default GoogleMap;