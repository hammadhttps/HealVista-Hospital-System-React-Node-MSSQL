import React, { useState } from 'react';
import './ward.css';

const Ward = () => {
  // Sample data for wards
  const [wards, setWards] = useState([
    { 
      id: 1, 
      name: 'General Ward', 
      capacity: 30, 
      occupied: 24, 
      staffAssigned: 6,
      status: 'Normal',
      alerts: 0,
      patients: [
        { 
          id: 101, 
          name: 'John Doe', 
          age: 45, 
          gender: 'Male',
          condition: 'Stable', 
          admissionDate: '2025-05-01',
          testResults: {
            testType: 'Blood Work',
            testDate: '2025-05-07',
            priority: 'Normal',
            status: 'Completed',
            result: 'Abnormal',
            testCode: 'BW-2025-0507',
            parameters: [
              { name: 'Hemoglobin', value: '13.2 g/dL', range: '13.0–17.0', flag: 'Normal' },
              { name: 'WBC Count', value: '4.5 x10^9/L', range: '4.0–11.0', flag: 'Normal' },
              { name: 'Platelets', value: '110 x10^9/L', range: '150–400', flag: 'Low' }
            ],
            remarks: 'No immediate concern. Monitor platelet levels.'
          }
        },
        { id: 102, name: 'Jane Smith', age: 62, gender: 'Female', condition: 'Improving', admissionDate: '2025-05-02' },
        { id: 103, name: 'Robert Johnson', age: 53, gender: 'Male', condition: 'Critical', admissionDate: '2025-04-28' }
      ] 
    },
    { 
      id: 2, 
      name: 'ICU', 
      capacity: 15, 
      occupied: 13, 
      staffAssigned: 12,
      status: 'High Alert',
      alerts: 2,
      patients: [
        { 
          id: 201, 
          name: 'Emily Brown', 
          age: 71, 
          gender: 'Female',
          condition: 'Critical', 
          admissionDate: '2025-04-30',
          testResults: {
            testType: 'Radiology',
            testDate: '2025-05-06',
            priority: 'Urgent',
            status: 'Completed',
            result: 'Abnormal',
            testCode: 'RAD-2025-0506',
            parameters: [
              { name: 'Chest X-Ray', value: 'Pulmonary Infiltrates', range: 'N/A', flag: 'Abnormal' }
            ],
            remarks: 'Significant findings indicating pneumonia. Recommend immediate treatment.'
          }
        },
        { id: 202, name: 'Michael Wilson', age: 59, gender: 'Male', condition: 'Critical', admissionDate: '2025-05-03' }
      ] 
    },
    { 
      id: 3, 
      name: 'Pediatric', 
      capacity: 20, 
      occupied: 14, 
      staffAssigned: 8,
      status: 'Normal',
      alerts: 1,
      patients: [
        { id: 301, name: 'Lily Adams', age: 7, gender: 'Female', condition: 'Stable', admissionDate: '2025-05-01' },
        { id: 302, name: 'Thomas Garcia', age: 12, gender: 'Male', condition: 'Improving', admissionDate: '2025-04-29' }
      ] 
    },
    { 
      id: 4, 
      name: 'Maternity', 
      capacity: 25, 
      occupied: 20, 
      staffAssigned: 10,
      status: 'Normal',
      alerts: 0,
      patients: [
        { id: 401, name: 'Sarah Miller', age: 34, gender: 'Female', condition: 'Stable', admissionDate: '2025-05-04' },
        { id: 402, name: 'Amanda Davis', age: 28, gender: 'Female', condition: 'Stable', admissionDate: '2025-05-03' }
      ] 
    },
    { 
      id: 5, 
      name: 'Cardiology', 
      capacity: 20, 
      occupied: 18, 
      staffAssigned: 7,
      status: 'Attention',
      alerts: 1,
      patients: [
        { id: 501, name: 'George White', age: 68, gender: 'Male', condition: 'Stable', admissionDate: '2025-04-25' },
        { id: 502, name: 'Patricia Brown', age: 75, gender: 'Female', condition: 'Critical', admissionDate: '2025-05-02' }
      ] 
    }
  ]);

  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showTestResults, setShowTestResults] = useState(false);

  const handleWardClick = (ward) => {
    setSelectedWard(ward);
  };

  const closeWardDetails = () => {
    setSelectedWard(null);
  };

  const handleViewTestResults = (patient) => {
    setSelectedPatient(patient);
    setShowTestResults(true);
  };

  const closeTestResults = () => {
    setShowTestResults(false);
    setSelectedPatient(null);
  };

  return (
    <div className="ward-container">
      <header className="ward-header">
        <div className="back-button">
          <button className="back-btn">
            <i className="fas fa-arrow-left"></i> Back
          </button>
        </div>
        <div className="ward-title">
          <h1>Ward Status</h1>
          <p>Hospital Ward Management System</p>
        </div>
        <div className="ward-actions">
          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="date-display">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      <div className="ward-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-procedures"></i>
          </div>
          <div className="summary-info">
            <h2>Total Capacity</h2>
            <p>{wards.reduce((total, ward) => total + ward.capacity, 0)}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-bed"></i>
          </div>
          <div className="summary-info">
            <h2>Occupied Beds</h2>
            <p>{wards.reduce((total, ward) => total + ward.occupied, 0)}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-user-md"></i>
          </div>
          <div className="summary-info">
            <h2>Staff On Duty</h2>
            <p>{wards.reduce((total, ward) => total + ward.staffAssigned, 0)}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon alert-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="summary-info">
            <h2>Alerts</h2>
            <p>{wards.reduce((total, ward) => total + ward.alerts, 0)}</p>
          </div>
        </div>
      </div>

      <div className="ward-grid">
        {wards.map(ward => (
          <div 
            key={ward.id} 
            className={`ward-card ${ward.status === 'High Alert' ? 'high-alert' : ward.status === 'Attention' ? 'attention' : ''}`}
            onClick={() => handleWardClick(ward)}
          >
            <div className="ward-card-header">
              <h3>{ward.name}</h3>
              {ward.alerts > 0 && <span className="alert-badge">{ward.alerts}</span>}
            </div>
            <div className="ward-card-body">
              <div className="ward-stat">
                <span className="stat-label">Capacity:</span>
                <span className="stat-value">{ward.capacity}</span>
              </div>
              <div className="ward-stat">
                <span className="stat-label">Occupied:</span>
                <span className="stat-value">{ward.occupied}</span>
              </div>
              <div className="ward-stat">
                <span className="stat-label">Available:</span>
                <span className="stat-value">{ward.capacity - ward.occupied}</span>
              </div>
              <div className="ward-stat">
                <span className="stat-label">Staff:</span>
                <span className="stat-value">{ward.staffAssigned}</span>
              </div>
            </div>
            <div className="ward-card-footer">
              <div className="occupancy-bar">
                <div 
                  className="occupancy-fill" 
                  style={{ width: `${(ward.occupied / ward.capacity) * 100}%` }}
                ></div>
              </div>
              <div className="occupancy-text">
                {Math.round((ward.occupied / ward.capacity) * 100)}% Occupied
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedWard && (
        <div className="ward-detail-overlay">
          <div className="ward-detail-container">
            <div className="ward-detail-header">
              <h2>{selectedWard.name} Details</h2>
              <button className="close-btn" onClick={closeWardDetails}>×</button>
            </div>
            <div className="ward-detail-body">
              <div className="ward-detail-stats">
                <div className="detail-stat-card">
                  <h4>Capacity</h4>
                  <p>{selectedWard.capacity}</p>
                </div>
                <div className="detail-stat-card">
                  <h4>Occupied</h4>
                  <p>{selectedWard.occupied}</p>
                </div>
                <div className="detail-stat-card">
                  <h4>Available</h4>
                  <p>{selectedWard.capacity - selectedWard.occupied}</p>
                </div>
                <div className="detail-stat-card">
                  <h4>Staff</h4>
                  <p>{selectedWard.staffAssigned}</p>
                </div>
                <div className={`detail-stat-card ${selectedWard.status === 'High Alert' ? 'high-alert' : selectedWard.status === 'Attention' ? 'attention' : 'normal'}`}>
                  <h4>Status</h4>
                  <p>{selectedWard.status}</p>
                </div>
              </div>
              
              <div className="ward-patients">
                <h3>Current Patients</h3>
                <table className="patient-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Condition</th>
                      <th>Admission Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedWard.patients.map(patient => (
                      <tr key={patient.id} className={patient.condition === 'Critical' ? 'critical-patient' : ''}>
                        <td>{patient.id}</td>
                        <td>{patient.name}</td>
                        <td>{patient.age}</td>
                        <td>{patient.gender || 'N/A'}</td>
                        <td>{patient.condition}</td>
                        <td>{patient.admissionDate}</td>
                        <td>
                          {patient.testResults && (
                            <button 
                              className="view-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewTestResults(patient);
                              }}
                            >
                              <i className="fas fa-eye"></i> View Tests
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="ward-detail-footer">
              <button className="primary-btn">Update Ward</button>
              <button className="secondary-btn">Print Report</button>
            </div>
          </div>
        </div>
      )}

      {showTestResults && selectedPatient && selectedPatient.testResults && (
        <div className="test-results-overlay">
          <div className="test-results-container">
            <div className="test-results-header">
              <h2>Test Results</h2>
              <button className="close-btn" onClick={closeTestResults}>×</button>
            </div>
            <div className="test-results-body">
              <div className="test-results-section">
                <h3>Patient Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Patient Name:</span>
                    <span className="info-value">{selectedPatient.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Patient ID:</span>
                    <span className="info-value">#{selectedPatient.id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Age:</span>
                    <span className="info-value">{selectedPatient.age}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Gender:</span>
                    <span className="info-value">{selectedPatient.gender || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="test-results-section">
                <h3>Test Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Test Type:</span>
                    <span className="info-value">{selectedPatient.testResults.testType}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Test Date:</span>
                    <span className="info-value">{selectedPatient.testResults.testDate}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Priority Level:</span>
                    <span className={`info-value priority-${selectedPatient.testResults.priority.toLowerCase()}`}>
                      {selectedPatient.testResults.priority}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className="info-value">{selectedPatient.testResults.status}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Result:</span>
                    <span className={`info-value result-${selectedPatient.testResults.result.toLowerCase()}`}>
                      {selectedPatient.testResults.result}
                    </span>
                  </div>
                  {selectedPatient.testResults.testCode && (
                    <div className="info-item">
                      <span className="info-label">Test Code:</span>
                      <span className="info-value">{selectedPatient.testResults.testCode}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedPatient.testResults.parameters && selectedPatient.testResults.parameters.length > 0 && (
                <div className="test-results-section">
                  <h3>Result Breakdown</h3>
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Value</th>
                        <th>Reference Range</th>
                        <th>Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPatient.testResults.parameters.map((param, index) => (
                        <tr key={index}>
                          <td>{param.name}</td>
                          <td>{param.value}</td>
                          <td>{param.range}</td>
                          <td>
                            <span className={`flag flag-${param.flag.toLowerCase()}`}>
                              {param.flag === 'Normal' ? '✅ Normal' : 
                               param.flag === 'Low' ? '⚠️ Low' : 
                               param.flag === 'High' ? '⚠️ High' : 
                               param.flag === 'Critical' ? '🚨 Critical' : 
                               param.flag === 'Abnormal' ? '⚠️ Abnormal' : param.flag}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedPatient.testResults.remarks && (
                <div className="test-results-section">
                  <h3>Remarks</h3>
                  <div className="remarks-box">
                    <p>{selectedPatient.testResults.remarks}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="test-results-footer">
              <button className="primary-btn">
                <i className="fas fa-download"></i> Download PDF
              </button>
              <button className="secondary-btn">
                <i className="fas fa-redo"></i> Request Retest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ward;