import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './dashboard';
import Patient from './patient';
import Ward from './ward';
import Ambu from './ambu';
import Fin  from './fin';
import Med from './med';
import Lab from './lab';
import Doctors from './doc';
import NeumorphicLogin from './Counter';
import api from './api';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const [usersRes, patientsRes, doctorsRes, appointmentsRes, billingRes, medicinesRes, labTestsRes] = await Promise.all([
          api.get('/users'),
          api.get('/patients/stats/total'),
          api.get('/doctors/stats/total'),
          api.get('/appointments/stats/total'),
          api.get('/appointments/stats/billing'),
          api.get('/pharmacy/stats/total'),
          api.get('/lab/stats/total'),
        ]);
        setUsers(usersRes.data);
        setStats({
          patients: patientsRes.data.total,
          doctors: doctorsRes.data.total,
          appointments: appointmentsRes.data.total,
          billing: billingRes.data.total,
          medicines: medicinesRes.data.total,
          labTests: labTestsRes.data.total,
        });
      } catch (err) {
        setError('Failed to load admin data.');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div style={{padding:40}}>Loading admin dashboard...</div>;
  if (error) return <div style={{padding:40, color:'red'}}>{error}</div>;

  return (
    <div style={{padding:40}}>
      <h2>Admin Dashboard</h2>
      <h3>Hospital Stats</h3>
      <ul>
        <li><b>Total Patients:</b> {stats.patients}</li>
        <li><b>Total Doctors:</b> {stats.doctors}</li>
        <li><b>Total Appointments:</b> {stats.appointments}</li>
        <li><b>Total Billing Records:</b> {stats.billing}</li>
        <li><b>Total Medicines:</b> {stats.medicines}</li>
        <li><b>Total Lab Tests:</b> {stats.labTests}</li>
      </ul>
      <h3>All Users</h3>
      <table border="1" cellPadding="8" style={{marginTop:20, borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.username}</td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PrivateRoute({ children, adminOnly }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<NeumorphicLogin />} />
        <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/patient" element={<PrivateRoute><Patient /></PrivateRoute>} />
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
