import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../styles/FacultyDashboard.css';

const EVENT_TYPES = [
  "Seminar",
  "Workshop",
  "Conference",
  "Guest Lecture",
  "Orientation",
  "Training",
  "Webinar",
  "Meeting",
  "Cultural Event",
  "Sports Event",
  "Competition",
  "Panel Discussion",
  "Alumni Meet",
  "Symposium",
  "Exhibition",
  "Festival",
  "Career Fair",
  "Award Ceremony",
  "Fundraiser",
  "Other"
];

const FacultyDashboard = ({ showToast }) => {
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));
  const facultyId = user?.id;

  const initialTab = localStorage.getItem('activeTab') || 'newBooking';
  const [activeTab, setActiveTab] = useState(initialTab);

  // State for new booking
  const [bookingData, setBookingData] = useState({
    eventName: '',
    coordinator: '',
    coordinatorContact: '',
    eventType: '',
    customEventType: '',
    date: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  const [bookings, setBookings] = useState([]);

  // Editing
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

  // Fetch bookings initially
  useEffect(() => {
    if (facultyId) {
      fetchBookings();
    }
  }, [facultyId]);

  // Poll every 10s
  useEffect(() => {
    if (facultyId) {
      const interval = setInterval(() => {
        fetchBookings();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [facultyId]);

  // Persist tab
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/faculty/bookings?facultyId=${facultyId}`
      );
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Submit new booking (auto-approved on backend)
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      showToast("Calculating your booking...", "info");

      // If "Other" + user typed text
      let finalEventType = bookingData.eventType;
      if (bookingData.eventType === 'Other' && bookingData.customEventType.trim() !== '') {
        finalEventType = bookingData.customEventType.trim();
      }

      const finalBookingData = {
        ...bookingData,
        eventType: finalEventType
      };
      delete finalBookingData.customEventType;

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/faculty/booking`,
        { facultyId, ...finalBookingData }
      );
      if (res.data.success) {
        setBookingData({
          eventName: '',
          coordinator: '',
          coordinatorContact: '',
          eventType: '',
          customEventType: '',
          date: '',
          startTime: '',
          endTime: '',
          description: ''
        });
        setTimeout(() => {
          showToast("Your booking has been placed and auto-approved.", "success");
        }, 2000);
        fetchBookings();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error submitting booking', "error");
    }
  };

  // Editing
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

  const cancelEdit = () => {
    setEditBookingId(null);
  };

  const handleEditChange = (e) => {
    setEditBookingData({
      ...editBookingData,
      [e.target.name]: e.target.value,
    });
  };

  const saveEditedBooking = async (bookingId) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/faculty/booking/${bookingId}`,
        editBookingData
      );
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
    <div 
      className="faculty-dashboard"
      style={{
        maxWidth: '100%',
        overflowX: 'hidden',
        margin: '0 auto'
      }}
    >
      <h2 style={{ textAlign: 'center' }}>Faculty Dashboard</h2>

      {/* Tab Buttons */}
      <div className="tabs" style={{ textAlign: 'center' }}>
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
        <div 
          className="new-booking"
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '1rem'
          }}
        >
          <h3>Create a New Booking</h3>
          <form onSubmit={handleBookingSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Venue:</label>
              <span style={{ marginLeft: '0.5rem' }}>Auditorium</span>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Event Name:</label>
              <input 
                type="text" 
                placeholder="Event Name"
                style={{ width: '100%' }}
                value={bookingData.eventName} 
                onChange={(e) => setBookingData({ ...bookingData, eventName: e.target.value })}
                required 
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Event Coordinator:</label>
              <input 
                type="text" 
                placeholder="Coordinator Name" 
                style={{ width: '100%' }}
                value={bookingData.coordinator} 
                onChange={(e) => setBookingData({ ...bookingData, coordinator: e.target.value })}
                required 
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Coordinator Contact:</label>
              <input
                type="text"
                placeholder="Contact Number"
                style={{ width: '100%' }}
                value={bookingData.coordinatorContact}
                onChange={(e) => setBookingData({ ...bookingData, coordinatorContact: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Event Type:</label>
              <select
                style={{ width: '100%' }}
                value={bookingData.eventType}
                onChange={(e) => setBookingData({ ...bookingData, eventType: e.target.value })}
                required
              >
                <option value="">Select Event Type</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {bookingData.eventType === 'Other' && (
                <input 
                  type="text" 
                  placeholder="Specify Event Type"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  value={bookingData.customEventType}
                  onChange={(e) => setBookingData({ ...bookingData, customEventType: e.target.value })}
                  required 
                />
              )}
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Date:</label>
              <input 
                type="date"
                style={{ width: '100%' }}
                value={bookingData.date} 
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                required 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Start Time:</label>
              <input 
                type="time"
                style={{ width: '100%' }}
                value={bookingData.startTime} 
                onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                required 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>End Time:</label>
              <input 
                type="time"
                style={{ width: '100%' }}
                value={bookingData.endTime} 
                onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                required 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Event Description:</label>
              <textarea 
                placeholder="Event Description" 
                style={{ width: '100%' }}
                value={bookingData.description} 
                onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                required 
              />
            </div>
            <button type="submit" className="submit-btn" style={{ width: '100%' }}>
              Submit Booking
            </button>
          </form>
        </div>
      )}

      {activeTab === 'myBookings' && (
        <div 
          className="my-bookings"
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '1rem'
          }}
        >
          <h3>My Bookings</h3>
          <div 
            className="table-responsive"
            style={{
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            <table style={{ tableLayout: 'auto', width: '100%' }}>
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
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    {editBookingId === b.id ? (
                      <>
                        <td>
                          <input 
                            type="text" 
                            name="eventName"
                            style={{ width: '100%' }}
                            value={editBookingData.eventName} 
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input 
                            type="date" 
                            name="date"
                            style={{ width: '100%' }}
                            value={editBookingData.date} 
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                              type="time" 
                              name="startTime"
                              style={{ width: '100%' }}
                              value={editBookingData.startTime} 
                              onChange={handleEditChange}
                            />
                            <span>-</span>
                            <input 
                              type="time" 
                              name="endTime"
                              style={{ width: '100%' }}
                              value={editBookingData.endTime} 
                              onChange={handleEditChange}
                            />
                          </div>
                        </td>
                        <td>{b.status}</td>
                        <td>
                          <button 
                            onClick={() => saveEditedBooking(b.id)} 
                            className="btn-save"
                            style={{ marginBottom: '0.5rem' }}
                          >
                            Save
                          </button>
                          <button 
                            onClick={cancelEdit} 
                            className="btn-cancel"
                          >
                            Cancel
                          </button>
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
                            <button 
                              onClick={() => startEditBooking(b)} 
                              className="btn-edit"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
