// frontend/src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Always "true" behind the scenes
  const [rememberMe] = useState(true);
  const [loading, setLoading]           = useState(false);
  const navigate                        = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        username,
        password,
      });
      if (res.data.success) {
        const user = res.data.user;
        // Store the user in localStorage so they remain logged in after closing PWA
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin', { state: { user }, replace: true });
        } else {
          navigate('/faculty', { state: { user }, replace: true });
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input 
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <div className="password-wrapper">
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                /* Eye slash icon for "hide" */
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  width="20" 
                  height="20"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M13.875 18.825A10.05 10.05 0 0112 19
                      c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.376-4.197
                      M9.88 9.88a3 3 0 104.24 4.24
                      M15 12a3 3 0 01-3 3m0-6a3 3 0 013 3
                      m4.24 4.24a10.05 10.05 0 01-2.376 4.197
                      M3 3l18 18" 
                  />
                </svg>
              ) : (
                /* Eye icon for "show" */
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  width="20" 
                  height="20"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M2.458 12C3.732 7.943 
                      7.522 5 12 5c4.478 0 
                      8.268 2.943 9.542 7
                      -1.274 4.057-5.064 7
                      -9.542 7-4.478 0
                      -8.268-2.943-9.542-7z" 
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* No checkbox - always remember in localStorage */}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
