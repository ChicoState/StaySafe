import { useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import { Routes, Route, Outlet, Link, useNavigate } from "react-router-dom";
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import axios from 'axios';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
            </Routes>
        </>
    );
}

function Layout({ currentForm, onFormSwitch }) {
    const navigate = useNavigate();

    return (
        <div>
            <nav className="top-navbar">
                <a href="/" className="site-nav-title">StaySafe</a>
                <a href="/">Home</a>
                <a href="/about">About</a>
                {/* Removed the Register button from the top bar */}
                <div className="top-navbar-right">
                    <a href="/login" onClick={() => onFormSwitch('login')}>Login</a>
                </div>
            </nav>
            <hr />
            <Outlet />
        </div>
    );
}

function GoogleMap() {
    const GMAPS_API_KEY = globalThis.GMAPS_API_KEY ?? (process.env.GMAPS_API_KEY);
    return (
        <>
            <APIProvider apiKey={GMAPS_API_KEY}>
                <Map
                    style={{width: '100vw', height: '100vh'}}
                    defaultZoom={3}
                    defaultCenter={{lat: 22.54992, lng: 0}}
                    gestureHandling={'greedy'}
                />
            </APIProvider>
        </>
    );
}

function Home() {
    return (
        <>
            <GoogleMap />
        </>
    );
}

function About() {
    return (
        <div>
            <p>StaySafe uses FBI data and Google Maps to make it easy to view the crime statistics of different areas.</p>
        </div>
    );
}

// Login component
export const Login = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const navigate = useNavigate();  // Use navigate for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/login', {
                email,
                password: pass
            });

            if (response.data.success) {
                alert("Login successful");
                setIsLoggedIn(true); 
            }
        } catch (error) {
            // Handle error responses from the backend
            if (error.response) {
                const { message } = error.response.data;
                alert(message);  // Display the error message from the backend

                if (message === "User not found. Please register first.") {
                    // Navigate to the registration page if the user doesn't exist
                    navigate('/register');
                }
            } else {
                console.error("Login failed:", error);
                alert("An error occurred during login.");  // Generic error
            }
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false); 
        alert("Logout successful");
    };

    return (
        <div className="auth-form-container">
            {isLoggedIn ? (
                <div>
                    <h2>Welcome!</h2>
                    <button onClick={handleLogout}>Log Out</button>
                </div>
            ) : (
                <div>
                    <h2>Login</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="email">Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                        <label htmlFor="password">Password</label>
                        <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                        <button type="submit">Log In</button>
                    </form>
                    {/* Button to switch to Register page */}
                    <button className="link-btn" onClick={() => navigate('/register')}>
                        Don't have an account? Register here.
                    </button>
                </div>
            )}
        </div>
    );
};

// Register component
export const Register = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();  // Use navigate for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/register', {
                name, 
                email, 
                password: pass 
            });

            if (response.data.success) {
                alert("Registration successful");
                navigate('/login'); // Switch to login after successful registration
            } else {
                alert("User already exists or registration failed");
            }
        } catch (error) {
            console.error("Registration failed:", error);
            alert("An error occurred during registration.");
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Full Name</label>
                <input value={name} name="name" onChange={(e) => setName(e.target.value)} id="name" placeholder="Full Name" />
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                <label htmlFor="password">Password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button type="submit">Register</button>
            </form>
            {/* Button to switch to Login page */}
            <button className="link-btn" onClick={() => navigate('/login')}>
                Already have an account? Login here.
            </button>
        </div>
    );
};

export default App;

