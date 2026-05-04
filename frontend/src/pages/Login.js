import React, { useState } from 'react';
import api from '../api/axios';

const Login = ({ onLogin, onSwitchToRegister }) => {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page refresh
    setError('');
    setLoading(true);

    try {
      // 1. Send username/password to Django
      const response = await api.post('api-token-auth/', {
        username: username,
        password: password
      });

      // 2. If successful, save the Token in the browser
      // This acts like saving your ID card in your wallet
      localStorage.setItem('token', response.data.token);

      // 3. Tell the main App we are logged in
      onLogin(); 

    } catch (err) {
        console.error('Login error:', err);
      // If login fails (wrong password, etc.)
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Admin Login</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Hint: Use <b>admin</b> / <b>admin123</b></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
<p style={{ marginTop: '15px', textAlign: 'center' }}>
  Don't have an account?{' '}
  <a href="#" onClick={(e) => { e.preventDefault(); if (onSwitchToRegister) onSwitchToRegister(); }} style={{ color: '#007bff', cursor: 'pointer' }}>
    Sign Up here
  </a>
</p>