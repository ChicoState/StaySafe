import { useState, useEffect } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import SearchBar from '../SearchBar/SearchBar';

function GoogleMap() {
  const GMAPS_API_KEY = globalThis.GMAPS_API_KEY ?? process.env.GMAPS_API_KEY;
  const [isHovered, setIsHovered] = useState(false);
  const [isAPILoaded, setIsAPILoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(3);
  const [searchValue, setSearchValue] = useState(''); // Added searchValue state

  const containerStyle = {
    position: 'relative',
    width: '80%',
    height: '80vh',
    margin: '0 auto',
    marginTop: 10,
    backgroundColor: 'white',
    border: '5px solid red',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'scale(1.01)' : 'scale(1)',
    boxShadow: isHovered ? '0 0 20px rgba(255,0,0,0.3)' : 'none'
  };

  useEffect(() => {
    const checkGoogleAPI = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsAPILoaded(true);
        clearInterval(checkGoogleAPI);
      }
    }, 80);
    return () => clearInterval(checkGoogleAPI);
  }, []);

  // Function to get user's location and update the search value
  const getUserLocation = () => {
    console.log("Getting user location...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User location:", latitude, longitude);

          // Reverse geocode to get the user's city or address
          const geocoder = new window.google.maps.Geocoder();
          const latLng = new window.google.maps.LatLng(latitude, longitude);
          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setSearchValue(results[0].formatted_address); // Update search input with the location address
            } else {
              setSearchValue("Location not found");
            }
          });

          setMapCenter({ lat: latitude, lng: longitude });
          setZoom(15);
        },
        (err) => {
          setError('Unable to retrieve your location.');
          console.error('Geolocation error:', err);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      console.error('Geolocation not supported');
    }
  };

  // Auto-fetch user's location when the component mounts
  useEffect(() => {
    getUserLocation(); // Fetch location on component mount
  }, []);

  return (
    <APIProvider apiKey={GMAPS_API_KEY} libraries={['places']}>
      <div style={{
        width: '80%',
        margin: '0 auto',
        marginTop: 100,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '24px',
          color: 'red',
          whiteSpace: 'nowrap'
        }}>Find Crime near you, StaySafe!</h2>
        {isAPILoaded && <SearchBar setMapCenter={setMapCenter} searchValue={searchValue} setSearchValue={setSearchValue} />}
        <button onClick={getUserLocation}>Use My Location</button>
      </div>

      <div
        style={containerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Map
          key={mapCenter ? `${mapCenter.lat}-${mapCenter.lng}` : 'initial'}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}
          defaultZoom={zoom}
          defaultCenter={mapCenter ?? { lat: 22.54992, lng: 0 }}
          gestureHandling={'greedy'}
          onLoaded={({ map }) => {
            console.log('Map loaded:', map);
          }}
        />
      </div>
    </APIProvider>
  );
}

export default GoogleMap;
