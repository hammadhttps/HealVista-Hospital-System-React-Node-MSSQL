import React, { useState } from 'react';
import './Patient.css';

const Patient = () => {
  // Sample patient data
  const [patients, setPatients] = useState([
    { id: 1, name: 'John Doe', age: 45, gender: 'Male', room: '201', status: 'Stable', diagnosis: 'Pneumonia', admissionDate: '2025-04-28' },
    { id: 2, name: 'Jane Smith', age: 67, gender: 'Female', room: '105', status: 'Critical', diagnosis: 'Heart Failure', admissionDate: '2025-05-01' },
    { id: 3, name: 'Robert Johnson', age: 34, gender: 'Male', room: '312', status: 'Stable', diagnosis: 'Appendicitis', admissionDate: '2025-05-03' },
    { id: 4, name: 'Maria Garcia', age: 52, gender: 'Female', room: '210', status: 'Improving', diagnosis: 'Diabetes', admissionDate: '2025-04-25' },
    { id: 5, name: 'James Wilson', age: 78, gender: 'Male', room: '114', status: 'Stable', diagnosis: 'Stroke', admissionDate: '2025-04-30' },
    { id: 6, name: 'Sarah Lee', age: 29, gender: 'Female', room: '307', status: 'Stable', diagnosis: 'Bronchitis', admissionDate: '2025-05-05' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

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
  
  // Icon for back button
  const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.room.includes(searchTerm)
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
        <div className="search-container">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      {!selectedPatient ? (
        <>
          <div className="patient-stats">
            <div className="stat-card">
              <h3>Total Patients</h3>
              <p className="stat-number">1,284</p>
            </div>
            <div className="stat-card">
              <h3>Admitted Today</h3>
              <p className="stat-number">42</p>
            </div>
            <div className="stat-card">
              <h3>Critical Condition</h3>
              <p className="stat-number">17</p>
            </div>
          </div>

          <div className="patient-table-container">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Diagnosis</th>
                  <th>Admitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} onClick={() => handlePatientClick(patient)}>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.room}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td>{patient.diagnosis}</td>
                    <td>{patient.admissionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="patient-detail">
          <button className="back-button" onClick={handleBackToList} title="Back to Patient List">
            <BackIcon />
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
    </div>
  );
};

export default Patient;