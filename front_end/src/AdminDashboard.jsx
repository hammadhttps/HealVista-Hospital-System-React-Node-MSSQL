import React, { useEffect, useState } from 'react';
import api from './api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
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
                    api.get('/api/users'),
                    api.get('/api/patients/stats/total'),
                    api.get('/api/doctors/stats/total'),
                    api.get('/api/appointments/stats/total'),
                    api.get('/api/appointments/stats/billing'),
                    api.get('/api/pharmacy/stats/total'),
                    api.get('/api/lab/stats/total'),
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

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-blue-800">Healvista Admin</div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li><Link to="/admin" className="block p-2 rounded hover:bg-blue-800">Dashboard</Link></li>
                        <li><Link to="/admin/users" className="block p-2 rounded hover:bg-blue-800">Users</Link></li>
                        <li><Link to="/admin/stats" className="block p-2 rounded hover:bg-blue-800">Hospital Stats</Link></li>
                        {/* Add more admin links here */}
                    </ul>
                </nav>
            </aside>
            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                <h2 className="text-3xl font-bold mb-6 text-blue-900">Admin Dashboard</h2>
                {loading ? (
                    <div className="text-lg text-gray-600">Loading...</div>
                ) : error ? (
                    <div className="text-lg text-red-600">{error}</div>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <StatCard label="Patients" value={stats.patients} color="bg-blue-500" />
                            <StatCard label="Doctors" value={stats.doctors} color="bg-green-500" />
                            <StatCard label="Appointments" value={stats.appointments} color="bg-purple-500" />
                            <StatCard label="Billing Records" value={stats.billing} color="bg-yellow-500" />
                            <StatCard label="Medicines" value={stats.medicines} color="bg-pink-500" />
                            <StatCard label="Lab Tests" value={stats.labTests} color="bg-indigo-500" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-4 text-blue-800">All Users</h3>
                        <div className="overflow-x-auto rounded shadow bg-white">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-blue-100">
                                    <tr>
                                        <th className="p-3">User ID</th>
                                        <th className="p-3">Username</th>
                                        <th className="p-3">Full Name</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Phone</th>
                                        <th className="p-3">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.user_id} className="even:bg-blue-50">
                                            <td className="p-3">{user.user_id}</td>
                                            <td className="p-3">{user.username}</td>
                                            <td className="p-3">{user.full_name}</td>
                                            <td className="p-3">{user.email}</td>
                                            <td className="p-3">{user.phone}</td>
                                            <td className="p-3 font-semibold capitalize">{user.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

function StatCard({ label, value, color }) {
    return (
        <div className={`rounded-lg shadow p-6 text-white ${color} flex flex-col items-center`}>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-lg mt-2">{label}</div>
        </div>
    );
} 