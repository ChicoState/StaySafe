import GoogleMap from '../map/GoogleMap/GoogleMap'
// importing chico arrest section.
import ChicoArrests from '../chico_arrests/ChicoArrests'
import { useState } from 'react';

const Home = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <>
    <ChicoArrests setAddresses={setAddresses} setLoading={setLoading} />
    <GoogleMap addresses={addresses} loading={loading} />
      
    </>
  );
};
export default Home;