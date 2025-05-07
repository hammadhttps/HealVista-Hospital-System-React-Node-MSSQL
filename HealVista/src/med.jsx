import React, { useState } from 'react';
import './med.css';
import { Search, PlusCircle, MinusCircle, RefreshCw } from 'lucide-react';

const MedStock = () => {
  // Sample medication data
  const [medications, setMedications] = useState([
    { id: 1, name: 'Amoxicillin', category: 'Antibiotics', stock: 850, capacity: 1000, expiryDate: '2025-12-15', status: 'Good' },
    { id: 2, name: 'Ibuprofen', category: 'Analgesics', stock: 600, capacity: 1000, expiryDate: '2026-03-22', status: 'Good' },
    { id: 3, name: 'Paracetamol', category: 'Analgesics', stock: 450, capacity: 1000, expiryDate: '2025-08-10', status: 'Medium' },
    { id: 4, name: 'Oseltamivir', category: 'Antivirals', stock: 450, capacity: 1000, expiryDate: '2025-10-05', status: 'Medium' },
    { id: 5, name: 'Azithromycin', category: 'Antibiotics', stock: 320, capacity: 1000, expiryDate: '2025-11-30', status: 'Low' },
    { id: 6, name: 'Morphine', category: 'Analgesics', stock: 200, capacity: 500, expiryDate: '2026-01-18', status: 'Low' },
    { id: 7, name: 'Acyclovir', category: 'Antivirals', stock: 180, capacity: 400, expiryDate: '2025-09-12', status: 'Critical' },
  ]);

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for new medication form
  const [newMed, setNewMed] = useState({
    name: '',
    category: '',
    stock: 0,
    capacity: 1000,
    expiryDate: '',
    status: 'Good'
  });

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMed({
      ...newMed,
      [name]: name === 'stock' || name === 'capacity' ? parseInt(value, 10) : value
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate status based on stock level
    let status = 'Good';
    const percentage = (newMed.stock / newMed.capacity) * 100;
    if (percentage <= 20) status = 'Critical';
    else if (percentage <= 40) status = 'Low';
    else if (percentage <= 70) status = 'Medium';
    
    // Create new medication with unique ID
    const newMedication = {
      ...newMed,
      id: medications.length > 0 ? Math.max(...medications.map(med => med.id)) + 1 : 1,
      status
    };
    
    // Add new medication to state
    setMedications([...medications, newMedication]);
    
    // Reset form and close modal
    setNewMed({
      name: '',
      category: '',
      stock: 0,
      capacity: 1000,
      expiryDate: '',
      status: 'Good'
    });
    setIsModalOpen(false);
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

      <div className="med-summary">
        <div className="summary-card">
          <h3>Total Medications</h3>
          <p>{medications.length}</p>
        </div>
        <div className="summary-card">
          <h3>Low Stock Items</h3>
          <p>{medications.filter(med => (med.stock / med.capacity) < 0.3).length}</p>
        </div>
        <div className="summary-card">
          <h3>Expiring Soon</h3>
          <p>2</p>
        </div>
      </div>

      <div className="med-actions">
        <button className="action-button" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={16} />
          Add New Medication
        </button>
        <button className="action-button">
          <RefreshCw size={16} />
          Update Inventory
        </button>
      </div>

      <div className="med-table-container">
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
            {filteredMedications.map(med => (
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
                  <button className="table-button add-button">
                    <PlusCircle size={16} />
                  </button>
                  <button className="table-button remove-button">
                    <MinusCircle size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Medication Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Medication</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Medication Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newMed.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={newMed.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Analgesics">Analgesics</option>
                  <option value="Antivirals">Antivirals</option>
                  <option value="Antihistamines">Antihistamines</option>
                  <option value="Cardiovascular">Cardiovascular</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stock">Initial Stock</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={newMed.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="capacity">Max Capacity</label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={newMed.capacity}
                    onChange={handleInputChange}
                    min="100"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={newMed.expiryDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Medication
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