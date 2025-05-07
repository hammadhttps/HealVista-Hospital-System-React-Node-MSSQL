import React, { useState } from 'react';
import { ChevronLeft, MapPin, Truck, Clock, Phone, User } from 'lucide-react';
import './ambu.css';

const AmbuTrack = () => {
  const [ambulances, setAmbulances] = useState([
    {
      id: 'AMB-1042',
      driver: 'Michael Chen',
      status: 'En Route',
      location: 'Main St & 5th Ave',
      eta: '4 min',
      contact: '555-0123',
      patient: 'Emma Wilson'
    },
    {
      id: 'AMB-0836',
      driver: 'Sarah Johnson',
      status: 'Arriving',
      location: 'Central Hospital',
      eta: '1 min',
      contact: '555-0234',
      patient: 'Robert Garcia'
    },
    {
      id: 'AMB-1157',
      driver: 'David Kim',
      status: 'Dispatched',
      location: 'Oak Ave & Pine St',
      eta: '8 min',
      contact: '555-0345',
      patient: 'Sophia Lee'
    },
    {
      id: 'AMB-0972',
      driver: 'Jessica Martinez',
      status: 'On Standby',
      location: 'East Wing Parking',
      eta: '--',
      contact: '555-0456',
      patient: '--'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'En Route': return '#3498db';
      case 'Arriving': return '#27ae60';
      case 'Dispatched': return '#e67e22';
      case 'On Standby': return '#95a5a6';
      default: return '#3498db';
    }
  };

  return (
    <div className="ambutrack-container">
      <div className="ambutrack-header">
        <button className="back-button" onClick={() => window.history.back()}>
          <ChevronLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        <h1>AmbuTrack</h1>
      </div>

      <div className="ambutrack-summary">
        <div className="summary-card">
          <div className="summary-title">Active Ambulances</div>
          <div className="summary-value">4</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">En Route</div>
          <div className="summary-value">1</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">On Standby</div>
          <div className="summary-value">1</div>
        </div>
      </div>

      <div className="map-container">
        <div className="map-placeholder">
          <MapPin size={48} color="#3498db" />
          <p>Map View</p>
        </div>
      </div>

      <div className="ambulance-list">
        <h2>Active Ambulances</h2>
        {ambulances.map((ambulance) => (
          <div className="ambulance-card" key={ambulance.id}>
            <div className="ambulance-header">
              <div className="ambulance-id">
                <Truck size={18} />
                {ambulance.id}
              </div>
              <div 
                className="ambulance-status" 
                style={{ backgroundColor: getStatusColor(ambulance.status) }}
              >
                {ambulance.status}
              </div>
            </div>
            <div className="ambulance-details">
              <div className="detail-item">
                <MapPin size={16} />
                <span>{ambulance.location}</span>
              </div>
              <div className="detail-item">
                <Clock size={16} />
                <span>ETA: {ambulance.eta}</span>
              </div>
              <div className="detail-item">
                <User size={16} />
                <span>Driver: {ambulance.driver}</span>
              </div>
              <div className="detail-item">
                <Phone size={16} />
                <span>{ambulance.contact}</span>
              </div>
              <div className="patient-info">
                <span className="patient-label">Patient:</span>
                <span className="patient-name">{ambulance.patient}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmbuTrack;