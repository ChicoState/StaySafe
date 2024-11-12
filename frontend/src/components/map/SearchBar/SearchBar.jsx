import { useState, useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

const SearchBar = ({ setMapCenter, searchValue, setSearchValue }) => { // Accept searchValue and setSearchValue as props
  const map = useMap();
  const searchInputRef = useRef(null); // Create a reference for the input field

  useEffect(() => {
    const input = searchInputRef.current;
    if (!input || !window.google) return; // Ensure Google Maps is loaded

    // Initialize the Autocomplete API
    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ['geocode', 'establishment'],
      fields: ['formatted_address', 'geometry', 'name'],
    });

    // Handle place selection
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      // Center the map on the selected location
      if (map) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
      }

      // Update search value and map center in the parent component
      setSearchValue(place.formatted_address);
      setMapCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });

    // Cleanup listener on unmount
    return () => {
      if (autocomplete) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };

  }, [map, setMapCenter, setSearchValue]);

  return (
    <div className="search-container" style={{
      position: 'absolute',
      top: '-40px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      width: '90%',
      maxWidth: '400px',
    }}>
      <input
        ref={searchInputRef} // Use ref here to attach to the input element
        type="text"
        placeholder="Search for Address (Street, City, State)"
        value={searchValue} // Use the searchValue prop to control the input value
        onChange={(e) => setSearchValue(e.target.value)} // Handle manual text changes
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '4px',
          border: '2px solid red',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          fontSize: '14px',
        }}
      />
    </div>
  );
};

export default SearchBar;
