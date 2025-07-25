import { useState, useEffect } from 'react';
import { ArrowLeft, Search, FileText, X, Plus, Edit, Trash2, Download, Printer, RefreshCw } from 'lucide-react';
import axios from 'axios';
import './lab.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Lab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    test_name: '',
    result: ''
  });

  // Fetch lab tests from API
  useEffect(() => {
    fetchTests();
  }, []);

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

  // Filter tests based on search term
  const filteredTests = labTests.filter(test => {
    const matchesSearch = 
      test.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      test.test_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleViewTest = async (test) => {
    try {
      const response = await axios.get(`${API_URL}/lab/${test.test_id}`);
      setSelectedTest(response.data);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching test details:', err);
      alert('Failed to load test details. Please try again.');
    }
  };

  const handleEditTest = (test) => {
    setSelectedTest(test);
    setFormData({
      patient_id: test.patient_id,
      test_name: test.test_name,
      result: test.result || ''
    });
    setShowModal(true);
  };

  const handleAddTest = () => {
    setFormData({
      patient_id: '',
      test_name: '',
      result: ''
    });
    setShowAddModal(true);
  };

  const handleDeleteTest = (test) => {
    setSelectedTest(test);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowAddModal(false);
    setShowDeleteModal(false);
    setSelectedTest(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTest) {
        // Update existing test
        await axios.put(`${API_URL}/lab/${selectedTest.test_id}`, formData);
        alert('Test updated successfully');
      } else {
        // Create new test
        await axios.post(`${API_URL}/lab`, formData);
        alert('Test added successfully');
      }
      fetchTests();
      closeModal();
    } catch (err) {
      console.error('Error saving test:', err);
      alert('Failed to save test. Please try again.');
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/lab/${selectedTest.test_id}`);
      alert('Test deleted successfully');
      fetchTests();
      closeModal();
    } catch (err) {
      console.error('Error deleting test:', err);
      alert('Failed to delete test. Please try again.');
    }
  };

  const handleRequestRetest = async () => {
    if (!selectedTest) return;
    
    try {
      const retestData = {
        patient_id: selectedTest.patient_id,
        test_name: selectedTest.test_name,
        result: null
      };
      
      await axios.post(`${API_URL}/lab`, retestData);
      fetchTests();
      closeModal();
      alert('Retest has been requested successfully');
    } catch (err) {
      console.error('Error requesting retest:', err);
      alert('Failed to request retest. Please try again.');
    }
  };

  // Helper functions
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
          <button className="back-button">
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
        
        <button className="add-test-btn" onClick={handleAddTest}>
          <Plus size={18} />
          <span>Add New Test</span>
        </button>
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
                    <td className="actions-cell">
                      <button className="action-btn view-btn" onClick={() => handleViewTest(test)}>
                        <FileText size={16} />
                      </button>
                      <button className="action-btn edit-btn" onClick={() => handleEditTest(test)}>
                        <Edit size={16} />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDeleteTest(test)}>
                        <Trash2 size={16} />
                      </button>
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
              <h2>{selectedTest.test_id ? 'Edit Test' : 'Test Details'}</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Patient ID</label>
                  <input
                    type="text"
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Test Name</label>
                  <input
                    type="text"
                    name="test_name"
                    value={formData.test_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Result</label>
                  <textarea
                    name="result"
                    value={formData.result}
                    onChange={handleInputChange}
                    rows="4"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="submit" className="action-btn save-btn">
                  Save Changes
                </button>
                <button type="button" className="action-btn retest-btn" onClick={handleRequestRetest}>
                  <RefreshCw size={16} /> Request Retest
                </button>
                <button type="button" className="action-btn close-btn" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Test Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Test</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Patient ID</label>
                  <input
                    type="text"
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Test Name</label>
                  <input
                    type="text"
                    name="test_name"
                    value={formData.test_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Result (optional)</label>
                  <textarea
                    name="result"
                    value={formData.result}
                    onChange={handleInputChange}
                    rows="4"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="submit" className="action-btn save-btn">
                  Add Test
                </button>
                <button type="button" className="action-btn close-btn" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTest && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <p>Are you sure you want to delete this test?</p>
              <div className="test-info">
                <p><strong>Test ID:</strong> #{selectedTest.test_id}</p>
                <p><strong>Patient:</strong> {selectedTest.patientName}</p>
                <p><strong>Test Name:</strong> {selectedTest.test_name}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="action-btn delete-confirm-btn" onClick={confirmDelete}>
                Delete
              </button>
              <button className="action-btn close-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}