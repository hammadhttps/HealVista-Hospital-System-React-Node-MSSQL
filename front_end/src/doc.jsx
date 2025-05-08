import { useState } from "react";
import { Calendar, Star, X } from "lucide-react";
import './doc.css';

export default function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    reason: ""
  });

  const doctors = [
    {
      id: 1,
      name: "Dr. Williams",
      specialization: "Cardiologist",
      image: "https://placehold.co/150x150",
      education: [
        "MD, Harvard Medical School",
        "Residency at Johns Hopkins Hospital",
        "Fellowship in Interventional Cardiology"
      ],
      experience: "15 years",
      rating: 4.8,
      reviews: [
        { user: "Patient A", comment: "Excellent bedside manner and very thorough.", rating: 5 },
        { user: "Patient B", comment: "Knowledgeable and professional.", rating: 5 },
        { user: "Patient C", comment: "Wait time was a bit long, but great care.", rating: 4 }
      ],
      availability: [
        { day: "Monday", slots: ["9:00 AM", "2:30 PM"] },
        { day: "Wednesday", slots: ["10:30 AM", "3:00 PM"] },
        { day: "Friday", slots: ["9:00 AM", "1:00 PM"] }
      ]
    },
    {
      id: 2,
      name: "Dr. Johnson",
      specialization: "Neurologist",
      image: "https://placehold.co/150x150",
      education: [
        "MD, Yale School of Medicine",
        "Residency at Mayo Clinic",
        "Fellowship in Neurology"
      ],
      experience: "12 years",
      rating: 4.6,
      reviews: [
        { user: "Patient D", comment: "Very attentive and explains everything clearly.", rating: 5 },
        { user: "Patient E", comment: "Helped me understand my condition better.", rating: 4 },
        { user: "Patient F", comment: "Highly recommended for neurological issues.", rating: 5 }
      ],
      availability: [
        { day: "Tuesday", slots: ["8:00 AM", "1:30 PM"] },
        { day: "Thursday", slots: ["11:00 AM", "4:00 PM"] },
        { day: "Saturday", slots: ["9:00 AM"] }
      ]
    },
    {
      id: 3,
      name: "Dr. Smith",
      specialization: "Pediatrician",
      image: "https://placehold.co/150x150",
      education: [
        "MD, Stanford University",
        "Residency at Children's Hospital of Philadelphia",
        "Board Certified in Pediatrics"
      ],
      experience: "10 years",
      rating: 4.9,
      reviews: [
        { user: "Parent A", comment: "Amazing with kids, very patient and kind.", rating: 5 },
        { user: "Parent B", comment: "My children love Dr. Smith!", rating: 5 },
        { user: "Parent C", comment: "Great diagnostician and very thorough.", rating: 5 }
      ],
      availability: [
        { day: "Monday", slots: ["8:30 AM", "1:00 PM"] },
        { day: "Wednesday", slots: ["9:00 AM", "2:30 PM"] },
        { day: "Friday", slots: ["10:00 AM", "3:00 PM"] }
      ]
    },
    {
      id: 4,
      name: "Dr. Patel",
      specialization: "Dermatologist",
      image: "https://placehold.co/150x150",
      education: [
        "MD, University of California, San Francisco",
        "Residency at New York University",
        "Fellowship in Cosmetic Dermatology"
      ],
      experience: "8 years",
      rating: 4.7,
      reviews: [
        { user: "Patient G", comment: "Solved my skin issues that no one else could!", rating: 5 },
        { user: "Patient H", comment: "Very knowledgeable and caring.", rating: 5 },
        { user: "Patient I", comment: "Office wait time can be long, but worth it.", rating: 4 }
      ],
      availability: [
        { day: "Tuesday", slots: ["9:30 AM", "2:00 PM"] },
        { day: "Thursday", slots: ["10:00 AM", "3:30 PM"] },
        { day: "Saturday", slots: ["11:00 AM"] }
      ]
    }
  ];

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

  const handleSubmit = () => {
    alert(`Appointment booked with ${selectedDoctor.name}!`);
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
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--primary-bg)' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--primary-dark-blue)' }}>Our Doctors</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div 
              key={doctor.id} 
              className="doctor-card"
              onClick={() => handleDoctorClick(doctor)}
            >
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--primary-dark-blue)' }}>{doctor.name}</h2>
                <p style={{ color: 'var(--primary-blue)' }}>{doctor.specialization}</p>
                <div className="flex items-center mt-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="ml-1">{doctor.rating}</span>
                </div>
                <div className="mt-4 w-full">
                  <div className="flex items-center mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{doctor.availability[0].day}, {doctor.availability[0].slots[0]}</span>
                  </div>
                  <button 
                    className="primary-button w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDoctorClick(doctor);
                    }}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                    {selectedDoctor.reviews.map((review, idx) => (
                      <div key={idx} className="mb-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--primary-light-blue)' }}>
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-medium">{review.user}</p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))}
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
                    <label className="block mb-1">Full Name</label>
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
                    <label className="block mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="neumorphic-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Email</label>
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
                    <label className="block mb-1">Phone Number</label>
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
                    <label className="block mb-1">Preferred Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="neumorphic-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Preferred Time</label>
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
                    <label className="block mb-1">Reason for Visit</label>
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
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="primary-button"
                    >
                      Confirm Booking
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