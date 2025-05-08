import { useState, useEffect } from "react";
import { Calendar, Star, X } from "lucide-react";
import api from './api'; // Custom axios instance
import './doc.css';

export default function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    reason: ""
  });

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/api/doctors');
        const doctorsWithDetails = await Promise.all(
          response.data.map(async doctor => {
            try {
              const reviewsResponse = await api.get(`/api/doctors/${doctor.doctor_id}/reviews`);
              return {
                ...doctor,
                reviews: reviewsResponse.data || []
              };
            } catch (err) {
              console.error(`Error fetching reviews for doctor ${doctor.doctor_id}:`, err);
              return {
                ...doctor,
                reviews: []
              };
            }
          })
        );
        setDoctors(doctorsWithDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingForm(false);
  };

  const handleClose = () => {
    setSelectedDoctor(null);
    setShowBookingForm(false);
  };

  const handleBookingClick = () => {
    setShowBookingForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.age || !formData.email || 
        !formData.phone || !formData.date || !formData.time || 
        !formData.reason) {
      alert('Please fill all required fields');
      return false;
    }
    
    if (!/^\d+$/.test(formData.age)) {
      alert('Please enter a valid age');
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // 1. Create patient
      const patientResponse = await api.post('/api/patients', {
        full_name: formData.name,
        date_of_birth: new Date(new Date().getFullYear() - formData.age, 0, 1),
        gender: '', // Add gender field to form if needed
        contact_info: `${formData.email}, ${formData.phone}`
      });

      const patientId = patientResponse.data.patient_id;

      // 2. Parse date and time
      const [day, time] = formData.time.split(', ');
      const [hours, period] = time.split(' ');
      let [hour, minute] = hours.split(':').map(Number);
      
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;

      const appointmentDate = new Date(formData.date);
      appointmentDate.setHours(hour, minute || 0);

      // 3. Create appointment
      const appointmentResponse = await api.post('/api/appointments', {
        patient_id: patientId,
        doctor_id: selectedDoctor.doctor_id,
        appointment_date: appointmentDate.toISOString(),
        status: 'Scheduled'
      });

      // 4. Create feedback placeholder
      await api.post('/api/appointments/feedback', {
        appointment_id: appointmentResponse.data.appointment_id,
        patient_id: patientId,
        comments: formData.reason
      });

      alert(`Appointment booked with ${selectedDoctor.full_name}!`);
      setSelectedDoctor(null);
      setShowBookingForm(false);
      setFormData({
        name: "",
        age: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        reason: ""
      });
    } catch (err) {
      console.error('Full error:', err);
      let errorMessage = 'Failed to book appointment';
      
      if (err.response) {
        errorMessage += `: ${err.response.data?.message || err.response.statusText}`;
        if (err.response.status === 404) {
          errorMessage += '\n(Endpoint not found - check backend routes)';
        }
      } else {
        errorMessage += `: ${err.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transform backend data to match frontend structure
  const transformDoctorData = (doctor) => {
    let availability = [];
    try {
      availability = doctor.availability_schedule ? JSON.parse(doctor.availability_schedule) : [];
    } catch {
      availability = [
        { day: "Monday", slots: ["9:00 AM", "2:30 PM"] },
        { day: "Wednesday", slots: ["10:30 AM", "3:00 PM"] }
      ];
    }

    return {
      ...doctor,
      id: doctor.doctor_id,
      name: doctor.full_name,
      image: "https://placehold.co/150x150",
      education: doctor.specialization 
        ? [`MD in ${doctor.specialization}`, `Board Certified in ${doctor.specialization}`] 
        : [],
      experience: `${Math.floor(Math.random() * 20) + 5} years`, // Random for demo
      rating: doctor.feedback_score || 4.5,
      reviews: doctor.reviews || [],
      availability: availability
    };
  };

  if (loading) return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="text-xl">Loading doctors...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen p-6 flex items-center justify-center text-red-500">
      <div className="text-xl">Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--primary-bg)' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--primary-dark-blue)' }}>Our Doctors</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => {
            const transformedDoctor = transformDoctorData(doctor);
            return (
              <div 
                key={doctor.doctor_id} 
                className="doctor-card"
                onClick={() => handleDoctorClick(transformedDoctor)}
              >
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img src={transformedDoctor.image} alt={transformedDoctor.name} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--primary-dark-blue)' }}>{transformedDoctor.name}</h2>
                  <p style={{ color: 'var(--primary-blue)' }}>{transformedDoctor.specialization}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="ml-1">{transformedDoctor.rating}</span>
                  </div>
                  <div className="mt-4 w-full">
                    <div className="flex items-center mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {transformedDoctor.availability[0]?.day || 'Monday'}, 
                        {transformedDoctor.availability[0]?.slots[0] || '9:00 AM'}
                      </span>
                    </div>
                    <button 
                      className="primary-button w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDoctorClick(transformedDoctor);
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDoctor && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4"
            >
              <X className="w-6 h-6" />
            </button>

            {!showBookingForm ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                    <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--primary-dark-blue)' }}>{selectedDoctor.name}</h2>
                  <p className="font-medium" style={{ color: 'var(--primary-blue)' }}>{selectedDoctor.specialization}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="ml-1">{selectedDoctor.rating}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span>{selectedDoctor.experience} experience</span>
                  </div>
                  <button 
                    className="primary-button mt-6 w-full"
                    onClick={handleBookingClick}
                  >
                    Book Appointment
                  </button>
                </div>
                
                <div className="md:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-dark-blue)' }}>
                      Education
                    </h3>
                    <ul className="pl-6 list-disc">
                      {selectedDoctor.education.map((edu, idx) => (
                        <li key={idx} className="mb-1">{edu}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-dark-blue)' }}>
                      Availability
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedDoctor.availability.map((avail, idx) => (
                        <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary-light-blue)' }}>
                          <p className="font-medium" style={{ color: 'var(--primary-blue)' }}>{avail.day}</p>
                          <div>
                            {avail.slots.map((slot, slotIdx) => (
                              <span key={slotIdx} className="inline-block px-2 py-1 rounded text-sm mr-2 mb-2" 
                                style={{ backgroundColor: 'var(--primary-bg)', color: 'var(--primary-dark-blue)' }}>
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary-dark-blue)' }}>
                      Patient Reviews
                    </h3>
                    {selectedDoctor.reviews.length > 0 ? (
                      selectedDoctor.reviews.map((review, idx) => (
                        <div key={idx} className="mb-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--primary-light-blue)' }}>
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-medium">{review.patient_name}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm">{review.comments}</p>
                        </div>
                      ))
                    ) : (
                      <p>No reviews yet</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--primary-dark-blue)' }}>
                  Book Appointment with {selectedDoctor.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className="block mb-1">Full Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="neumorphic-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Age*</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="neumorphic-input"
                      required
                      min="1"
                      max="120"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="neumorphic-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Phone Number*</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="neumorphic-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Preferred Date*</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="neumorphic-input"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Preferred Time*</label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="neumorphic-input"
                      required
                    >
                      <option value="">Select time</option>
                      {selectedDoctor.availability.flatMap(avail => 
                        avail.slots.map(slot => (
                          <option key={`${avail.day}-${slot}`} value={`${avail.day}, ${slot}`}>
                            {avail.day}, {slot}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block mb-1">Reason for Visit*</label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      rows="4"
                      className="neumorphic-input w-full"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                      style={{ backgroundColor: 'var(--shadow-dark)' }}
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="primary-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}