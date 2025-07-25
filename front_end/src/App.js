import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';
import Dashboard from './dashboard';
import Patient from './patient';
import Ward from './ward';
import Ambu from './ambu';
import Fin  from './fin';
import Med from './med';
import Lab from './lab';
import Doctors from './doc';

import NeumorphicLogin from './Counter';

function PrivateRoute({ children, adminOnly, doctorOnly, patientOnly }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  if (doctorOnly && user.role !== 'doctor') return <Navigate to="/" />;
  if (patientOnly && user.role !== 'patient') return <Navigate to="/" />;
  return children;
}

function App() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<NeumorphicLogin />} />
        <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
        <Route path="/doctor" element={<PrivateRoute doctorOnly={true}><DoctorDashboard /></PrivateRoute>} />
        <Route path="/patient" element={<PrivateRoute patientOnly={true}><PatientDashboard /></PrivateRoute>} />
        {/* Fallback: redirect to role dashboard if logged in */}
        <Route path="/" element={
          user.role === 'admin' ? <Navigate to="/admin" /> :
          user.role === 'doctor' ? <Navigate to="/doctor" /> :
          user.role === 'patient' ? <Navigate to="/patient" /> :
          <Navigate to="/login" />
        } />
        {/* Other routes for legacy pages if needed */}
        <Route path="/ward" element={<PrivateRoute><Ward /></PrivateRoute>} />
        <Route path="/ambu" element={<PrivateRoute><Ambu /></PrivateRoute>} />
        <Route path="/fin" element={<PrivateRoute><Fin /></PrivateRoute>} />
        <Route path="/med" element={<PrivateRoute><Med /></PrivateRoute>} />
        <Route path="/lab" element={<PrivateRoute><Lab /></PrivateRoute>} />
        <Route path="/doc" element={<PrivateRoute><Doctors /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
