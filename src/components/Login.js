// frontend/src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [rememberMe, setRememberMe]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const navigate                        = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, { username, password });
      if (res.data.success) {
        const user = res.data.user;
        // Save the user in localStorage if "Remember Me" is checked, otherwise use sessionStorage
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("user", JSON.stringify(user));
        }
        // Redirect based on user role. Using "replace" prevents back button from showing the login page.
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
              type={showPassword ? "text" : "password"}
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <button 
              type="button" 
              className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="form-group remember-me">
          <input 
            type="checkbox" 
            checked={rememberMe} 
            onChange={e => setRememberMe(e.target.checked)} 
          />
          <label>Remember Me</label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
