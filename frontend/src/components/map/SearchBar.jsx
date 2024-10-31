// src/components/map/SearchBar.jsx
import { useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import axios from 'axios';

const SearchBar = () => {
  const map = useMap();
  const [searchValue, setSearchValue] = useState('');

  const initializeAutocomplete = (input) => {
    if (!input || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ['geocode', 'establishment'],
      fields: ['formatted_address', 'geometry', 'name', 'address_components'],
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

      const addressComponents = place.address_components;
      let location = '';
      let state = '';
      let county = '';
  
      addressComponents.forEach((component) => {
        if (component.types.includes('locality')) {
          location = component.long_name;
        } 
        else if (component.types.includes('administrative_area_level_1')) {
          state = component.short_name;
        } 
        else if (component.types.includes('administrative_area_level_2')) {
          county = component.long_name;
        }
      });

      setSearchValue(place.formatted_address);
      postSearch(location, state, county)
    });
  };

  const postSearch = async (location, state, county) => {
    try {
      const response = await axios.post('http://localhost:8080/api/search', {
        location,
        state,
        county,
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Log or process the response data
      console.log('Server response:', response.data);
    } 
    catch (error) {
      console.error('Error posting data to backend:', error);
    }
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