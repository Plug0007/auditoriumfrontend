import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './styles/App.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Ensure this exists

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Register the service worker for offline support & PWA capabilities
serviceWorkerRegistration.register();
