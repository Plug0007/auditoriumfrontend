// frontend/src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

// Large department list
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
  const initialTab = localStorage.getItem('adminActiveTab') || 'faculty';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Faculty management
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

  // Booking management
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
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

  // Poll for updated bookings
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBookings();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Persist tab
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  // Fetch faculties
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

  // Add faculty
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

  // Bookings
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
    <div className="admin-dashboard" 
         style={{
           // Ensure the dashboard doesn't overflow horizontally
           maxWidth: '100%',
           overflowX: 'hidden'
         }}
    >
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
            {/* Department dropdown with text-wrap styling */}
            <select
              style={{
                maxWidth: '100%',
                whiteSpace: 'normal',
                overflowWrap: 'break-word'
              }}
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
            <table style={{ tableLayout: 'auto' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th
                    style={{
                      // Wrap department column text
                      maxWidth: '120px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word'
                    }}
                  >
                    Department
                  </th>
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
                            style={{
                              maxWidth: '120px',
                              whiteSpace: 'normal',
                              wordWrap: 'break-word'
                            }}
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
                        {/* Wrap department cell */}
                        <td
                          style={{
                            maxWidth: '120px',
                            whiteSpace: 'normal',
                            wordWrap: 'break-word'
                          }}
                        >
                          {faculty.department}
                        </td>
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
          {/* 
            2. Vertically scrollable bookings table
            Give it a fixed max height and overflow-y: auto
          */}
          <div
            className="table-responsive"
            style={{
              maxHeight: '400px', // adjust as needed
              overflowY: 'auto'
            }}
          >
            <table style={{ tableLayout: 'auto' }}>
              <thead>
                <tr>
                  <th>ID</th>
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
