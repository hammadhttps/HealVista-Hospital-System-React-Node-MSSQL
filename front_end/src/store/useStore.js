import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Main store combining all slices
const useStore = create(
  devtools(
    (set, get) => ({
      // UI State
      ui: {
        sidebarOpen: false,
        theme: 'light',
        loading: false,
        notifications: [],
      },
      
      // Patient State
      patients: {
        list: [],
        selectedPatient: null,
        searchTerm: '',
        totalPatients: 0,
        admittedToday: 0,
        criticalCount: 0,
        showAddModal: false,
        showRemoveModal: false,
        patientToRemove: null,
      },
      
      // Doctor State
      doctors: {
        list: [],
        selectedDoctor: null,
        showBookingForm: false,
        searchTerm: '',
        selectedPatient: null,
        showPatientSearch: false,
      },
      
      // Lab State
      lab: {
        tests: [],
        selectedTest: null,
        showModal: false,
        searchTerm: '',
        loading: false,
        error: null,
      },
      
      // Pharmacy State
      pharmacy: {
        medications: [],
        searchTerm: '',
        showModal: false,
        isEditMode: false,
        editId: null,
        loading: false,
        error: null,
      },
      
      // Ward State
      ward: {
        wards: [],
        selectedWard: null,
        selectedPatient: null,
        showTestResults: false,
        searchTerm: '',
      },
      
      // Finance State
      finance: {
        activeTab: 'overview',
        revenueData: [],
        expenseData: [],
        loading: false,
      },
      
      // Actions
      setUI: (updates) => set((state) => ({
        ui: { ...state.ui, ...updates }
      })),
      
      setPatients: (updates) => set((state) => ({
        patients: { ...state.patients, ...updates }
      })),
      
      setDoctors: (updates) => set((state) => ({
        doctors: { ...state.doctors, ...updates }
      })),
      
      setLab: (updates) => set((state) => ({
        lab: { ...state.lab, ...updates }
      })),
      
      setPharmacy: (updates) => set((state) => ({
        pharmacy: { ...state.pharmacy, ...updates }
      })),
      
      setWard: (updates) => set((state) => ({
        ward: { ...state.ward, ...updates }
      })),
      
      setFinance: (updates) => set((state) => ({
        finance: { ...state.finance, ...updates }
      })),
      
      // Notification actions
      addNotification: (notification) => set((state) => ({
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, {
            id: Date.now(),
            ...notification
          }]
        }
      })),
      
      removeNotification: (id) => set((state) => ({
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== id)
        }
      })),
      
      // Reset functions
      resetPatients: () => set((state) => ({
        patients: {
          ...state.patients,
          selectedPatient: null,
          showAddModal: false,
          showRemoveModal: false,
          patientToRemove: null,
        }
      })),
      
      resetDoctors: () => set((state) => ({
        doctors: {
          ...state.doctors,
          selectedDoctor: null,
          showBookingForm: false,
          selectedPatient: null,
          showPatientSearch: false,
        }
      })),
    }),
    {
      name: 'hospital-store',
    }
  )
);

export default useStore;