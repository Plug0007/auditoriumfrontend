// frontend/src/components/PwaIntro.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PwaIntro.css';

const PwaIntro = () => {
  const [showIntro, setShowIntro] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the intro has already been shown
    const introShown = localStorage.getItem('pwaIntroShown');
    if (!introShown) {
      setShowIntro(true);
    } else {
      // If already shown, redirect to login
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleContinue = () => {
    // Set flag to not show intro again and navigate to login
    localStorage.setItem('pwaIntroShown', 'true');
    navigate('/login', { replace: true });
  };

  if (!showIntro) {
    return null;
  }

  return (
    <div className="pwa-intro-container">
      <div className="pwa-intro-content">
        <h1>Welcome to Auditorimun Booking</h1>
        <p>
          Experience a modern and seamless way to manage your auditorium events.
        </p>
        <button className="pwa-intro-btn" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default PwaIntro;
