import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  let homePath = '/home'; // default home for non-logged in users
  if (user) {
    homePath = user.role === 'admin' ? '/admin' : '/faculty';
  }

  return (
    <header className="main-header">
      <div className="logo">
        <Link to={homePath}>Auditorium Booking</Link>
      </div>
      <nav className="nav-links">
        <Link to="/credits">Credits</Link>
        {user ? (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
