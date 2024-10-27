// src/components/map/SearchBar.jsx
import { useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

const SearchBar = () => {
  const map = useMap();
  const [searchValue, setSearchValue] = useState('');

  const initializeAutocomplete = (input) => {
    if (!input || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ['geocode', 'establishment'],
      fields: ['formatted_address', 'geometry', 'name'],
    });

    // When a place is selected
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      // Center map on selected location
      if (map) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
      }
      setSearchValue(place.formatted_address);
    });
  };

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
        type="text"
        placeholder="Search for Address (Street, City, State)"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        ref={initializeAutocomplete}
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