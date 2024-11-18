import { useNavigate } from 'react-router-dom';

const CrimeList = ({ crimes }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {crimes.map((crime) => (
        <div
          key={crime.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr 100px',
            padding: '15px',
            borderBottom: '1px solid #3a3a3a',
            alignItems: 'center'
          }}
        >
          <div style={{ color: 'white' }}>{crime.type}</div>
          <div style={{ color: 'white' }}>{crime.location}</div>
          <div style={{ color: 'white' }}>{crime.datetime}</div>
          <button
            onClick={() => navigate(`/crime/${crime.id}`)}
            style={{
              padding: '5px 10px',
              backgroundColor: '#17c0ea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            View More
          </button>
        </div>
      ))}
    </div>
  );
};

export default CrimeList;