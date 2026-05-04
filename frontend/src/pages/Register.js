import React, { useState } from 'react';
import api from '../api/axios';

// Accept the props from App.js
const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Call your register endpoint
            await api.post('/register/', { username, email, password });
            alert('Registration successful! Please login.');
            onRegisterSuccess(); // Switch view to Login
        } catch (error) {
            alert('Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
                    {loading ? 'Creating...' : 'Create Account'}
                </button>
            </form>
            {/* Link to Login */}
            <p style={{ marginTop: '15px' }}>
                Already have an account?{' '}
                <a href="/login" onClick={(e) => { e.preventDefault(); if (onSwitchToLogin) onSwitchToLogin(); }} style={{ color: '#007bff', cursor: 'pointer' }}>
                    Login here
                </a>
            </p>
        </div>
    );
};
export default Register;