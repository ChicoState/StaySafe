import { useState, useEffect } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import SearchBar from '../SearchBar/SearchBar.jsx';
import { getUserLocation } from "../getUserLocation";
import { ClipLoader } from 'react-spinners';


function GoogleMap({ addresses, ...props }) {
  const GMAPS_API_KEY = globalThis.GMAPS_API_KEY ?? process.env.GMAPS_API_KEY;
  const [isHovered, setIsHovered] = useState(false);
  const [isAPILoaded, setIsAPILoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
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
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'space-between',
          flexDirection: 'row',
          padding: '20px 0',
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
        addresses={addresses} // Pass the addresses data to MapComponent
        loading= {props.loading}
      />
    </APIProvider>
  );
}

const MapComponent = ({
  mapCenter,
  setMapCenter,
  zoom,
  setZoom,
  searchValue,
  setSearchValue,
  isHovered,
  setIsHovered,
  addresses,
  loading
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

  useEffect(() => {
  if (!mapCenter) {
    setMapCenter({ lat: 39.7285, lng: -121.8375 });
    setSearchValue('Chico, CA');
    setZoom(16);
  }
}, [mapCenter, setMapCenter, setSearchValue, setZoom]);

  // set the default location to Chico, CA
  // useEffect is perfect for this because it will only run once when the component mounts
  useEffect(() => {
    // log to indicate the useEffect is running
    console.log('Map component mounted');
    // use the addresses data to render markers on the map
    if (map && addresses.length > 0) {
      console.log('Addresses data:', addresses);
      
      // Clear previous markers before adding new ones
      const markers = []; // To store marker references for cleanup (if needed)
      
      addresses.forEach((address) => {
        // check if the address is null (skipped address)
        if (!address) return;
  
        // Create a new marker for each address
        const marker = new window.google.maps.Marker({
          position: { lat: address.latitude, lng: address.longitude },
          map,
          title: address.address,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          },
        });
  
        markers.push(marker); // Add marker to the array for future reference
  
        // Add a click event listener to the marker
        marker.addListener('click', () => {
          map.setZoom(17);
          map.setCenter(marker.getPosition());
        });
      });
  
      // Cleanup function to remove markers (if necessary)
      return () => {
        markers.forEach((marker) => marker.setMap(null)); // Removes markers from the map when component unmounts
      };
    }
  }, [map, addresses]);
  
  


  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {
      
      loading ?  
      <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
          }}
        >
          <ClipLoader color="#3498db" loading={loading} size={50} />
        </div> : 
      <Map
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          border: '1px solid #ddd',
        }}
        defaultZoom={15}
        onZoom={(event) => {
          console.log('Zoom changed:', event.zoom);
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
            console.log('Map center updated:', newCenter);
          }
        }}
      />
      }
    </div>
  );
};

export default GoogleMap;
