import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building2, 
  Truck, 
  DollarSign, 
  Package, 
  FlaskConical, 
  Stethoscope,
  X,
  Menu
} from 'lucide-react';
import useStore from '../../store/useStore';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ui, setUI } = useStore();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard', color: 'text-blue-600' },
    { path: '/patient', icon: Users, label: 'Patients', color: 'text-green-600' },
    { path: '/ward', icon: Building2, label: 'Wards', color: 'text-purple-600' },
    { path: '/ambu', icon: Truck, label: 'AmbuTrack', color: 'text-orange-600' },
    { path: '/fin', icon: DollarSign, label: 'Finance', color: 'text-blue-600' },
    { path: '/med', icon: Package, label: 'Pharmacy', color: 'text-red-600' },
    { path: '/lab', icon: FlaskConical, label: 'Laboratory', color: 'text-indigo-600' },
    { path: '/doc', icon: Stethoscope, label: 'Doctors', color: 'text-teal-600' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setUI({ sidebarOpen: false });
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {ui.sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setUI({ sidebarOpen: false })}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">HealVista</h1>
              <p className="text-xs text-gray-500">Hospital Management</p>
            </div>
          </div>
          <button
            onClick={() => setUI({ sidebarOpen: false })}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm' 
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-600'}`} />
                <span className={`font-medium ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">DS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">Dr. Smith</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;