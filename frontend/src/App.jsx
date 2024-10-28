// Import React and hooks for handling side effects and state
import React, { useEffect, useState } from 'react';

// Define the ArrestData component
const ArrestData = () => {
  // State to hold connection status message
  const [message, setMessage] = useState('Connecting...');

  useEffect(() => {
    // API endpoint URL with hardcoded API key for now..
    const url = 'https://api.usa.gov/crime/fbi/cde/agency/byStateAbbr/CA0040200?API_KEY=lPPYOTsrgKtfZ7fntsidnv5sbuzijzehRT59cIYe';

    // Request to the API
    fetch(url)
      .then(response => {
        // If the response status is OK (200–299)
        if (response.ok) {
          setMessage('You are connected!'); // Update message to success
          return response.json(); // Parse the JSON data from response
        } else {
          setMessage('Failed to connect to API'); // Update message to failure
          throw new Error('Connection failed'); // Stop further execution on failure
        }
      })
      .catch(() => {
        // If an error occurs, update the message to indicate connection failure
        setMessage('Failed to connect');
      });
  }, []); // Empty dependency array means this runs only once when the component mounts

  // Render the component with the connection message
  return <div>{message}</div>;
};

// Export the component to use it elsewhere in the application
export default ArrestData;

