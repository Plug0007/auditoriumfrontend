// frontend/src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Always check localStorage for the user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Remove user from localStorage
    localStorage.removeItem('user');

    // Clear the user from state
    setUser(null);

    // Close mobile menu if open
    setMobileMenuOpen(false);

    // Navigate to /login, replacing history so user can't go back
    navigate('/login', { replace: true });
  };

  // Decide the home path based on the user's role
  let homePath = '/';
  if (user) {
    homePath = user.role === 'admin' ? '/admin' : '/faculty';
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="main-header">
      <div className="logo">
        <Link to={homePath}>Auditorium Booking</Link>
      </div>
      <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link
          to="/credits"
          className="nav-item"
          onClick={() => setMobileMenuOpen(false)}
        >
          Credits
        </Link>
        {user ? (
          <button onClick={handleLogout} className="nav-item logout-btn">
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="nav-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
