import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Intro from './components/Intro';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import Credits from './components/Credits';
import AlertModal from './components/AlertModal';
import './styles/App.css';

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
        <AlertModal message={alertMessage} type={alertType} onClose={() => setAlertMessage('')} />
      )}
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard showToast={showAlert} />} />
        <Route path="/faculty" element={<FacultyDashboard showToast={showAlert} />} />
        <Route path="/credits" element={<Credits />} />
      </Routes>
    </>
  );
}

export default App;
