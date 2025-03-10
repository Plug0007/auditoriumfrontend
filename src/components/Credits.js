import React from 'react';
import '../styles/Credits.css';

const Credits = () => {
  return (
    <div className="credits-container">
      <div className="credits-card">
        <h1>Credits</h1>
        <p>
          Developed by <strong>Raelyaan</strong> using a modern design.
        </p>
        <p>
          Inspired by a beautiful color palette:
          <br />
          <span className="color-sample" style={{ background: '#E1E6E7' }}>Platinum</span>
          <span className="color-sample" style={{ background: '#DC9389' }}>Light Coral</span>
          <span className="color-sample" style={{ background: '#63A4B7' }}>Moonstone</span>
          <span className="color-sample" style={{ background: '#FDFEFC' }}>Baby Powder</span>
          <span className="color-sample" style={{ background: '#9EB4BB' }}>Cadet Gray</span>
        </p>
      </div>
    </div>
  );
};

export default Credits;
