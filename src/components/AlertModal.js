import React from 'react';
import '../styles/AlertModal.css';

const AlertModal = ({ message, type = 'info', onClose }) => {
  // Determine the title based on type.
  const title =
    type === 'error'
      ? 'Error'
      : type === 'success'
      ? 'Success'
      : 'Notification';

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className={`alert-modal ${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="alert-header">
          <span className="alert-title">{title}</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="alert-body">
          <p>{message}</p>
        </div>
        <div className="alert-footer">
          <button className="alert-ok-btn" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
