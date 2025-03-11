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
 */
function StartupRedirect() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    // If user is admin, go to /admin; if faculty, go to /faculty
    return <Navigate to={user.role === 'admin' ? '/admin' : '/faculty'} replace />;
  }
  // No user found, go to /login (or show a public page if you prefer)
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
