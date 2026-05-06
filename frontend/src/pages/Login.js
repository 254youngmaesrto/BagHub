import React, { useState } from 'react';
import api from '../api/axios';

const Login = ({ onLogin, onSwitchToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/api-token-auth/', { username, password });

            // ✅ Store real token
            localStorage.setItem('token', response.data.token);

            // ✅ FIX: store admin status (missing before)
            localStorage.setItem('isAdmin', response.data.is_admin);

            // Pass admin status to App.js
            if (onLogin) {
                onLogin(response.data.is_admin);
            }
        } catch (err) {
            setError('Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p style={{ marginTop: '15px' }}>
                Don't have an account?{' '}
                <a href="/register" onClick={(e) => { e.preventDefault(); if (onSwitchToRegister) onSwitchToRegister(); }} style={{ color: '#007bff', cursor: 'pointer' }}>
                    Sign Up here
                </a>
            </p>
        </div>
    );
};

export default Login;