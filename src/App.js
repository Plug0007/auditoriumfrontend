// frontend/src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Intro from './components/Intro';
import Home from './components/Home';
import Login from './components/Login';
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

/**
 * StartupRedirect:
 * - If a user is found in localStorage, redirect to their dashboard.
 * - Otherwise, redirect to /login.
 * 
 * This runs when the user visits "/". 
 * If they have not logged out, localStorage still has their account,
 * so we skip the login page and send them directly to /admin or /faculty.
 */
function StartupRedirect() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'faculty') {
      return <Navigate to="/faculty" replace />;
    } else {
      // Fallback if user.role isn't recognized
      return <Navigate to="/login" replace />;
    }
  }
  // No user found, go to /login
  return <Navigate to="/login" replace />;
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
        {/* 1. When user visits '/', check if they're already logged in */}
        <Route path="/" element={<StartupRedirect />} />

        {/* Optional public routes */}
        <Route path="/intro" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/credits" element={<Credits />} />

        {/* Protected Routes */}
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
      </Routes>
    </>
  );
}

export default App;
