import React, { useState, useEffect } from 'react';
import './Patient.css';

const Patient = () => {
  // Sample patient data
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [totalPatients, setTotalPatients] = useState(0);
  const [admittedToday, setAdmittedToday] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [patientToRemove, setPatientToRemove] = useState(null);
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
            setPatients(data);
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
          setTotalPatients(data.total);
        })
        .catch((err) => console.error("Error fetching total patients:", err));

    fetch("http://localhost:5000/api/patients/stats/today")
        .then((res) => res.json())
        .then((data) => {
          setAdmittedToday(data.admittedToday);
        })
        .catch((err) => console.error("Error fetching today's admitted patients:", err));

    fetch("http://localhost:5000/api/patients/stats/critical")
        .then((res) => res.json())
        .then((data) => {
          setCriticalCount(data.criticalCount);
        })
        .catch((err) => console.error("Error fetching critical patients:", err));
  }, []);


  useEffect(() => {
    fetch('http://localhost:5000/api/patients/stats/total')
        .then(response => response.json())
        .then(data => {
          console.log('API response:', data);
          setTotalPatients(data.total);
        })
        .catch(error => {
          console.error('Error fetching total patients:', error);
        });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
  };
  
  const handleBackToDashboard = () => {
    // This would typically use router navigation
    // For now, we'll just log the action
    console.log('Navigating back to dashboard');
    // Example if using react-router: history.push('/dashboard')
  };

  const handleAddPatient = () => {
    setShowAddPatientModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddPatientModal(false);
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
    setPatientToRemove(patient);
    setShowRemoveConfirmModal(true);
  };

  const confirmRemovePatient = () => {
    setPatients(patients.filter(patient => patient.id !== patientToRemove.id));
    setShowRemoveConfirmModal(false);
    setPatientToRemove(null);
    // If we're removing the currently selected patient, go back to the list
    if (selectedPatient && selectedPatient.id === patientToRemove.id) {
      setSelectedPatient(null);
    }
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
    const newId = Math.max(...patients.map(p => p.id)) + 1;
    const patientToAdd = {
      ...newPatient,
      id: newId,
      age: parseInt(newPatient.age, 10) || 0
    };
    
    setPatients([...patients, patientToAdd]);
    handleCloseAddModal();
  };
  
  // Icon for back button
  const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );

  // Icon for add button
  const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  // Icon for remove button
  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  const filteredPatients = patients.filter(patient =>
      (patient.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (patient.diagnosis?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (patient.room || '').includes(searchTerm)
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
    <div className="patient-container">
      <div className="patient-header">
        <div className="header-left">
          <button className="back-button dashboard-back" onClick={handleBackToDashboard} title="Back to Dashboard">
            <BackIcon />
          </button>
          <h1>Patient Management</h1>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <button className="add-patient-button" onClick={handleAddPatient} title="Add New Patient">
            <AddIcon />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {!selectedPatient ? (
          <>
            <div className="patient-stats">
              <div className="stat-card">
                <h3>Total Patients</h3>
                <p className="stat-number">{totalPatients}</p>
              </div>
              <div className="stat-card">
                <h3>Admitted Today</h3>
                <p className="stat-number">{admittedToday}</p>
              </div>
              <div className="stat-card">
                <h3>Critical Condition</h3>
                <p className="stat-number">{criticalCount}</p>
              </div>
            </div>

            <div className="patient-table-container">
              <table className="patient-table">
                <thead>
                <tr>
                  <th>Name</th>
                  <th>DOB</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Diagnosis</th>
                  <th>Admitted</th>
                </tr>
                </thead>
                <tbody>
                {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td onClick={() => handlePatientClick(patient)}>{patient.full_name}</td>
                      <td onClick={() => handlePatientClick(patient)}>{patient.date_of_birth}</td>
                      <td onClick={() => handlePatientClick(patient)}>{patient.room}</td>
                      <td onClick={() => handlePatientClick(patient)}>
                      <span className={`status-badge ${getStatusClass(patient.status)}`}>
                        {patient.status}
                      </span>
                      </td>
                      <td onClick={() => handlePatientClick(patient)}>{patient.diagnosis}</td>
                      <td onClick={() => handlePatientClick(patient)}>{patient.admissionDate}</td>
                      <td>
                        <button
                            className="action-button remove"
                            onClick={() => handleRemovePatient(patient)}
                            title="Remove Patient"
                        >
                          <TrashIcon/>
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </>
      ) : (
          <div className="patient-detail">
            <button className="back-button" onClick={handleBackToList} title="Back to Patient List">
              <BackIcon/>
            </button>

            <div className="patient-profile">
              <div className="profile-header">
                <div className="profile-name-section">
                  <h2>{selectedPatient.name}</h2>
                  <span className={`status-badge ${getStatusClass(selectedPatient.status)}`}>
                  {selectedPatient.status}
                </span>
                </div>
                <div className="profile-actions">
                  <button className="action-button edit">Edit Patient</button>
                <button className="action-button chart">View Chart</button>
                <button className="action-button remove" onClick={() => handleRemovePatient(selectedPatient)}>
                  <TrashIcon />
                  <span>Remove</span>
                </button>
              </div>
            </div>
            
            <div className="profile-info-cards">
              <div className="info-card">
                <h3>Personal Details</h3>
                <div className="info-row">
                  <span className="info-label">Age:</span>
                  <span className="info-value">{selectedPatient.age}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Gender:</span>
                  <span className="info-value">{selectedPatient.gender}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Room:</span>
                  <span className="info-value">{selectedPatient.room}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Admitted:</span>
                  <span className="info-value">{selectedPatient.admissionDate}</span>
                </div>
              </div>
              
              <div className="info-card">
                <h3>Medical Information</h3>
                <div className="info-row">
                  <span className="info-label">Diagnosis:</span>
                  <span className="info-value">{selectedPatient.diagnosis}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Blood Type:</span>
                  <span className="info-value">A+</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Allergies:</span>
                  <span className="info-value">Penicillin</span>
                </div>
              </div>
            </div>
            
            <div className="medical-records">
              <h3>Recent Medical Records</h3>
              <div className="record-tabs">
                <button className="tab-button active">Vitals</button>
                <button className="tab-button">Medications</button>
                <button className="tab-button">Lab Results</button>
                <button className="tab-button">Notes</button>
              </div>
              
              <div className="records-content">
                <div className="vitals-chart">
                  <h4>Vital Signs - Last 24 Hours</h4>
                  <div className="chart-placeholder">
                    {/* Chart would go here in a real implementation */}
                    <p>Temperature, blood pressure, and heart rate charts would display here.</p>
                  </div>
                </div>
                
                <div className="vitals-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Temp</th>
                        <th>BP</th>
                        <th>Heart Rate</th>
                        <th>Resp Rate</th>
                        <th>O2 Sat</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Today 09:00</td>
                        <td>37.2°C</td>
                        <td>120/80</td>
                        <td>72 bpm</td>
                        <td>16/min</td>
                        <td>98%</td>
                      </tr>
                      <tr>
                        <td>Today 05:00</td>
                        <td>37.5°C</td>
                        <td>124/82</td>
                        <td>75 bpm</td>
                        <td>17/min</td>
                        <td>97%</td>
                      </tr>
                      <tr>
                        <td>Yesterday 21:00</td>
                        <td>37.8°C</td>
                        <td>128/84</td>
                        <td>78 bpm</td>
                        <td>18/min</td>
                        <td>96%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Add New Patient</h2>
            <form onSubmit={handleSubmitNewPatient}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={newPatient.name} 
                    onChange={handleNewPatientChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input 
                    type="number" 
                    id="age" 
                    name="age" 
                    value={newPatient.age} 
                    onChange={handleNewPatientChange}
                    min="0"
                    max="120"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select 
                    id="gender" 
                    name="gender" 
                    value={newPatient.gender} 
                    onChange={handleNewPatientChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="room">Room Number</label>
                  <input 
                    type="text" 
                    id="room" 
                    name="room" 
                    value={newPatient.room} 
                    onChange={handleNewPatientChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select 
                    id="status" 
                    name="status" 
                    value={newPatient.status} 
                    onChange={handleNewPatientChange}
                  >
                    <option value="Stable">Stable</option>
                    <option value="Improving">Improving</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="diagnosis">Diagnosis</label>
                  <input 
                    type="text" 
                    id="diagnosis" 
                    name="diagnosis" 
                    value={newPatient.diagnosis} 
                    onChange={handleNewPatientChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="admissionDate">Admission Date</label>
                  <input 
                    type="date" 
                    id="admissionDate" 
                    name="admissionDate" 
                    value={newPatient.admissionDate} 
                    onChange={handleNewPatientChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="bloodType">Blood Type</label>
                  <select 
                    id="bloodType" 
                    name="bloodType" 
                    value={newPatient.bloodType} 
                    onChange={handleNewPatientChange}
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
                
                <div className="form-group">
                  <label htmlFor="allergies">Allergies</label>
                  <input 
                    type="text" 
                    id="allergies" 
                    name="allergies" 
                    value={newPatient.allergies} 
                    onChange={handleNewPatientChange}
                    placeholder="Separate with commas"
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={handleCloseAddModal}>Cancel</button>
                <button type="submit" className="submit-button">Add Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Remove Confirmation Modal */}
      {showRemoveConfirmModal && patientToRemove && (
        <div className="modal-overlay">
          <div className="modal-card confirm-modal">
            <h2>Remove Patient</h2>
            <p>Are you sure you want to remove <strong>{patientToRemove.name}</strong> from the patient list?</p>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowRemoveConfirmModal(false)}>Cancel</button>
              <button className="delete-button" onClick={confirmRemovePatient}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patient;