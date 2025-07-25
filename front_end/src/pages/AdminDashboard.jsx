import { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';

const statsEndpoints = [
    { label: 'Doctors', endpoint: '/api/doctors/stats/total', key: 'doctors' },
    { label: 'Patients', endpoint: '/api/patients/stats/total', key: 'patients' },
    { label: 'Appointments', endpoint: '/api/appointments/stats/total', key: 'appointments' },
    { label: 'Billing', endpoint: '/api/appointments/stats/billing', key: 'billing' },
    { label: 'Pharmacy', endpoint: '/api/pharmacy/stats/total', key: 'pharmacy' },
    { label: 'Labs', endpoint: '/api/lab/stats/total', key: 'labs' },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            const results = await Promise.all(
                statsEndpoints.map(async ({ endpoint, key }) => {
                    try {
                        const res = await fetch(endpoint);
                        const data = await res.json();
                        return { key, value: data.total || data.count || 0 };
                    } catch {
                        return { key, value: 0 };
                    }
                })
            );
            setStats(Object.fromEntries(results.map(({ key, value }) => [key, value])));
            setLoading(false);
        }
        fetchStats();
    }, []);

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {statsEndpoints.map(({ label, key }) => (
                    <div key={key} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <div className="text-2xl font-semibold text-blue-600 mb-2">{label}</div>
                        <div className="text-4xl font-bold text-gray-800">{loading ? '...' : stats[key] ?? 0}</div>
                    </div>
                ))}
            </div>
            {/* Management tables and navigation will go here */}
        </Layout>
    );
} 