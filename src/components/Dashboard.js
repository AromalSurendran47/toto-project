import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);

  // Fetch events when dashboard loads
  React.useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleViewEvents = async () => {
    setShowEvents(true);
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
          <Link to="/dashboard" className="text-blue-600 text-sm font-semibold">Dashboard</Link>
          <Link to="/courses" className="text-gray-500 hover:text-blue-600 text-sm font-medium">Courses</Link>
          <Link to="/assignments" className="text-gray-500 hover:text-blue-600 text-sm font-medium">Assignments</Link>
          <Link to="/admin" className="text-gray-500 hover:text-blue-600 text-sm font-medium">Admin</Link>
        </nav> */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, Student!</h1>
              <p className="text-gray-500 mt-1">Here's what's happening with your courses today.</p>
            </div>
            <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              New Assignment
            </button>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { 
                title: 'Active Courses', 
                value: '5', 
                change: '+2 from last month', 
                icon: '📚',
                color: 'bg-blue-100 text-blue-600'
              },
              { 
                title: 'Assignments Due', 
                value: '3', 
                change: '2 upcoming this week', 
                icon: '📝',
                color: 'bg-yellow-100 text-yellow-600'
              },
              { 
                title: 'Overall Grade', 
                value: 'A-', 
                change: '3% from last term', 
                icon: '🏆',
                color: 'bg-green-100 text-green-600'
              },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-start">
                <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <div className="mt-1">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Assignments */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {[
                    { 
                      course: 'Data Structures', 
                      title: 'Binary Search Trees', 
                      due: 'Tomorrow, 11:59 PM',
                      progress: 65,
                      color: 'bg-blue-500'
                    },
                    { 
                      course: 'Algorithms', 
                      title: 'Dynamic Programming', 
                      due: 'In 3 days',
                      progress: 30,
                      color: 'bg-green-500'
                    },
                    { 
                      course: 'Database Systems', 
                      title: 'SQL Queries', 
                      due: 'Next Monday',
                      progress: 10,
                      color: 'bg-purple-500'
                    },
                  ].map((assignment, index) => (
                    <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">{assignment.course}</p>
                          <h3 className="text-base font-medium text-gray-900 mt-1">{assignment.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">Due {assignment.due}</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                      </div>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${assignment.color}`} 
                            style={{ width: `${assignment.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs font-medium">{assignment.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 bg-gray-50 text-right">
                  <Link to="/assignments" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    View all assignments →
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {events.length === 0 ? (
                    <div className="p-4 text-gray-500">No upcoming events.</div>
                  ) : (
                    events.slice(0, 3).map((event, index) => (
                      <div key={event._id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-medium">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-500">{event.venue}</p>
                            <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50 text-right">
                  <button
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    onClick={handleViewEvents}
                  >
                    View calendar →
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Quick Links</h2>
                </div>
                <div className="p-4">
                  {[
                    { icon: '📚', label: 'Course Materials', url: '/materials' },
                    { icon: '📅', label: 'Academic Calendar', url: '/calendar' },
                    { icon: '💬', label: 'Discussion Forums', url: '/forums' },
                    { icon: '📊', label: 'Grades', url: '/grades' },
                    { icon: '👥', label: 'Study Groups', url: '/study-groups' },
                  ].map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors mb-1 last:mb-0"
                    >
                      <span className="text-xl mr-3">{link.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{link.label}</span>
                      <span className="ml-auto text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Events Modal/Section */}
      {showEvents && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <h2 className="text-lg font-semibold mb-4">All Events</h2>
            <button
              className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowEvents(false)}
            >
              Close
            </button>
            <ul>
              {events.map(event => (
                <li key={event._id} className="mb-3 border-b pb-2">
                  <div className="font-bold">{event.title}</div>
                  <div>{event.description}</div>
                  <div>{new Date(event.date).toLocaleDateString()} {event.time}</div>
                  <div className="text-sm text-gray-500">{event.venue}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
