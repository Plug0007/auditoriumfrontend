import React from 'react';
import '../styles/Credits.css';
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

const Credits = () => {
  return (
    <div className="credits-container">
      <div className="credits-card">
        <h1>Maharashtra Cllg App</h1>
        <p className="tagline">Innovating Through Code & Design</p>
        <p>
          Designed, Developed, and Secured by <strong>Aadil Badhra</strong>
        </p>
        <p>
          Passionate about cybersecurity and building seamless digital experiences.
        </p>
        <div className="social-icons">
          <a
            href="https://www.instagram.com/raelyaan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/in/Raelyaan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/Plug0007"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Credits;
