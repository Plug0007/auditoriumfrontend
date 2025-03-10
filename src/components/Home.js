import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const location = useLocation();
  const user = location.state?.user; // If user data is passed via state

  return (
    <div className="home-container">
      {user ? (
        <>
          <h1>Welcome back, {user.username}!</h1>
          <p>This is your home page. Use the navigation above to access your dashboard, support, and credits.</p>
        </>
      ) : (
        <>
          <h1>Welcome to Auditorium Booking</h1>
          <p>Please log in to access your dashboard and enjoy our features.</p>
        </>
      )}
    </div>
  );
};

export default Home;
