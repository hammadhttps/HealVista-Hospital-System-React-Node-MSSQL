import { useState } from 'react';
import { ArrowLeft, Search, FileText, Clock, Filter, CheckCircle, X, Download, Printer, RefreshCw } from 'lucide-react';
import './lab.css';
export default function Lab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTest, setSelectedTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Sample lab data
  const labTests = [
    { 
      id: 1, 
      patientName: 'John Doe', 
      patientId: 'P-10045',
      age: 45,
      gender: 'Male',
      testType: 'Blood Work', 
      testCode: 'CBC-101',
      status: 'Completed', 
      date: '07 May 2025', 
      priority: 'Normal', 
      result: 'Normal',
      resultDetails: [
        { parameter: 'Hemoglobin', value: '13.2 g/dL', range: '13.0–17.0', flag: 'Normal' },
        { parameter: 'WBC Count', value: '4.5 x10^9/L', range: '4.0–11.0', flag: 'Normal' },
        { parameter: 'Platelets', value: '110 x10^9/L', range: '150–400', flag: 'Low' }
      ],
      remarks: 'No immediate concern. Monitor platelet levels.'
    },
    { 
      id: 2, 
      patientName: 'Sarah Johnson', 
      patientId: 'P-10046',
      age: 32,
      gender: 'Female',
      testType: 'Pathology', 
      testCode: 'PATH-203',
      status: 'Processing', 
      date: '07 May 2025', 
      priority: 'Urgent', 
      result: 'Pending',
      resultDetails: [],
      remarks: 'Urgent processing requested by Dr. Roberts.'
    },
    { 
      id: 3, 
      patientName: 'Michael Chen', 
      patientId: 'P-10047',
      age: 28,
      gender: 'Male',
      testType: 'Radiology', 
      testCode: 'RAD-304',
      status: 'Pending', 
      date: '07 May 2025', 
      priority: 'High', 
      result: 'Pending',
      resultDetails: [],
      remarks: 'Schedule for priority imaging.'
    },
    { 
      id: 4, 
      patientName: 'Emily Wilson', 
      patientId: 'P-10048',
      age: 51,
      gender: 'Female',
      testType: 'Blood Work', 
      testCode: 'CBC-102',
      status: 'Completed', 
      date: '06 May 2025', 
      priority: 'Normal', 
      result: 'Abnormal',
      resultDetails: [
        { parameter: 'Hemoglobin', value: '11.2 g/dL', range: '12.0–16.0', flag: 'Low' },
        { parameter: 'WBC Count', value: '12.5 x10^9/L', range: '4.0–11.0', flag: 'High' },
        { parameter: 'Glucose', value: '145 mg/dL', range: '70–100', flag: 'High' }
      ],
      remarks: 'Follow-up recommended. Possibly indicative of infection.'
    },
    { 
      id: 5, 
      patientName: 'Robert Garcia', 
      patientId: 'P-10049',
      age: 62,
      gender: 'Male',
      testType: 'Pathology', 
      testCode: 'PATH-205',
      status: 'Processing', 
      date: '06 May 2025', 
      priority: 'Normal', 
      result: 'Pending',
      resultDetails: [],
      remarks: 'Standard processing time applies.'
    },
    { 
      id: 6, 
      patientName: 'Linda Taylor', 
      patientId: 'P-10050',
      age: 39,
      gender: 'Female',
      testType: 'Radiology', 
      testCode: 'RAD-301',
      status: 'Completed', 
      date: '05 May 2025', 
      priority: 'Urgent', 
      result: 'Normal',
      resultDetails: [
        { parameter: 'Chest X-Ray', value: 'No abnormalities detected', range: 'N/A', flag: 'Normal' }
      ],
      remarks: 'Normal findings. No further imaging needed at this time.'
    },
  ];

  // Filter tests based on search term and active tab
  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          test.testType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && test.status === 'Pending';
    if (activeTab === 'processing') return matchesSearch && test.status === 'Processing';
    if (activeTab === 'completed') return matchesSearch && test.status === 'Completed';
    
    return matchesSearch;
  });

  const handleViewTest = (test) => {
    setSelectedTest(test);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTest(null);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const baseStyle = {
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block'
    };
    
    let colorStyle = {};
    if (status === 'Completed') {
      colorStyle = { backgroundColor: '#C6F6D5', color: '#2F855A' };
    } else if (status === 'Processing') {
      colorStyle = { backgroundColor: '#FEEBC8', color: '#C05621' };
    } else if (status === 'Pending') {
      colorStyle = { backgroundColor: '#E2E8F0', color: '#4A5568' };
    }
    
    return <span style={{...baseStyle, ...colorStyle}}>{status}</span>;
  };

  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    const baseStyle = {
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block'
    };
    
    let colorStyle = {};
    if (priority === 'Normal') {
      colorStyle = { backgroundColor: '#E2E8F0', color: '#4A5568' };
    } else if (priority === 'High') {
      colorStyle = { backgroundColor: '#BEE3F8', color: '#2B6CB0' };
    } else if (priority === 'Urgent') {
      colorStyle = { backgroundColor: '#FED7D7', color: '#C53030' };
    }
    
    return <span style={{...baseStyle, ...colorStyle}}>{priority}</span>;
  };

  // Result badge component
  const ResultBadge = ({ result }) => {
    const baseStyle = {
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block'
    };
    
    let colorStyle = {};
    if (result === 'Normal') {
      colorStyle = { backgroundColor: '#C6F6D5', color: '#2F855A' };
    } else if (result === 'Abnormal') {
      colorStyle = { backgroundColor: '#FED7D7', color: '#C53030' };
    } else if (result === 'Pending') {
      colorStyle = { backgroundColor: '#E2E8F0', color: '#4A5568' };
    }
    
    return <span style={{...baseStyle, ...colorStyle}}>{result}</span>;
  };
  
  // Parameter Flag component for result breakdown
  const ParameterFlag = ({ flag }) => {
    const baseStyle = {
      padding: '2px 8px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '500',
      display: 'inline-block'
    };
    
    let colorStyle = {};
    let icon = '';
    
    if (flag === 'Normal') {
      colorStyle = { backgroundColor: '#C6F6D5', color: '#2F855A' };
      icon = '✓ ';
    } else if (flag === 'Low') {
      colorStyle = { backgroundColor: '#FED7D7', color: '#C53030' };
      icon = '↓ ';
    } else if (flag === 'High') {
      colorStyle = { backgroundColor: '#FED7D7', color: '#C53030' };
      icon = '↑ ';
    } else if (flag === 'Critical') {
      colorStyle = { backgroundColor: '#FEB2B2', color: '#9B2C2C' };
      icon = '⚠ ';
    }
    
    return <span style={{...baseStyle, ...colorStyle}}>{icon}{flag}</span>;
  };

  return (
    <div className="lab-container">
      <div className="lab-header">
        <div className="back-button-container">
          <button className="back-button" onClick={() => console.log('Navigate back to dashboard')}>
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
        </div>
        <h1>Laboratory Management</h1>
      </div>

      <div className="lab-controls">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search tests or patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="lab-stats">
          <div className="stat-card">
            <Clock size={18} />
            <div className="stat-content">
              <h3>Pending</h3>
              <p>{labTests.filter(t => t.status === 'Pending').length}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <Filter size={18} />
            <div className="stat-content">
              <h3>Processing</h3>
              <p>{labTests.filter(t => t.status === 'Processing').length}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <CheckCircle size={18} />
            <div className="stat-content">
              <h3>Completed</h3>
              <p>{labTests.filter(t => t.status === 'Completed').length}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <FileText size={18} />
            <div className="stat-content">
              <h3>Total</h3>
              <p>{labTests.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-container">
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Tests
        </button>
        <button 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button 
          className={`tab ${activeTab === 'processing' ? 'active' : ''}`}
          onClick={() => setActiveTab('processing')}
        >
          Processing
        </button>
        <button 
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>

      <div className="lab-tests-container">
        <table className="lab-tests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Test Type</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Result</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map(test => (
              <tr key={test.id}>
                <td>#{test.id}</td>
                <td>{test.patientName}</td>
                <td>{test.testType}</td>
                <td>{test.date}</td>
                <td><PriorityBadge priority={test.priority} /></td>
                <td><StatusBadge status={test.status} /></td>
                <td><ResultBadge result={test.result} /></td>
                <td>
                  <button className="view-btn" onClick={() => handleViewTest(test)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Test Details Modal */}
      {showModal && selectedTest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Test Details</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Patient Information Section */}
              <div className="detail-section">
                <h3 className="section-title">
                  <span className="section-icon">🧑‍⚕️</span> Patient Information
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Patient Name:</span>
                    <span className="detail-value">{selectedTest.patientName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Patient ID:</span>
                    <span className="detail-value">{selectedTest.patientId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{selectedTest.age} years</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value">{selectedTest.gender}</span>
                  </div>
                </div>
              </div>
              
              {/* Test Details Section */}
              <div className="detail-section">
                <h3 className="section-title">
                  <span className="section-icon">🧪</span> Test Details
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Test Type:</span>
                    <span className="detail-value">{selectedTest.testType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Test Code:</span>
                    <span className="detail-value">{selectedTest.testCode}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Test Date:</span>
                    <span className="detail-value">{selectedTest.date}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Priority:</span>
                    <span className="detail-value">
                      <PriorityBadge priority={selectedTest.priority} />
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">
                      <StatusBadge status={selectedTest.status} />
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Result:</span>
                    <span className="detail-value">
                      <ResultBadge result={selectedTest.result} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Result Breakdown Section - Only show if available */}
              {selectedTest.resultDetails && selectedTest.resultDetails.length > 0 && (
                <div className="detail-section">
                  <h3 className="section-title">
                    <span className="section-icon">📊</span> Result Breakdown
                  </h3>
                  <div className="results-table-container">
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
                        {selectedTest.resultDetails.map((detail, index) => (
                          <tr key={index}>
                            <td>{detail.parameter}</td>
                            <td>{detail.value}</td>
                            <td>{detail.range}</td>
                            <td>
                              <ParameterFlag flag={detail.flag} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Remarks Section */}
              <div className="detail-section">
                <h3 className="section-title">
                  <span className="section-icon">📝</span> Remarks
                </h3>
                <div className="remarks-box">
                  <p>{selectedTest.remarks}</p>
                </div>
              </div>

              {/* Attachments Section - Placeholder */}
              <div className="detail-section">
                <h3 className="section-title">
                  <span className="section-icon">📎</span> Attachments
                </h3>
                <div className="attachments-box">
                  <button className="attachment-btn">
                    <Download size={16} /> Download Report
                  </button>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="modal-footer">
              <button className="action-btn print-btn">
                <Printer size={16} /> Print
              </button>
              <button className="action-btn retest-btn">
                <RefreshCw size={16} /> Request Retest
              </button>
              <button className="action-btn close-btn-text" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}