// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/App.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Provided by Create React App

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Register service worker for offline and PWA features
serviceWorkerRegistration.register();
