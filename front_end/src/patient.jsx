import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ArrowLeft, Edit, FileText, Activity, Users } from 'lucide-react';
import Layout from './components/Layout/Layout';
import Card from './components/UI/Card';
import Button from './components/UI/Button';
import Input from './components/UI/Input';
import Modal from './components/UI/Modal';
import StatCard from './components/UI/StatCard';
import useStore from './store/useStore';

const Patient = () => {
  const { 
    patients, 
    setPatients, 
    resetPatients,
    addNotification 
  } = useStore();
  
  const [localPatients, setLocalPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    room: '',
    status: 'Stable',
    diagnosis: '',
    admissionDate: new Date().toISOString().split('T')[0], // Today's date
    bloodType: '',
    allergies: ''
  });
  
  useEffect(() => {
    fetch('http://localhost:5000/api/patients')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setLocalPatients(data);
            setPatients({ list: data });
            console.log("✅ Patients loaded:", data);
          } else {
            console.error("❌ Unexpected response:", data);
          }
        })
        .catch((err) => {
          console.error("❌ Error fetching patients:", err);
        });
  }, []);


  useEffect(() => {
    fetch("http://localhost:5000/api/patients/stats/total")
        .then((res) => res.json())
        .then((data) => {
          setPatients({ totalPatients: data.total });
        })
        .catch((err) => console.error("Error fetching total patients:", err));

    fetch("http://localhost:5000/api/patients/stats/today")
        .then((res) => res.json())
        .then((data) => {
          setPatients({ admittedToday: data.admittedToday });
        })
        .catch((err) => console.error("Error fetching today's admitted patients:", err));

    fetch("http://localhost:5000/api/patients/stats/critical")
        .then((res) => res.json())
        .then((data) => {
          setPatients({ criticalCount: data.criticalCount });
        })
        .catch((err) => console.error("Error fetching critical patients:", err));
  }, []);


  useEffect(() => {
    fetch('http://localhost:5000/api/patients/stats/total')
        .then(response => response.json())
        .then(data => {
          console.log('API response:', data);
          setPatients({ totalPatients: data.total });
        })
        .catch(error => {
          console.error('Error fetching total patients:', error);
        });
  }, []);

  const handleSearchChange = (e) => {
    setPatients({ searchTerm: e.target.value });
  };

  const handlePatientClick = (patient) => {
    setPatients({ selectedPatient: patient });
  };

  const handleBackToList = () => {
    setPatients({ selectedPatient: null });
  };

  const handleAddPatient = () => {
    setPatients({ showAddModal: true });
  };

  const handleCloseAddModal = () => {
    setPatients({ showAddModal: false });
    // Reset the form
    setNewPatient({
      name: '',
      age: '',
      gender: 'Male',
      room: '',
      status: 'Stable',
      diagnosis: '',
      admissionDate: new Date().toISOString().split('T')[0],
      bloodType: '',
      allergies: ''
    });
  };

  const handleRemovePatient = (patient) => {
    setPatients({ 
      patientToRemove: patient,
      showRemoveModal: true 
    });
  };

  const confirmRemovePatient = () => {
    const updatedPatients = localPatients.filter(patient => patient.id !== patients.patientToRemove.id);
    setLocalPatients(updatedPatients);
    setPatients({ 
      list: updatedPatients,
      showRemoveModal: false,
      patientToRemove: null,
      selectedPatient: patients.selectedPatient?.id === patients.patientToRemove?.id ? null : patients.selectedPatient
    });
    // If we're removing the currently selected patient, go back to the list
    addNotification({
      type: 'success',
      title: 'Patient Removed',
      message: 'Patient has been successfully removed from the system.'
    });
  };

  const handleNewPatientChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNewPatient = (e) => {
    e.preventDefault();
    const newId = Math.max(...localPatients.map(p => p.id || 0)) + 1;
    const patientToAdd = {
      ...newPatient,
      id: newId,
      age: parseInt(newPatient.age, 10) || 0
    };
    
    const updatedPatients = [...localPatients, patientToAdd];
    setLocalPatients(updatedPatients);
    setPatients({ list: updatedPatients });
    handleCloseAddModal();
    addNotification({
      type: 'success',
      title: 'Patient Added',
      message: 'New patient has been successfully added to the system.'
    });
  };
  
  const filteredPatients = localPatients.filter(patient =>
      (patient.full_name?.toLowerCase() || '').includes(patients.searchTerm.toLowerCase()) ||
      (patient.diagnosis?.toLowerCase() || '').includes(patients.searchTerm.toLowerCase()) ||
      (patient.room || '').includes(patients.searchTerm)
  );

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'critical': return 'status-critical';
      case 'stable': return 'status-stable';
      case 'improving': return 'status-improving';
      default: return '';
    }
  };

  return (
    <Layout title="Patient Management" subtitle="Manage patient records and information">
      <div className="p-6">
        {!patients.selectedPatient ? (
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Input
                placeholder="Search patients..."
                value={patients.searchTerm}
                onChange={handleSearchChange}
                icon={Search}
                className="w-full sm:w-80"
              />
              <Button
                onClick={handleAddPatient}
                icon={Plus}
                variant="primary"
              >
                Add Patient
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Patients"
                value={patients.totalPatients}
                icon={Users}
                color="blue"
              />
              <StatCard
                title="Admitted Today"
                value={patients.admittedToday}
                icon={Plus}
                color="green"
              />
              <StatCard
                title="Critical Condition"
                value={patients.criticalCount}
                icon={Activity}
                color="red"
              />
            </div>

            {/* Patients Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">DOB</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Room</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Diagnosis</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Admitted</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr 
                        key={patient.patient_id || patient.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handlePatientClick(patient)}
                      >
                        <td className="py-3 px-4 font-medium text-gray-800">
                          {patient.full_name || patient.name}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {patient.date_of_birth}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {patient.room || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            patient.status === 'Critical' 
                              ? 'bg-red-100 text-red-800'
                              : patient.status === 'Stable'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {patient.status || 'Stable'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {patient.diagnosis || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {patient.admissionDate || patient.registration_date}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePatient(patient);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
      ) : (
          {/* Patient Detail View */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                icon={ArrowLeft}
                onClick={handleBackToList}
              >
                Back to List
              </Button>
            </div>

            <Card>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {patients.selectedPatient.full_name || patients.selectedPatient.name}
                    </h2>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      patients.selectedPatient.status === 'Critical' 
                        ? 'bg-red-100 text-red-800'
                        : patients.selectedPatient.status === 'Stable'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {patients.selectedPatient.status || 'Stable'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3 mt-4 lg:mt-0">
                  <Button variant="outline" icon={Edit}>
                    Edit Patient
                  </Button>
                  <Button variant="outline" icon={FileText}>
                    View Chart
                  </Button>
                  <Button 
                    variant="danger" 
                    icon={Trash2}
                    onClick={() => handleRemovePatient(patients.selectedPatient)}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Personal Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{patients.selectedPatient.age || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{patients.selectedPatient.gender || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span className="font-medium">{patients.selectedPatient.room || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admitted:</span>
                      <span className="font-medium">
                        {patients.selectedPatient.admissionDate || patients.selectedPatient.registration_date || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Medical Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Diagnosis:</span>
                      <span className="font-medium">{patients.selectedPatient.diagnosis || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Type:</span>
                      <span className="font-medium">A+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allergies:</span>
                      <span className="font-medium">Penicillin</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add Patient Modal */}
        <Modal
          isOpen={patients.showAddModal}
          onClose={handleCloseAddModal}
          title="Add New Patient"
          size="lg"
        >
          <form onSubmit={handleSubmitNewPatient} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={newPatient.name}
                onChange={handleNewPatientChange}
                required
              />
              <Input
                label="Age"
                name="age"
                type="number"
                value={newPatient.age}
                onChange={handleNewPatientChange}
                min="0"
                max="120"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={newPatient.gender}
                  onChange={handleNewPatientChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input
                label="Room Number"
                name="room"
                value={newPatient.room}
                onChange={handleNewPatientChange}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={newPatient.status}
                  onChange={handleNewPatientChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Stable">Stable</option>
                  <option value="Improving">Improving</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <Input
                label="Diagnosis"
                name="diagnosis"
                value={newPatient.diagnosis}
                onChange={handleNewPatientChange}
                required
              />
              <Input
                label="Admission Date"
                name="admissionDate"
                type="date"
                value={newPatient.admissionDate}
                onChange={handleNewPatientChange}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                <select
                  name="bloodType"
                  value={newPatient.bloodType}
                  onChange={handleNewPatientChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <Input
                label="Allergies"
                name="allergies"
                value={newPatient.allergies}
                onChange={handleNewPatientChange}
                placeholder="Separate with commas"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseAddModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Patient
              </Button>
            </div>
          </form>
        </Modal>

        {/* Remove Confirmation Modal */}
        <Modal
          isOpen={patients.showRemoveModal}
          onClose={() => setPatients({ showRemoveModal: false, patientToRemove: null })}
          title="Remove Patient"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to remove{' '}
              <strong>{patients.patientToRemove?.full_name || patients.patientToRemove?.name}</strong>{' '}
              from the patient list?
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setPatients({ showRemoveModal: false, patientToRemove: null })}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmRemovePatient}>
                Remove
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Patient;