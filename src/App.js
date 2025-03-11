// frontend/src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Intro from './components/Intro';
import Home from './components/Home';
// Instead of direct import of Login, we import our new wrapper
import LoginOrRedirect from './components/LoginOrRedirect';

import AdminDashboard from './components/AdminDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import Credits from './components/Credits';
import AlertModal from './components/AlertModal';
import './styles/App.css';

/**
 * PrivateRoute:
 * Checks if a user exists in localStorage.
 * If no user, redirects to /login (replace: true).
 * If a user is found, renders the children.
 */
function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  const showAlert = (msg, type = 'success') => {
    setAlertMessage(msg);
    setAlertType(type);
  };

  return (
    <>
      <Header />
      {alertMessage && (
        <AlertModal
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage('')}
        />
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/credits" element={<Credits />} />

        {/* 
          The /login route uses LoginOrRedirect:
          - If user is in localStorage, skip login
          - Else show <Login />
        */}
        <Route path="/login" element={<LoginOrRedirect />} />

        {/* Protected routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard showToast={showAlert} />
            </PrivateRoute>
          }
        />
        <Route
          path="/faculty"
          element={
            <PrivateRoute>
              <FacultyDashboard showToast={showAlert} />
            </PrivateRoute>
          }
        />

        {/* Optional catch-all to redirect to / if needed */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </>
  );
}

export default App;
