import { APIProvider, Map } from '@vis.gl/react-google-maps';
import SearchBar from '../SearchBar/SearchBar';
import { useState, useEffect } from 'react';

function GoogleMap() {
  const GMAPS_API_KEY = globalThis.GMAPS_API_KEY ?? process.env.GMAPS_API_KEY;
  const [isHovered, setIsHovered] = useState(false);
  const [isAPILoaded, setIsAPILoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState(null); // Use only mapCenter
  const [error, setError] = useState(null); // Handle errors
  const [zoom, setZoom] = useState(3); // Track zoom level for user-adjustable zoom

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

  // Function to get user's location
  const getUserLocation = () => {
    console.log("Getting user location...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User location:", latitude, longitude);
          setMapCenter({ lat: latitude, lng: longitude });
          setZoom(15); // Set zoom to a closer view when user's location is found
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
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Dynamically update map center if it changes
  useEffect(() => {
    if (mapCenter) {
      console.log('Map center updated:', mapCenter);
    }
  }, [mapCenter]); // This effect runs when mapCenter changes

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
        {isAPILoaded && <SearchBar setMapCenter={setMapCenter} />}
        <button onClick={getUserLocation}>Use My Location</button>
      </div>

      <div
        style={containerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Map
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}
          zoom={zoom} // Bind zoom to the zoom state
          center={mapCenter || { lat: 22.54992, lng: 0 }} // Default center if mapCenter is not available
          gestureHandling={'greedy'}
          onZoomChanged={(newZoom) => setZoom(newZoom)} // Update zoom level when the map zoom changes

          // on drag end, update the map center
          onDragEnd={(event) => {
            const newCenter = event.center;
            setMapCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
          }}

          // Optional: listen to resize events to ensure responsiveness
          onResize={() => {
            console.log("Map resized.");
          }}
        />
      </div>
    </APIProvider>
  );
}

export default GoogleMap;
