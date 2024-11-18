import './App.css';
import { Routes, Route } from "react-router-dom";
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CrimeDetail from './components/crime/CrimeDetail';
import ChicoArrests from './components/chico_arrests/ChicoArrests';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="crime/:id" element={<CrimeDetail />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;

