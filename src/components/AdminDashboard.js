// frontend/src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

// 1. Define your large department list
const DEPARTMENTS = [
  "Office",
  "Political Science - Junior College",
  "Arabic - Junior College",
  "Biology - Junior College",
  "Chemistry - Junior College",
  "Commerce - Junior College",
  "Economics - Junior College",
  "English - Junior College",
  "Hindi - Junior College",
  "History - Junior College",
  "Information Technology - Junior College",
  "Mathematics - Junior College",
  "Physical Education - Junior College",
  "Physics - Junior College",
  "Psychology - Junior College",
  "Sociology - Junior College",
  "Urdu - Junior College",
  "Accountancy - Degree College",
  "Arabic - Degree College",
  "Islamic Studies - Degree College",
  "Botany - Degree College",
  "Chemistry - Degree College",
  "Commerce - Degree College",
  "Economics - Degree College",
  "English - Degree College",
  "Hindi - Degree College",
  "History - Degree College",
  "Mathematics - Degree College",
  "Physics - Degree College",
  "Political Science - Degree College",
  "Psychology - Degree College",
  "Sociology - Degree College",
  "Urdu - Degree College",
  "Zoology - Degree College",
  "College Development Committee",
  "CARE",
  "Internal Committee",
  "Admission Committee",
  "Exam Committee",
  "IQAC",
  "College Grievance Redressal Cell",
  "Students and Staff Welfare and Redressal Committee",
  "Women Development Cell",
  "Anti-Ragging Committee",
  "Anti-Ragging Squad",
  "Code of Conduct Monitoring Committee",
  "Purchase Committee",
  "Staff Common Room Committee",
  "Students Forum",
  "Ladies/Girls Common Room Committee",
  "Gymkhana Committee",
  "Students Aid Funds Committee",
  "Library Committee",
  "Book Bank Committee",
  "Attendance Committee",
  "Discipline Committee",
  "Science Association",
  "NSS Coordination Committee",
  "NCC Coordination Committee",
  "DLLE",
  "Time Table Committee",
  "Research Committee",
  "Magazine Committee - SADAF",
  "E-Tabloid ? MyDashBoard",
  "Scholarship Committee",
  "Academic Progress Monitoring Committee",
  "Planning Board",
  "Sarus Nature Club",
  "Vocational & Career Guidance Cell",
  "Media & Public Relation",
  "Training and Placement Cell",
  "Canteen & Book Stall Committee",
  "Avishkar Committee",
  "International Olympiad Committee",
  "Degree Certificate Distribution Committee",
  "Green Club",
  "Chemistry Club of Maharashtra (CCMC)",
  "BAF - Degree College",
  "BMS - Degree College",
  "Computer Science - Degree College",
  "Information Technology - Degree College"
];

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
  const [editBookingId, setEditBookingId] = useState(null);
  const [editBookingData, setEditBookingData] = useState({
    eventName: '',
    coordinator: '',
    // If you want admin to edit coordinatorContact as well, add it here:
    // coordinatorContact: '',
    eventType: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    status: ''
  });

  // Initial fetch
  useEffect(() => {
    fetchFaculties();
    fetchBookings();
  }, []);

  // Poll for updated bookings every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBookings();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Persist active tab in localStorage
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  // ----- FACULTY FUNCTIONS -----
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

  // ----- BOOKING FUNCTIONS -----
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
      // coordinatorContact: booking.coordinatorContact, // if you want to edit
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

  // Filter bookings by status
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

      {/* ---------- FACULTY TAB ---------- */}
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
            {/* 
              Department dropdown using DEPARTMENTS array 
              with a wider minWidth
            */}
            <select
              style={{ minWidth: '300px' }}
              value={newFaculty.department}
              onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
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
          <div className="table-responsive">
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
                            style={{ minWidth: '300px' }}
                            name="department"
                            value={editingFacultyData.department}
                            onChange={handleFacultyEditChange}
                          >
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
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
        </div>
      )}

      {/* ---------- BOOKING TAB ---------- */}
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
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  {/* 
                    Add "Coordinator" and "Coordinator Contact" columns 
                    to show that info in the booking table
                  */}
                  <th>Coordinator</th>
                  <th>Contact</th>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.coordinator}</td>
                    {/* This depends on your backend returning 'coordinatorContact' */}
                    <td>{b.coordinatorContact || "N/A"}</td>
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
                          <select 
                            name="status" 
                            value={editBookingData.status} 
                            onChange={handleBookingEditChange}
                          >
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
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
