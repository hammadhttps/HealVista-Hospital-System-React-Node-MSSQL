import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, Users, Building2, Truck, DollarSign, 
  Package, FlaskConical, Calendar, Clock, Stethoscope
} from 'lucide-react';
import Layout from './components/Layout/Layout';
import StatCard from './components/UI/StatCard';
import Card from './components/UI/Card';
import useStore from './store/useStore';

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
  const { addNotification } = useStore();
  
  // Custom tooltip styles for charts
  const customTooltipStyle = {
    background: 'white',
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
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
    <Layout title="Dashboard" subtitle="Welcome back, Dr. Smith">
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Patients"
            value="1,284"
            icon={Users}
            color="blue"
            trend="up"
            trendValue="+5.2% from last month"
            onClick={() => navigate('/patient')}
          />
          <StatCard
            title="Available Beds"
            value="28"
            icon={Building2}
            color="green"
            trend="neutral"
            trendValue="72% occupied"
            onClick={() => navigate('/ward')}
          />
          <StatCard
            title="Active Ambulances"
            value="4/7"
            icon={Truck}
            color="yellow"
            trend="up"
            trendValue="3 on call"
            onClick={() => navigate('/ambu')}
          />
          <StatCard
            title="Revenue"
            value="$986K"
            icon={DollarSign}
            color="purple"
            trend="up"
            trendValue="+8.7% from last month"
            onClick={() => navigate('/fin')}
          />
        </div>
        






        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ward Status Chart */}
          <Card hover onClick={() => navigate('/ward')}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Ward Status</h3>
              </div>
            </div>
            <div className="h-64">
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
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">72%</div>
                  <div className="text-sm text-gray-600">Occupied</div>
          {/* Finance Chart */}
          <Card hover onClick={() => navigate('/fin')}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Revenue vs Expenses</h3>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
                </div>
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover onClick={() => navigate('/med')}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Package className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Pharmacy</h3>
            </div>
            <div className="space-y-3">
              {medicineData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium">{item.stock}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.stock > 70 ? 'bg-green-500' : 
                        item.stock > 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.stock}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
              </div>
          <Card hover onClick={() => navigate('/lab')}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FlaskConical className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Laboratory</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Blood Work</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Processing
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pathology</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Pending
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Radiology</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Completed
                </span>
              </div>
            </div>
          </Card>
            </div>
          <Card hover onClick={() => navigate('/doc')}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Stethoscope className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Appointments</h3>
            </div>
            <div className="space-y-3">
              {appointmentData.slice(0, 3).map((slot, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{slot.time}</div>
                    <div className="text-xs text-gray-600">{slot.doctor}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    slot.filled 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {slot.filled ? 'Booked' : 'Available'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
          </Card>
          <Card hover>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Truck className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Ambulances</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">4/7</div>
              <div className="text-sm text-gray-600 mb-3">Available</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">En Route</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">On Standby</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}