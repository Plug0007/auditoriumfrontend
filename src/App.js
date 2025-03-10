// frontend/src/App.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Intro from './components/Intro'; // or PwaIntro if you prefer
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import Credits from './components/Credits';
import AlertModal from './components/AlertModal';
import './styles/App.css';

function App() {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  const showToast = (msg, type = 'success') => {
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
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard showToast={showToast} />} />
        <Route path="/faculty" element={<FacultyDashboard showToast={showToast} />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="*" element={<Intro />} />
      </Routes>
    </>
  );
}

export default App;
