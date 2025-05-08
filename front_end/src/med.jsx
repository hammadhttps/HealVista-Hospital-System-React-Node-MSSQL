import React, { useState, useEffect } from 'react';
import './med.css';
import { Search, PlusCircle, MinusCircle, RefreshCw, Trash2, Edit } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/pharmacy';

const MedStock = () => {
  // State for medications
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // State for new medication form
  const [newMed, setNewMed] = useState({
    medicine_name: '',
    stock_quantity: 0,
    expiry_date: '',
  });

  // Fetch medications from API
  const fetchMedications = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // Transform API data to match our component's structure
      const transformedData = data.map(med => ({
        id: med.medicine_id,
        name: med.medicine_name,
        // Infer category based on medicine name if needed
        category: inferCategory(med.medicine_name),
        stock: med.stock_quantity,
        // Set default capacity for display purposes
        capacity: 1000,
        expiryDate: new Date(med.expiry_date).toISOString().split('T')[0],
        status: getStatusFromStock(med.stock_quantity, 1000)
      }));
      
      setMedications(transformedData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch medications: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Simple function to infer category from medicine name
  // This is just for display purposes since category isn't in the DB
  const inferCategory = (medicineName) => {
    const nameLower = medicineName.toLowerCase();
    
    if (nameLower.includes('amox') || nameLower.includes('cillin') || 
        nameLower.includes('mycin') || nameLower.includes('floxacin')) {
      return 'Antibiotics';
    } else if (nameLower.includes('paracetamol') || nameLower.includes('ibuprofen') || 
               nameLower.includes('aspirin') || nameLower.includes('morphine')) {
      return 'Analgesics';
    } else if (nameLower.includes('vir') || nameLower.includes('tamiflu')) {
      return 'Antivirals';
    } else if (nameLower.includes('hist') || nameLower.includes('cetirizine') || 
              nameLower.includes('loratadine')) {
      return 'Antihistamines';
    } else if (nameLower.includes('stat') || nameLower.includes('pril') || 
              nameLower.includes('sartan')) {
      return 'Cardiovascular';
    }
    
    return 'Other';
  };

  // Calculate status based on stock level
  const getStatusFromStock = (stock, capacity) => {
    const percentage = (stock / capacity) * 100;
    if (percentage <= 20) return 'Critical';
    if (percentage <= 40) return 'Low';
    if (percentage <= 70) return 'Medium';
    return 'Good';
  };

  // Load medications on component mount
  useEffect(() => {
    fetchMedications();
  }, []);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMed({
      ...newMed,
      [name]: name === 'stock_quantity' ? parseInt(value, 10) || 0 : value
    });
  };

  // Function to handle adding a new medication
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const medicationData = {
        medicine_name: newMed.medicine_name,
        stock_quantity: newMed.stock_quantity,
        expiry_date: newMed.expiry_date
      };

      if (isEditMode && editId) {
        // Update existing medication
        const response = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(medicationData),
        });

        if (!response.ok) {
          throw new Error('Failed to update medication');
        }
      } else {
        // Add new medication
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(medicationData),
        });

        if (!response.ok) {
          throw new Error('Failed to add medication');
        }
      }
      
      // Refresh the medication list
      fetchMedications();
      
      // Reset form and close modal
      resetForm();
    } catch (err) {
      setError(err.message);
      console.error('Error saving medication:', err);
    }
  };

  // Function to handle deleting a medication
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete medication');
        }

        // Refresh medications list
        fetchMedications();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting medication:', err);
      }
    }
  };

  // Function to handle stock increment/decrement
  const handleStockChange = async (id, amount) => {
    try {
      // Find the medication to update
      const medication = medications.find(med => med.id === id);
      if (!medication) return;

      // Calculate new stock value
      const newStock = Math.max(0, medication.stock + amount);
      
      // Update in the database
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicine_name: medication.name,
          stock_quantity: newStock,
          expiry_date: medication.expiryDate
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      // Refresh medications
      fetchMedications();
    } catch (err) {
      setError(err.message);
      console.error('Error updating stock:', err);
    }
  };

  // Function to handle editing a medication
  const handleEdit = (med) => {
    setIsEditMode(true);
    setEditId(med.id);
    setNewMed({
      medicine_name: med.name,
      stock_quantity: med.stock,
      expiry_date: med.expiryDate
    });
    setIsModalOpen(true);
  };

  // Reset form and modal state
  const resetForm = () => {
    setNewMed({
      medicine_name: '',
      stock_quantity: 0,
      expiry_date: '',
    });
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
  };
  
  // Filter medications based on search term
  const filteredMedications = medications.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to determine progress bar color based on stock level
  const getStockColor = (stock, capacity) => {
    const percentage = (stock / capacity) * 100;
    if (percentage > 70) return '#4CD964'; // Green
    if (percentage > 40) return '#FFCC00'; // Yellow
    if (percentage > 20) return '#FF9500'; // Orange
    return '#FF3B30'; // Red
  };

  // Function to calculate width percentage for progress bar
  const getStockPercentage = (stock, capacity) => {
    return (stock / capacity) * 100;
  };

  // Calculate summary statistics
  const lowStockItems = medications.filter(med => (med.stock / 1000) < 0.3).length;
  
  // Calculate medications expiring within 30 days
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const expiringItems = medications.filter(med => {
    const expiryDate = new Date(med.expiryDate);
    return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
  }).length;

  return (
    <div className="med-stock-container">
      <div className="med-header">
        <h1>Medication Inventory</h1>
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search medications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="med-summary">
        <div className="summary-card">
          <h3>Total Medications</h3>
          <p>{medications.length}</p>
        </div>
        <div className="summary-card">
          <h3>Low Stock Items</h3>
          <p>{lowStockItems}</p>
        </div>
        <div className="summary-card">
          <h3>Expiring Soon</h3>
          <p>{expiringItems}</p>
        </div>
      </div>

      <div className="med-actions">
        <button className="action-button" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={16} />
          Add New Medication
        </button>
        <button className="action-button" onClick={fetchMedications}>
          <RefreshCw size={16} />
          Refresh Inventory
        </button>
      </div>

      <div className="med-table-container">
        {loading ? (
          <div className="loading">Loading medications...</div>
        ) : (
          <table className="med-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">No medications found</td>
                </tr>
              ) : (
                filteredMedications.map(med => (
                  <tr key={med.id}>
                    <td>{med.name}</td>
                    <td>{med.category}</td>
                    <td>
                      <div className="stock-level">
                        <div className="progress-bar">
                          <div 
                            className="progress" 
                            style={{
                              width: `${getStockPercentage(med.stock, med.capacity)}%`,
                              backgroundColor: getStockColor(med.stock, med.capacity)
                            }}
                          ></div>
                        </div>
                        <span className="stock-text">{med.stock}/{med.capacity}</span>
                      </div>
                    </td>
                    <td>{med.expiryDate}</td>
                    <td>
                      <span className={`status-badge status-${med.status.toLowerCase()}`}>
                        {med.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="table-button add-button"
                        onClick={() => handleStockChange(med.id, 10)}
                        title="Add 10 units"
                      >
                        <PlusCircle size={16} />
                      </button>
                      <button 
                        className="table-button remove-button"
                        onClick={() => handleStockChange(med.id, -10)}
                        title="Remove 10 units"
                      >
                        <MinusCircle size={16} />
                      </button>
                      <button 
                        className="table-button edit-button"
                        onClick={() => handleEdit(med)}
                        title="Edit medication"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="table-button delete-button"
                        onClick={() => handleDelete(med.id)}
                        title="Delete medication"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Medication Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditMode ? 'Edit Medication' : 'Add New Medication'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="medicine_name">Medication Name</label>
                <input
                  type="text"
                  id="medicine_name"
                  name="medicine_name"
                  value={newMed.medicine_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock_quantity">Stock Quantity</label>
                <input
                  type="number"
                  id="stock_quantity"
                  name="stock_quantity"
                  value={newMed.stock_quantity}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="expiry_date">Expiry Date</label>
                <input
                  type="date"
                  id="expiry_date"
                  name="expiry_date"
                  value={newMed.expiry_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {isEditMode ? 'Update Medication' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedStock;