import { useState } from 'react';

const CrimeFilters = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState(['All']);

  const filters = ['All', 'Assaults', 'Vandalism', 'Burglary'];

  const handleFilterClick = (filter) => {
    let newFilters;
    if (filter === 'All') {
      newFilters = ['All'];
    } else {
      const updatedFilters = selectedFilters.filter(f => f !== 'All');
      if (selectedFilters.includes(filter)) {
        newFilters = updatedFilters.filter(f => f !== filter);
      } else {
        newFilters = [...updatedFilters, filter];
      }
      if (newFilters.length === 0) newFilters = ['All'];
    }
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      marginBottom: '20px'
    }}>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilterClick(filter)}
          style={{
            padding: '8px 16px',
            border: '2px solid red',
            borderRadius: '4px',
            backgroundColor: selectedFilters.includes(filter) ? 'red' : 'transparent',
            color: selectedFilters.includes(filter) ? 'white' : 'red',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default CrimeFilters;