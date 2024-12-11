import React, { useEffect } from 'react';
import axios from 'axios'; // Import axios for making API requests

const ChicoArrests = ({ setAddresses, setLoading }) => {
  useEffect(() => {
    // Fetch the data from the backend when the component mounts
    axios.get('http://localhost:8080/scrape-chico') // Ensure this matches your backend route
      .then((response) => {
        setAddresses(response.data); // Set the addresses data
        setLoading(false); // Set loading to false
      })
      .catch((err) => {
        console.error('Failed to fetch addresses:', err);
        setLoading(false); // Set loading to false
      });
  }, [setAddresses, setLoading]);

  return null; // No UI needed here since we handle map rendering in the parent component
};

export default ChicoArrests;
