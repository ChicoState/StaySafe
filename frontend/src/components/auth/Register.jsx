import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {
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
                <input 
                    value={name} 
                    name="name" 
                    onChange={(e) => setName(e.target.value)} 
                    id="name" 
                    placeholder="Full Name" 
                />
                <label htmlFor="email">Email</label>
                <input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email" 
                    placeholder="youremail@gmail.com" 
                    id="email" 
                    name="email" 
                />
                <label htmlFor="password">Password</label>
                <input 
                    value={pass} 
                    onChange={(e) => setPass(e.target.value)} 
                    type="password" 
                    placeholder="********" 
                    id="password" 
                    name="password" 
                />
                <button type="submit">Register</button>
            </form>
            <button className="link-btn" onClick={() => navigate('/login')}>
                Already have an account? Login here.
            </button>
        </div>
    );
};

export default Register;