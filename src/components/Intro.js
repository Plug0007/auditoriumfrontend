// frontend/src/components/Intro.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Intro.css';

const Intro = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="intro-container">
      <div className="intro-content">
        <h1>Welcome to Auditorium Booking</h1>
        <p>
          Experience a modern, seamless way to manage your auditorium events with our intuitive interface.
        </p>
        <button className="continue-btn" onClick={handleContinue}>Continue</button>
      </div>
    </div>
  );
};

export default Intro;
