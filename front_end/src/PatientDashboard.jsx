import React from 'react';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
    // Mock data for demonstration
    const appointments = [
        { id: 1, doctor: 'Dr. Smith', date: '2024-07-25', time: '09:00', status: 'Scheduled' },
        { id: 2, doctor: 'Dr. Johnson', date: '2024-07-26', time: '14:00', status: 'Completed' },
    ];
    const labResults = [
        { id: 1, test: 'Blood Test', result: 'Normal', date: '2024-07-20' },
        { id: 2, test: 'X-Ray', result: 'Clear', date: '2024-07-18' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-purple-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-purple-800">Patient Panel</div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li><Link to="/patient" className="block p-2 rounded hover:bg-purple-800">Dashboard</Link></li>
                        <li><Link to="/patient/appointments" className="block p-2 rounded hover:bg-purple-800">My Appointments</Link></li>
                        <li><Link to="/patient/lab-results" className="block p-2 rounded hover:bg-purple-800">Lab Results</Link></li>
                        {/* Add more patient links here */}
                    </ul>
                </nav>
            </aside>
            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                <h2 className="text-3xl font-bold mb-6 text-purple-900">Patient Dashboard</h2>
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold mb-4 text-purple-800">Upcoming Appointments</h3>
                        <ul>
                            {appointments.map(a => (
                                <li key={a.id} className="mb-2 flex justify-between items-center border-b pb-2">
                                    <span>{a.date} {a.time} - {a.doctor}</span>
                                    <span className={`px-2 py-1 rounded text-xs ${a.status === 'Scheduled' ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-800'}`}>{a.status}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold mb-4 text-purple-800">Lab Results</h3>
                        <ul>
                            {labResults.map(l => (
                                <li key={l.id} className="mb-2 flex justify-between items-center border-b pb-2">
                                    <span>{l.test} ({l.date})</span>
                                    <span className="text-gray-600 text-sm">{l.result}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Add more patient features here */}
            </main>
        </div>
    );
} 