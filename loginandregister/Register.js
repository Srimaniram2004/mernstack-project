import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [mobile, setMobile] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(true);

    const handleUsernameChange = async (e) => {
        const newUsername = e.target.value;
        setUsername(newUsername);
        
        if (newUsername) {
            try {
                const response = await axios.get(`http://localhost:5000/check-username/${newUsername}`);
                setUsernameAvailable(response.data.available);
                setMessage(response.data.available ? '' : "Username already taken");
            } catch (error) {
                console.error("Error checking username:", error);
            }
        } else {
            setUsernameAvailable(true);
            setMessage("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        if (!usernameAvailable) {
            setMessage("Please choose a different username.");
            return;
        }

        const userData = {
            firstName,
            lastName,
            dob,
            mobile,
            username,
            password,
        };

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/register', userData);
            setMessage(response.data.message);

            if (response.status === 201) {
                navigate('/Login');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error registering user";
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Register Here</h1>
            <form onSubmit={handleSubmit}>
                <label>First Name</label>
                <input
                    type="text"
                    placeholder="Enter Your First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <label>Last Name</label>
                <input
                    type="text"
                    placeholder="Enter Your Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <label>Date of Birth</label>
                <input
                    type='date'
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                />
                <label>Mobile Number</label>
                <input
                    type="tel"
                    placeholder="Enter Your Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit mobile number."
                />
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter Your Username"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                />
                {!usernameAvailable && <p style={{ color: 'red' }}>Email already taken</p>}
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>Retype Your Password</label>
                <input
                    type="password"
                    placeholder="Retype Your Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register Here'}
                </button>
            </form>
            {message && <p style={{ color: 'red', ariaLive: 'polite' }}>{message}</p>}
        </div>
    );
};

export default Register;