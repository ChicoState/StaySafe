import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', {
        email,
        password: pass
      });

      if (response.data.success) {
        alert("Login successful!");
        login();  // Set global login state
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;
        alert(message);
        if (message === "User not found. Please register first.") {
          navigate('/register');
        }
      } else {
        console.error("Login failed:", error);
        alert("An error occurred during login.");
      }
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
        <label htmlFor="password">Password</label>
        <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
        <button type="submit">Log In</button>
      </form>
      <button className="link-btn" onClick={() => navigate('/register')}>
        Don't have an account? Register here.
      </button>
    </div>
  );
};

export default Login;
