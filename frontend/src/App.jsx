import './App.css';
import { Routes, Route } from "react-router-dom";
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Login from './components/auth/Login';
import Register from './components/auth/Register';



function App() {
  return (
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
  )
}

export default App;

