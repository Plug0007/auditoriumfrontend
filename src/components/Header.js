import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user info from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  // Set the home path based on user role
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
