// frontend/src/components/FacultyDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../styles/FacultyDashboard.css';

const FacultyDashboard = ({ showToast }) => {
  const location = useLocation();
  // Retrieve logged-in user from route state or localStorage
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));
  const facultyId = user?.id;

  // Get initial active tab from localStorage or default to 'newBooking'
  const initialTab = localStorage.getItem('activeTab') || 'newBooking';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [bookingData, setBookingData] = useState({
    eventName: '',
    coordinator: '',
    eventType: '',
    date: '',
    startTime: '',
    endTime: '',
    description: ''
  });
  const [bookings, setBookings] = useState([]);
  
  // For editing an existing booking in "My Bookings"
  const [editBookingId, setEditBookingId] = useState(null);
  const [editBookingData, setEditBookingData] = useState({
    eventName: '',
    coordinator: '',
    eventType: '',
    date: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  useEffect(() => {
    if (facultyId) {
      fetchBookings();
    }
  }, [facultyId]);

  // Whenever activeTab changes, store it in localStorage
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/faculty/bookings?facultyId=${facultyId}`);
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // New Booking submission handler
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      // Immediately show "Calculating..." alert
      showToast("Calculating your booking...", "info");

      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/faculty/booking`, { facultyId, ...bookingData });
      if (res.data.success) {
        // Reset the booking form
        setBookingData({
          eventName: '',
          coordinator: '',
          eventType: '',
          date: '',
          startTime: '',
          endTime: '',
          description: ''
        });
        // After 2 seconds, update the alert message to a success message
        setTimeout(() => {
          showToast("Your booking request has been sent successfully.", "success");
        }, 2000);
        fetchBookings();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error submitting booking', "error");
    }
  };

  // Begin editing a booking
  const startEditBooking = (booking) => {
    setEditBookingId(booking.id);
    setEditBookingData({
      eventName: booking.eventName,
      coordinator: booking.coordinator,
      eventType: booking.eventType,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      description: booking.description
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditBookingId(null);
  };

  // Handle changes in the edit form
  const handleEditChange = (e) => {
    setEditBookingData({
      ...editBookingData,
      [e.target.name]: e.target.value,
    });
  };

  // Save the edited booking (allowed only if status is "Pending")
  const saveEditedBooking = async (bookingId) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/faculty/booking/${bookingId}`, editBookingData);
      if (res.data.success) {
        showToast("Your booking has been updated.", "success");
        setEditBookingId(null);
        fetchBookings();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating booking', "error");
    }
  };

  return (
    <div className="faculty-dashboard">
      <h2>Faculty Dashboard</h2>
      <div className="tabs">
        <button 
          onClick={() => setActiveTab('newBooking')} 
          className={activeTab === 'newBooking' ? 'active' : ''}
        >
          New Booking
        </button>
        <button 
          onClick={() => setActiveTab('myBookings')} 
          className={activeTab === 'myBookings' ? 'active' : ''}
        >
          My Bookings
        </button>
      </div>
      {activeTab === 'newBooking' && (
        <div className="new-booking">
          <h3>Create a New Booking</h3>
          <form onSubmit={handleBookingSubmit}>
            <div className="form-group">
              <label>Venue:</label>
              <span>Auditorium</span>
            </div>
            <div className="form-group">
              <label>Event Name:</label>
              <input 
                type="text" 
                placeholder="Event Name" 
                value={bookingData.eventName} 
                onChange={(e) => setBookingData({ ...bookingData, eventName: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label>Event Coordinator:</label>
              <input 
                type="text" 
                placeholder="Coordinator Name" 
                value={bookingData.coordinator} 
                onChange={(e) => setBookingData({ ...bookingData, coordinator: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label>Event Type:</label>
              <select
                value={bookingData.eventType}
                onChange={(e) => setBookingData({ ...bookingData, eventType: e.target.value })}
                required
              >
                <option value="">Select Event Type</option>
                <option value="Seminar">Seminar</option>
                <option value="Other">Other</option>
              </select>
              {bookingData.eventType === 'Other' && (
                <input 
                  type="text" 
                  placeholder="Specify Event Type" 
                  onChange={(e) => setBookingData({ ...bookingData, eventType: e.target.value })}
                  required 
                />
              )}
            </div>
            <div className="form-group">
              <label>Date:</label>
              <input 
                type="date" 
                value={bookingData.date} 
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label>Start Time:</label>
              <input 
                type="time" 
                value={bookingData.startTime} 
                onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label>End Time:</label>
              <input 
                type="time" 
                value={bookingData.endTime} 
                onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label>Event Description:</label>
              <textarea 
                placeholder="Event Description" 
                value={bookingData.description} 
                onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                required 
              />
            </div>
            <button type="submit" className="submit-btn">Submit Booking</button>
          </form>
        </div>
      )}
      {activeTab === 'myBookings' && (
        <div className="my-bookings">
          <h3>My Bookings</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Event Name</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  {editBookingId === b.id ? (
                    <>
                      <td>
                        <input 
                          type="text" 
                          name="eventName"
                          value={editBookingData.eventName} 
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input 
                          type="date" 
                          name="date"
                          value={editBookingData.date} 
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input 
                          type="time" 
                          name="startTime"
                          value={editBookingData.startTime} 
                          onChange={handleEditChange}
                        />
                        {" - "}
                        <input 
                          type="time" 
                          name="endTime"
                          value={editBookingData.endTime} 
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>{b.status}</td>
                      <td>
                        <button onClick={() => saveEditedBooking(b.id)} className="btn-save">Save</button>
                        <button onClick={cancelEdit} className="btn-cancel">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{b.eventName}</td>
                      <td>{b.date}</td>
                      <td>{b.startTime} - {b.endTime}</td>
                      <td>{b.status}</td>
                      <td>
                        {b.status === 'Pending' && (
                          <button onClick={() => startEditBooking(b)} className="btn-edit">Edit</button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
