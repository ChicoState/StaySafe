import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
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

export default Login;