// frontend/src/components/LoginOrRedirect.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from './Login';

function LoginOrRedirect() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    // If user is already logged in, skip the login page
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/faculty" replace />;
    }
  }

  // Otherwise, render the normal <Login /> component
  return <Login />;
}

export default LoginOrRedirect;
