import { useState } from 'react';
import './App.css';
import { Routes, Route, Outlet, Link, useNavigate } from "react-router-dom";
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import axios from 'axios';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogout = () => {
        setIsLoggedIn(false);
        alert("Logout successful");
    };

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout isLoggedIn={isLoggedIn} onLogout={handleLogout} />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="register" element={<Register />} />
                </Route>
            </Routes>
        </>
    );
}

function Layout({ isLoggedIn, onLogout }) {
    const navigate = useNavigate();

    return (
        <div>
            <nav className="top-navbar">
                <a href="/" className="site-nav-title">StaySafe</a>
                <a href="/">Home</a>
                <a href="/about">About</a>
                <div className="top-navbar-right">
                    {isLoggedIn ? (
                        <a href="/" onClick={onLogout}>Log Out</a>
                    ) : (
                        <>
                            <a href="/login">Log In</a>
                            <a href="/register">Register</a>
                        </>
                    )}
                </div>
            </nav>
            <hr />
            <Outlet />
        </div>
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

function GoogleMap() {
    const GMAPS_API_KEY = globalThis.GMAPS_API_KEY ?? (process.env.GMAPS_API_KEY);
    return (
        <APIProvider apiKey={GMAPS_API_KEY}>
            <Map
                style={{ width: '100vw', height: '100vh' }}
                defaultZoom={3}
                defaultCenter={{ lat: 22.54992, lng: 0 }}
                gestureHandling={'greedy'}
            />
        </APIProvider>
    );
}

export const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

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

export const Register = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

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
                navigate('/login');
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
                <input value={name} onChange={(e) => setName(e.target.value)} id="name" placeholder="Full Name" />
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" />
                <label htmlFor="password">Password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" />
                <button type="submit">Register</button>
            </form>
            <button className="link-btn" onClick={() => navigate('/login')}>
                Already have an account? Login here.
            </button>
        </div>
    );
};

export default App;