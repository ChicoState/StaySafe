import { useState } from 'react';
import CrimeFilters from './CrimeFilters';
import CrimeList from './CrimeList';

const CrimeSection = () => {
  const [crimes] = useState([
    {
      id: 1,
      type: 'Assault',
      location: '800 Block of 2nd Ave',
      datetime: '2024-10-23 14:30',
    },
    {
      id: 2,
      type: 'Vandalism',
      location: '1200 Block of Main St',
      datetime: '2024-10-23 16:45',
    },
  ]);

  const handleFilterChange = (filters) => {
    console.log('Selected filters:', filters);
  };

  return (
    <div style={{
      width: '80%',
      margin: '10px auto',
      padding: '20px',
    }}>
      <CrimeFilters onFilterChange={handleFilterChange} />
      <CrimeList crimes={crimes} />
    </div>
  );
};

export default CrimeSection;