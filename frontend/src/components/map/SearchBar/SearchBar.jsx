import { useState, useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { getUserLocation } from "../getUserLocation";
import axios from 'axios';

const SearchBar = ({ setMapCenter, searchValue, setSearchValue, setZoom }) => {
  const map = useMap();
  const searchInputRef = useRef(null); // Reference for the input field

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
  }, [map, setMapCenter, setSearchValue]);

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
    </div>
  );
};

export default SearchBar;