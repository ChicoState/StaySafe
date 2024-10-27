import { APIProvider, Map } from '@vis.gl/react-google-maps';
import SearchBar from './SearchBar';
import { useState, useEffect } from 'react';

function GoogleMap() {
  const GMAPS_API_KEY = globalThis.GMAPS_API_KEY ?? (process.env.GMAPS_API_KEY);
  const [isHovered, setIsHovered] = useState(false);
  const [isAPILoaded, setIsAPILoaded] = useState(false);

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

  return (
    <APIProvider
      apiKey={GMAPS_API_KEY}
      libraries={['places']}
    >

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
        }}> Find Crime near you, StaySafe!
        </h2>
        {isAPILoaded && <SearchBar />}
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
          defaultZoom={3}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          gestureHandling={'greedy'}
        />
      </div>
    </APIProvider>
  );
}

export default GoogleMap;