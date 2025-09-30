import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Admin() {
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleEventChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Event created successfully!');
        setShowEventForm(false);
        setEventData({
          title: '',
          description: '',
          date: '',
          time: '',
          venue: ''
        });
      } else {
        setMessage(result.message || 'Error creating event');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  const handleViewEvents = () => {
    navigate('/events');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4 text-blue-600">
          <div className="w-8 h-8">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">MASTEC</h2>
        </div>
        {/* <nav className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="text-gray-500 hover:text-blue-600 text-sm font-medium">Dashboard</Link>
          <Link to="/courses" className="text-gray-500 hover:text-blue-600 text-sm font-medium">Courses</Link>
          <Link to="/students" className="text-gray-500 hover:text-blue-600 text-sm font-medium">Students</Link>
          <Link to="/admin" className="text-blue-600 text-sm font-semibold">Admin</Link>
        </nav> */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your institution's resources and settings</p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Students', value: '1,234', change: '+12%', trend: 'up' },
              { title: 'Active Courses', value: '24', change: '+3', trend: 'up' },
              { title: 'Pending Requests', value: '8', change: '-2', trend: 'down' },
              { title: 'System Health', value: '98%', change: '2%', trend: 'up' },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span className={`ml-2 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '👥', label: 'Add User' },
                { icon: '📚', label: 'Create Course' },
                { icon: '📊', label: 'View event', onClick: handleViewEvents },
                { icon: '⚙️', label: 'Settings' },
              ].map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={action.onClick}
                >
                  <span className="text-2xl mb-2">{action.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { user: 'John Doe', action: 'Created new course', time: '2 minutes ago', status: 'Completed' },
                    { user: 'Jane Smith', action: 'Updated user permissions', time: '1 hour ago', status: 'Completed' },
                    { user: 'System', action: 'Scheduled maintenance', time: '3 hours ago', status: 'Pending' },
                    { user: 'Admin', action: 'Backed up database', time: 'Yesterday', status: 'Completed' },
                  ].map((activity, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.action}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activity.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Event Button */}
          <div className="mb-8">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
              onClick={() => setShowEventForm(!showEventForm)}
            >
              Add Event
            </button>
          </div>

          {/* Event Form */}
          {showEventForm && (
            <form className="bg-white p-6 rounded-lg shadow-md mb-8" onSubmit={handleEventSubmit}>
              <h2 className="text-lg font-semibold mb-4">Create Event</h2>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleEventChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleEventChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleEventChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Time</label>
                <input
                  type="time"
                  name="time"
                  value={eventData.time}
                  onChange={handleEventChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={eventData.venue}
                  onChange={handleEventChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Event
              </button>
              {message && <p className="mt-4 text-red-600">{message}</p>}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default Admin;
