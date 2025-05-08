import { useState, useEffect } from 'react';
import { ArrowLeft, Search, FileText, Clock, Filter, CheckCircle, X, Download, Printer, RefreshCw } from 'lucide-react';
import axios from 'axios';
import './lab.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Lab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch lab tests from API
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/lab`);
        setLabTests(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching lab tests:', err);
        setError('Failed to load lab tests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTests();
  }, []);
  
  // Filter tests based on search term
  const filteredTests = labTests.filter(test => {
    const matchesSearch = 
      test.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      test.test_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleViewTest = async (test) => {
    try {
      // Fetch detailed test info
      const response = await axios.get(`${API_URL}/lab/${test.test_id}`);
      setSelectedTest(response.data);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching test details:', err);
      alert('Failed to load test details. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTest(null);
  };
  
  const handleRequestRetest = async () => {
    if (!selectedTest) return;
    
    try {
      // Create a new test based on the current one
      const retestData = {
        patient_id: selectedTest.patient_id,
        test_name: selectedTest.test_name,
        result: null
      };
      
      await axios.post(`${API_URL}/lab`, retestData);
      
      // Refresh the tests list
      const response = await axios.get(`${API_URL}/lab`);
      setLabTests(response.data);
      
      closeModal();
      alert('Retest has been requested successfully');
    } catch (err) {
      console.error('Error requesting retest:', err);
      alert('Failed to request retest. Please try again.');
    }
  };

  // Calculate patient age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            <FileText size={18} />
            <div className="stat-content">
              <h3>Total Tests</h3>
              <p>{labTests.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lab-tests-container">
        {loading ? (
          <div className="loading">Loading lab tests...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <table className="lab-tests-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Test Name</th>
                <th>Date</th>
                <th>Result</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.length > 0 ? (
                filteredTests.map(test => (
                  <tr key={test.test_id}>
                    <td>#{test.test_id}</td>
                    <td>{test.patientName}</td>
                    <td>{test.test_name}</td>
                    <td>{formatDate(test.test_date)}</td>
                    <td>{test.result || 'Pending'}</td>
                    <td>
                      <button className="view-btn" onClick={() => handleViewTest(test)}>View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">No lab tests found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
                    <span className="detail-value">{selectedTest.patient_id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{calculateAge(selectedTest.date_of_birth)} years</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value">{selectedTest.gender}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Contact Info:</span>
                    <span className="detail-value">{selectedTest.contact_info}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Registration Date:</span>
                    <span className="detail-value">{formatDate(selectedTest.registration_date)}</span>
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
                    <span className="detail-label">Test ID:</span>
                    <span className="detail-value">#{selectedTest.test_id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Test Name:</span>
                    <span className="detail-value">{selectedTest.test_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Test Date:</span>
                    <span className="detail-value">{formatDate(selectedTest.test_date)}</span>
                  </div>
                </div>
              </div>

              {/* Result Section */}
              <div className="detail-section">
                <h3 className="section-title">
                  <span className="section-icon">📊</span> Test Result
                </h3>
                <div className="results-box">
                  <pre className="result-content">{selectedTest.result || 'No results available yet'}</pre>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="modal-footer">
              <button className="action-btn print-btn">
                <Printer size={16} /> Print
              </button>
              <button 
                className="action-btn retest-btn"
                onClick={handleRequestRetest}
              >
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