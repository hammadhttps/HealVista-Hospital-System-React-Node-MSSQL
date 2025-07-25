import React from 'react';
import { Link } from 'react-router-dom';

export default function DoctorDashboard() {
    // Mock data for demonstration
    const appointments = [
        { id: 1, patient: 'John Doe', date: '2024-07-25', time: '10:00', status: 'Scheduled' },
        { id: 2, patient: 'Jane Smith', date: '2024-07-25', time: '11:00', status: 'Completed' },
    ];
    const patients = [
        { id: 1, name: 'John Doe', diagnosis: 'Flu' },
        { id: 2, name: 'Jane Smith', diagnosis: 'Diabetes' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-green-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-green-800">Doctor Panel</div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li><Link to="/doctor" className="block p-2 rounded hover:bg-green-800">Dashboard</Link></li>
                        <li><Link to="/doctor/appointments" className="block p-2 rounded hover:bg-green-800">Appointments</Link></li>
                        <li><Link to="/doctor/patients" className="block p-2 rounded hover:bg-green-800">My Patients</Link></li>
                        {/* Add more doctor links here */}
                    </ul>
                </nav>
            </aside>
            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                <h2 className="text-3xl font-bold mb-6 text-green-900">Doctor Dashboard</h2>
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold mb-4 text-green-800">Today's Appointments</h3>
                        <ul>
                            {appointments.map(a => (
                                <li key={a.id} className="mb-2 flex justify-between items-center border-b pb-2">
                                    <span>{a.time} - {a.patient}</span>
                                    <span className={`px-2 py-1 rounded text-xs ${a.status === 'Scheduled' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{a.status}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold mb-4 text-green-800">My Patients</h3>
                        <ul>
                            {patients.map(p => (
                                <li key={p.id} className="mb-2 flex justify-between items-center border-b pb-2">
                                    <span>{p.name}</span>
                                    <span className="text-gray-600 text-sm">{p.diagnosis}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Add more doctor features here */}
            </main>
        </div>
    );
} 