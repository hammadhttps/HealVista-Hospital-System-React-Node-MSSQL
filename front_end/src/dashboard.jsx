import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, Users, Truck, DollarSign, 
  Package, FileText, Calendar, Clock
} from 'lucide-react';
import './dashboard.css';

// Data arrays
const wardData = [
  { name: 'Occupied', value: 72 },
  { name: 'Available', value: 28 },
];

const ambulanceData = [
  { name: 'Available', value: 4 },
  { name: 'On Call', value: 3 },
];

const financeData = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
];

const medicineData = [
  { name: 'Antibiotics', stock: 85 },
  { name: 'Analgesics', stock: 60 },
  { name: 'Antivirals', stock: 45 },
  { name: 'Vaccines', stock: 70 },
];

// New appointment data
const appointmentData = [
  { time: '09:00', filled: true, doctor: 'Dr. Williams' },
  { time: '10:30', filled: true, doctor: 'Dr. Johnson' },
  { time: '11:45', filled: false, doctor: 'Dr. Smith' },
  { time: '14:00', filled: false, doctor: 'Dr. Williams' },
  { time: '15:30', filled: true, doctor: 'Dr. Smith' },
];

// Color schemes
const WARD_COLORS = ['#6366f1', '#eef2ff'];
const AMBU_COLORS = ['#10b981', '#f59e0b'];

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Custom tooltip styles for charts
  const customTooltipStyle = {
    background: 'var(--bg-color)',
    borderRadius: 'var(--border-radius)',
    border: 'none',
    boxShadow: '5px 5px 10px var(--shadow-dark), -5px -5px 10px var(--shadow-light)',
    padding: '10px 14px'
  };

  // Helper function to get status badge class based on status
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Processing': return 'status-badge yellow';
      case 'Pending': return 'status-badge blue';
      case 'Completed': return 'status-badge green';
      case 'Analysis': return 'status-badge purple';
      default: return 'status-badge blue';
    }
  };

  // Helper function to get progress bar class based on stock level
  const getProgressBarClass = (stock) => {
    if (stock > 70) return 'progress-bar';
    if (stock > 50) return 'progress-bar yellow';
    return 'progress-bar red';
  };

  // Get appointment slot class based on availability
  const getAppointmentSlotClass = (filled) => {
    return filled ? 'appointment-slot filled' : 'appointment-slot available';
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="header-title">Hospital Dashboard</h1>
          <p className="header-subtitle">Welcome back, Dr. Smith</p>
        </div>
        <div className="avatar">
          <span>DS</span>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        
        {/* Patients Card */}
        <div 
          className="neumorphic-card patients-card"
          onClick={() => navigate('/patient')}
        >
          <div className="card-header">
            <div className="card-title">
              <div className="icon-container icon-blue">
                <Users size={20} />
              </div>
              <span>Patients</span>
            </div>
          </div>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-label">Total</div>
              <div className="stat-value">1,284</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Today</div>
              <div className="stat-value">42</div>
            </div>
          </div>
        </div>

        {/* Ward Status Card */}
        <div 
          className="neumorphic-card ward-card"
          onClick={() => navigate('/ward')}
        >
          <div className="card-header">
            <div className="card-title">
              <div className="icon-container icon-purple">
                <Activity size={20} />
              </div>
              <span>Ward Status</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wardData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {wardData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={WARD_COLORS[index % WARD_COLORS.length]} 
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-center-label">
              <div className="percentage">72%</div>
              <div className="label">Occupied</div>
            </div>
          </div>
        </div>

        {/* Ambulance Tracking Card */}
        <div 
          className="neumorphic-card ambu-card"
          onClick={() => navigate('/ambu')}
        >
          <div className="card-header">
            <div className="card-title">
              <div className="icon-container icon-green">
                <Truck size={20} />
              </div>
              <span>AmbuTrack</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ambulanceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {ambulanceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={AMBU_COLORS[index % AMBU_COLORS.length]} 
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-center-label">
              <div className="percentage">4/7</div>
              <div className="label">Available</div>
            </div>
          </div>
        </div>

        {/* Finances Card */}
        <div 
          className="neumorphic-card finances-card"
          onClick={() => navigate('/fin')}
        >
          <div className="card-header">
            <div className="card-title">
              <div className="icon-container icon-blue">
                <DollarSign size={20} />
              </div>
              <span>Finances</span>
            </div>
          </div>
          <div className="chart-container bar-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="var(--shadow-dark)" 
                  vertical={false}
                  opacity={0.3}
                />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-secondary)" 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar 
                  dataKey="income" 
                  fill="var(--primary-blue)" 
                  radius={[10, 10, 0, 0]} 
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="expenses" 
                  fill="var(--red)" 
                  radius={[10, 10, 0, 0]} 
                  animationDuration={1500}
                  opacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Medicine Stock Card */}
        <div 
          className="neumorphic-card medstock-card"
          onClick={() => navigate('/med')}
        >
          <div className="card-header">
            <div className="card-title">
              <div className="icon-container icon-red">
                <Package size={20} />
              </div>
              <span>MedStock</span>
            </div>
          </div>
          {medicineData.map((item, index) => (
            <div key={index} className="progress-item">
              <div className="progress-header">
                <span className="progress-name">{item.name}</span>
                <span className="progress-value">{item.stock}%</span>
              </div>
              <div className="progress-container">
                <div 
                  className={getProgressBarClass(item.stock)}
                  style={{ width: `${item.stock}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Lab Desk Card */}
        <div 
          className="neumorphic-card labdesk-card"
          onClick={() => navigate('/lab')}
        >
          <div className="card-header">
            <div className="card-title">
              <div className="icon-container icon-purple">
                <FileText size={20} />
              </div>
              <span>LabDesk</span>
            </div>
          </div>
          <div className="lab-status-list">
            <div className="status-item">
              <span className="status-name">Blood Work</span>
              <span className={getStatusBadgeClass('Processing')}>Processing</span>
            </div>
            <div className="status-item">
              <span className="status-name">Pathology</span>
              <span className={getStatusBadgeClass('Pending')}>Pending</span>
            </div>
            <div className="status-item">
              <span className="status-name">Radiology</span>
              <span className={getStatusBadgeClass('Completed')}>Completed</span>
            </div>
            <div className="status-item">
              <span className="status-name">Microbiology</span>
              <span className={getStatusBadgeClass('Analysis')}>Analysis</span>
            </div>
          </div>
        </div>

        {/* New Appointment Card */}
        <div 
          className="neumorphic-card appointment-card"
          onClick={() => navigate('/doc')}
        >
          <div className="card-header">
            <div className="card-title">
              <div className="icon-container icon-yellow">
                <Calendar size={20} />
              </div>
              <span>Make Appointment</span>
            </div>
          </div>
          <div className="appointment-slots">
            {appointmentData.map((slot, index) => (
              <div key={index} className={getAppointmentSlotClass(slot.filled)}>
                <div className="appointment-time">
                  <Clock size={16} />
                  <span>{slot.time}</span>
                </div>
                <div className="appointment-doctor">{slot.doctor}</div>
                <div className="appointment-status">
                  {slot.filled ? 'Booked' : 'Available'}
                </div>
              </div>
            ))}
          </div>
          <button className="appointment-btn">
            Schedule New
          </button>
        </div>
      </div>
    </div>
  );
}