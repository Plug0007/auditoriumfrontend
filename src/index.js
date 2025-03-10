// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './styles/App.css';

// Import Firebase messaging
import { messaging } from './firebase';

// Request notification permission and get FCM token
messaging.requestPermission()
  .then(() => messaging.getToken())
  .then((token) => {
    console.log('FCM Token:', token);
    // Optionally, send this token to your backend to enable push notifications
  })
  .catch((err) => {
    console.log('Permission denied or error occurred', err);
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Register the service worker for PWA support
serviceWorkerRegistration.register();
