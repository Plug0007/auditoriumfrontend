import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check local storage for user info on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Remove user from storage and update state
    localStorage.removeItem('user');
    setUser(null);
    // Replace history so user cannot navigate back
    navigate('/login', { replace: true });
  };

  // Determine the home path based on user role
  let homePath = '/';
  if (user) {
    homePath = user.role === 'admin' ? '/admin' : '/faculty';
  }

  return (
    <header className="main-header">
      <div className="logo">
        <Link to={homePath}>Auditorimun Booking</Link>
      </div>
      <nav className="nav-menu">
        <Link to="/credits" className="nav-item">Credits</Link>
        {user ? (
          <button onClick={handleLogout} className="nav-item logout-btn">Logout</button>
        ) : (
          <Link to="/login" className="nav-item">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
