// src/components/pages/CrimeDetail.jsx
import { useParams, Link } from 'react-router-dom';

const CrimeDetail = () => {
  const { id } = useParams();

  // Dummy data dewlete later
  const crimeDetail = {
    id: id,
    type: 'Assault',
    location: 'Chico, East Ave',
    datetime: '2024-10-23 14:30',
    description: 'Suspect approached in a very sus manner. He was very methed up',
    suspect: 'Male, approximately 5\'10", wearing a green hoodie, with white pants',
    status: 'Under Investigation',
    reportNumber: 'CR-2024-' + id,
    additionalDetails: [
      'Multiple witnesses present',
      'Security camera footage available',
      'Officer Carter responded to the scene'
    ]
  };

  return (
    <div style={{
      width: '80%',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      color: 'white'
    }}>
      {/* Back button */}
      <Link
        to="/"
        style={{
          color: 'red',
          textDecoration: 'none',
          marginBottom: '20px',
          display: 'inline-block'
        }}
      >
        ← Back to Crime List
      </Link>

      {/* Header */}
      <h1 style={{ color: 'red', marginBottom: '20px' }}>
        Crime Report #{crimeDetail.reportNumber}
      </h1>

      {/* Crime details grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div>
          <h3>Type</h3>
          <p>{crimeDetail.type}</p>
        </div>
        <div>
          <h3>Date & Time</h3>
          <p>{crimeDetail.datetime}</p>
        </div>
        <div>
          <h3>Location</h3>
          <p>{crimeDetail.location}</p>
        </div>
        <div>
          <h3>Status</h3>
          <p>{crimeDetail.status}</p>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Description</h3>
        <p>{crimeDetail.description}</p>
      </div>

      {/* Suspect Information */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Suspect Description</h3>
        <p>{crimeDetail.suspect}</p>
      </div>

      {/* Additional Details */}
      <div>
        <h3>Additional Details</h3>
        <ul style={{ paddingLeft: '20px' }}>
          {crimeDetail.additionalDetails.map((detail, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CrimeDetail;