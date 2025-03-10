// frontend/src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ showToast }) => {
  // Retrieve the active tab from localStorage or default to 'faculty'
  const initialTab = localStorage.getItem('adminActiveTab') || 'faculty';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Faculty management states
  const [faculties, setFaculties] = useState([]);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    department: '',
    position: '',
    username: '',
    password: ''
  });
  const [editingFacultyId, setEditingFacultyId] = useState(null);
  const [editingFacultyData, setEditingFacultyData] = useState({
    name: '',
    department: '',
    position: '',
    username: '',
    password: ''
  });

  // Booking management states
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  // For inline editing booking details in admin panel
  const [editBookingId, setEditBookingId] = useState(null);
  const [editBookingData, setEditBookingData] = useState({
    eventName: '',
    coordinator: '',
    eventType: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    status: ''
  });

  useEffect(() => {
    fetchFaculties();
    fetchBookings();
  }, []);

  // Poll for updated bookings every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBookings();
    }, 10000);
    return () => clearInterval(interval);
  }, []); // Adjust dependencies as needed (e.g., [facultyId])

  // Persist active tab in localStorage
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  // Faculty management functions
  const fetchFaculties = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/faculty`);
      if (res.data.success) {
        setFaculties(res.data.faculties);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/faculty`, newFaculty);
      if (res.data.success) {
        setFaculties([...faculties, res.data.newFaculty]);
        setNewFaculty({ name: '', department: '', position: '', username: '', password: '' });
        showToast("Faculty added successfully.", "success");
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error adding faculty', "error");
    }
  };

  const startEditFaculty = (faculty) => {
    setEditingFacultyId(faculty.id);
    setEditingFacultyData({
      name: faculty.name,
      department: faculty.department,
      position: faculty.position,
      username: faculty.username,
      password: faculty.password
    });
  };

  const cancelEditFaculty = () => {
    setEditingFacultyId(null);
  };

  const handleFacultyEditChange = (e) => {
    setEditingFacultyData({
      ...editingFacultyData,
      [e.target.name]: e.target.value,
    });
  };

  const saveEditedFaculty = async (facultyId) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/admin/faculty/${facultyId}`, editingFacultyData);
      if (res.data.success) {
        setFaculties(faculties.map(f => f.id === facultyId ? res.data.faculty : f));
        setEditingFacultyId(null);
        showToast("Faculty updated successfully.", "success");
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating faculty', "error");
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/admin/faculty/${facultyId}`);
      if (res.data.success) {
        setFaculties(faculties.filter(f => f.id !== facultyId));
        showToast("Faculty deleted successfully.", "success");
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting faculty', "error");
    }
  };

  // Booking management functions
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/bookings`);
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveEditedBooking = async (bookingId) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/admin/booking/${bookingId}`, editBookingData);
      if (res.data.success) {
        setBookings(bookings.map(b => b.id === bookingId ? res.data.booking : b));
        setEditBookingId(null);
        showToast("Booking updated successfully.", "success");
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating booking', "error");
    }
  };

  const startEditBooking = (booking) => {
    setEditBookingId(booking.id);
    setEditBookingData({
      eventName: booking.eventName,
      coordinator: booking.coordinator,
      eventType: booking.eventType,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      description: booking.description,
      status: booking.status
    });
  };

  const cancelEditBooking = () => {
    setEditBookingId(null);
  };

  const handleBookingEditChange = (e) => {
    setEditBookingData({
      ...editBookingData,
      [e.target.name]: e.target.value,
    });
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/admin/booking/${bookingId}/status`, { status });
      if (res.data.success) {
        setBookings(bookings.map(b => b.id === bookingId ? res.data.booking : b));
        showToast(`Booking ${status}.`, "success");
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating booking status', "error");
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'All') return true;
    return b.status === filterStatus;
  });

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="tabs">
        <button 
          onClick={() => setActiveTab('faculty')} 
          className={activeTab === 'faculty' ? 'active' : ''}
        >
          Faculty Management
        </button>
        <button 
          onClick={() => setActiveTab('bookings')} 
          className={activeTab === 'bookings' ? 'active' : ''}
        >
          Booking Management
        </button>
      </div>
      {activeTab === 'faculty' && (
        <div className="faculty-management">
          <h3>Create New Faculty</h3>
          <form onSubmit={handleAddFaculty}>
            <input 
              type="text" 
              placeholder="Faculty Name" 
              value={newFaculty.name} 
              onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
              required 
            />
            <select
              value={newFaculty.department}
              onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              <option value="BSc">BSc</option>
              <option value="BMS">BMS</option>
              <option value="BSc CS">BSc CS</option>
              <option value="BSc IT">BSc IT</option>
              <option value="Junior College 11-12 Science">Junior College 11-12 Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
            </select>
            <select
              value={newFaculty.position}
              onChange={(e) => setNewFaculty({ ...newFaculty, position: e.target.value })}
              required
            >
              <option value="">Select Position</option>
              <option value="Teacher">Teacher</option>
              <option value="HOD">HOD</option>
            </select>
            <input 
              type="text" 
              placeholder="Username" 
              value={newFaculty.username} 
              onChange={(e) => setNewFaculty({ ...newFaculty, username: e.target.value })}
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={newFaculty.password} 
              onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })}
              required 
            />
            <button type="submit">Add Faculty</button>
          </form>
          <h3>Faculty List</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty) => (
                <tr key={faculty.id}>
                  <td>{faculty.id}</td>
                  {editingFacultyId === faculty.id ? (
                    <>
                      <td>
                        <input 
                          type="text"
                          name="name"
                          value={editingFacultyData.name}
                          onChange={handleFacultyEditChange}
                        />
                      </td>
                      <td>
                        <select
                          name="department"
                          value={editingFacultyData.department}
                          onChange={handleFacultyEditChange}
                        >
                          <option value="">Select Department</option>
                          <option value="BSc">BSc</option>
                          <option value="BMS">BMS</option>
                          <option value="BSc CS">BSc CS</option>
                          <option value="BSc IT">BSc IT</option>
                          <option value="Junior College 11-12 Science">Junior College 11-12 Science</option>
                          <option value="Commerce">Commerce</option>
                          <option value="Arts">Arts</option>
                        </select>
                      </td>
                      <td>
                        <select
                          name="position"
                          value={editingFacultyData.position}
                          onChange={handleFacultyEditChange}
                        >
                          <option value="">Select Position</option>
                          <option value="Teacher">Teacher</option>
                          <option value="HOD">HOD</option>
                        </select>
                      </td>
                      <td>
                        <input 
                          type="text"
                          name="username"
                          value={editingFacultyData.username}
                          onChange={handleFacultyEditChange}
                        />
                      </td>
                      <td>
                        <input 
                          type="text"
                          name="password"
                          value={editingFacultyData.password}
                          onChange={handleFacultyEditChange}
                        />
                      </td>
                      <td>
                        <button onClick={() => saveEditedFaculty(faculty.id)} className="btn-save">Save</button>
                        <button onClick={cancelEditFaculty} className="btn-cancel">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{faculty.name}</td>
                      <td>{faculty.department}</td>
                      <td>{faculty.position}</td>
                      <td>{faculty.username}</td>
                      <td>{"********"}</td>
                      <td>
                        <button onClick={() => startEditFaculty(faculty)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDeleteFaculty(faculty.id)} className="btn-delete">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'bookings' && (
        <div className="booking-management">
          <h3>Booking Requests</h3>
          <div className="filter">
            <label>Filter by Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Faculty ID</th>
                <th>Event Name</th>
                <th>Coordinator</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.facultyId}</td>
                  {editBookingId === b.id ? (
                    <>
                      <td>
                        <input 
                          type="text" 
                          name="eventName"
                          value={editBookingData.eventName} 
                          onChange={handleBookingEditChange}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          name="coordinator"
                          value={editBookingData.coordinator} 
                          onChange={handleBookingEditChange}
                        />
                      </td>
                      <td>
                        <input 
                          type="date" 
                          name="date"
                          value={editBookingData.date} 
                          onChange={handleBookingEditChange}
                        />
                      </td>
                      <td>
                        <input 
                          type="time" 
                          name="startTime"
                          value={editBookingData.startTime} 
                          onChange={handleBookingEditChange}
                        />
                        {" - "}
                        <input 
                          type="time" 
                          name="endTime"
                          value={editBookingData.endTime} 
                          onChange={handleBookingEditChange}
                        />
                      </td>
                      <td>
                        <select name="status" value={editBookingData.status} onChange={handleBookingEditChange}>
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={() => saveEditedBooking(b.id)} className="btn-save">Save</button>
                        <button onClick={cancelEditBooking} className="btn-cancel">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{b.eventName}</td>
                      <td>{b.coordinator}</td>
                      <td>{b.date}</td>
                      <td>{b.startTime} - {b.endTime}</td>
                      <td>{b.status}</td>
                      <td>
                        <button onClick={() => startEditBooking(b)} className="btn-edit">Edit</button>
                        <button onClick={() => updateBookingStatus(b.id, 'Approved')} className="btn-approve">Approve</button>
                        <button onClick={() => updateBookingStatus(b.id, 'Rejected')} className="btn-reject">Reject</button>
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

export default AdminDashboard;
