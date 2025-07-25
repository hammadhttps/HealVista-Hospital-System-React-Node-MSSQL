import { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import Table from '../components/UI/Table';
import useAuthStore from '../store/useAuthStore';

const appointmentColumns = [
    { header: 'Appointment ID', accessor: 'appointment_id' },
    { header: 'Patient ID', accessor: 'patient_id' },
    { header: 'Date', accessor: 'appointment_date' },
    { header: 'Status', accessor: 'status' },
];

const patientColumns = [
    { header: 'Patient ID', accessor: 'patient_id' },
    { header: 'Full Name', accessor: 'full_name' },
    { header: 'Gender', accessor: 'gender' },
    { header: 'Contact Info', accessor: 'contact_info' },
];

export default function DoctorDashboard() {
    const user = useAuthStore((state) => state.user);
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch appointments for this doctor
                const appRes = await fetch(`/api/appointments/doctor/${user?.user_id}`);
                const appData = await appRes.json();
                setAppointments(appData);
                // Fetch all patients (could be filtered by doctor if backend supports)
                const patRes = await fetch('/api/appoint_patients');
                const patData = await patRes.json();
                setPatients(patData);
                // Fetch labs for this doctor (if endpoint exists, else fetch all labs)
                const labRes = await fetch('/api/lab');
                const labData = await labRes.json();
                setLabs(labData.filter(l => appData.some(a => a.patient_id === l.patient_id)));
            } catch {
                setAppointments([]);
                setPatients([]);
                setLabs([]);
            }
            setLoading(false);
        }
        if (user?.user_id) fetchData();
    }, [user]);

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <div className="text-2xl font-semibold text-blue-600 mb-2">Today's Appointments</div>
                    <div className="text-4xl font-bold text-gray-800">{loading ? '...' : appointments.length}</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <div className="text-2xl font-semibold text-blue-600 mb-2">Total Patients</div>
                    <div className="text-4xl font-bold text-gray-800">{loading ? '...' : patients.length}</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <div className="text-2xl font-semibold text-blue-600 mb-2">Pending Labs</div>
                    <div className="text-4xl font-bold text-gray-800">{loading ? '...' : labs.length}</div>
                </div>
            </div>
            <h2 className="text-xl font-bold mb-4">Appointments</h2>
            <Table columns={appointmentColumns} data={appointments} />
            <h2 className="text-xl font-bold mt-8 mb-4">Patients</h2>
            <Table columns={patientColumns} data={patients} />
            <h2 className="text-xl font-bold mt-8 mb-4">Labs (Placeholder)</h2>
            <Table columns={[
                { header: 'Test ID', accessor: 'test_id' },
                { header: 'Patient ID', accessor: 'patient_id' },
                { header: 'Test Name', accessor: 'test_name' },
                { header: 'Result', accessor: 'result' },
                { header: 'Test Date', accessor: 'test_date' },
            ]} data={labs} />
            <h2 className="text-xl font-bold mt-8 mb-4">Pharmacy (Placeholder)</h2>
            <div className="bg-white rounded-xl shadow p-6 mb-8">Pharmacy integration coming soon.</div>
            <h2 className="text-xl font-bold mt-8 mb-4">Ambulances (Placeholder)</h2>
            <div className="bg-white rounded-xl shadow p-6 mb-8">Ambulance integration coming soon.</div>
        </Layout>
    );
} 