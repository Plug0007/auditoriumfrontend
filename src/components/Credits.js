import React from 'react';
import '../styles/Credits.css';

const Credits = () => {
  return (
    <div className="credits-container">
      <div className="credits-card">
        <h1>Credits</h1>
        <p>
          Designed, Developed, and Secured by <strong>Aadil Badhra</strong> – an emerging cybersecurity student with a passion for coding.
        </p>
        <p>
          Achievements include winning the <strong>VSIT Maske Coder</strong> competition and clearing Stage 1 of the <strong>National Degree Level Code Execution Championship</strong>.
        </p>
        <p>
          Connect on{' '}
          <a
            href="www.linkedin.com/in/aadil-badhra-09819931a"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Credits;
