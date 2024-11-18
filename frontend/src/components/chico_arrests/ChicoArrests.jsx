//chico arrests section
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making API requests

const ChicoArrests = () => {
  const [addresses, setAddresses] = useState([]); // State to store the fetched addresses
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Fetch the data from the backend when the component mounts
    axios.get('http://localhost:8080/scrape-chico') // Ensure this matches your backend route

      .then((response) => {
        setAddresses(response.data); // Set the addresses data
        setLoading(false); // Set loading to false
      })
      .catch((err) => {
        setError('Failed to fetch addresses'); // Set an error message
        setLoading(false); // Set loading to false
      });
  }, []);

  return (
    <div style={{
      width: '80%',
      margin: '10px auto',
      padding: '20px',
    }}>
      <h2>Chico Arrests By Location</h2>

      {loading && <p>Loading...</p>} {/* Show loading message while data is being fetched */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message if there's an error */}

      {!loading && !error && addresses.length > 0 ? (
        <ul>
          {addresses.map((address, index) => (
            <li key={index}>{address}</li> // Render each address in a list item
          ))}
        </ul>
      ) : (
        !loading && !error && <p>No addresses found.</p> // Show this message if there are no addresses
      )}
    </div>
  );
};

export default ChicoArrests;
