import './App.css';
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function App() {
  return (
    <AuthProvider>
      <div>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
