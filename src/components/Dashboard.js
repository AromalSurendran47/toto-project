import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [userName, setUserName] = useState('Student');
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [quizzes, setQuizzes] = useState([]);
  const [takingQuiz, setTakingQuiz] = useState(false);
  const [takeQuizData, setTakeQuizData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [checkedMap, setCheckedMap] = useState({}); // { [qIndex]: { selectedIndex, correctIndex, correct } }
  const [takingQuizLoading, setTakingQuizLoading] = useState(false);
  const [takeResult, setTakeResult] = useState(null);

  // Fetch events when dashboard loads
  React.useEffect(() => {
    fetchEvents();
    fetchQuizzes();
    const storedName = localStorage.getItem('userName');
    if (storedName && typeof storedName === 'string' && storedName.trim().length > 0) {
      setUserName(storedName);
    }
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) setUserId(storedUserId);
    const storedRole = localStorage.getItem('role');
    if (storedRole) setUserRole(storedRole);
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      // Normalize email to avoid stray spaces
      refreshUserFromEmail(String(storedEmail).trim());
    }
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

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://localhost:3001/quizzes');
      const data = await response.json();
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const startTakeQuiz = async (quizId) => {
    if (!userId) {
      alert('Please log in to take the quiz.');
      return;
    }
    setTakingQuizLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/quizzes/${quizId}/take?studentId=${userId}`);
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Unable to start quiz');
        setTakingQuizLoading(false);
        return;
      }
      setTakeQuizData(data);
      setAnswers(new Array(data.questions.length).fill(-1));
      setCheckedMap({});
      setTakingQuiz(true);
      setTakeResult(null);
    } catch (e) {
      alert('Error loading quiz');
    } finally {
      setTakingQuizLoading(false);
    }
  };

  const refreshUserFromEmail = async (email) => {
    try {
      const res = await fetch(`http://localhost:3001/users/by-email?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && data && data.userId) {
        setUserId(data.userId);
        setUserRole(data.role || 'user');
        // keep localStorage aligned for future sessions
        localStorage.setItem('userId', data.userId);
        if (data.role) localStorage.setItem('role', data.role);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to refresh user by email', e);
    }
  };

  const setAnswer = (qIndex, optionIndex) => {
    const copy = [...answers];
    copy[qIndex] = optionIndex;
    setAnswers(copy);
    // Immediately check answer with backend and update highlight map
    checkAnswer(qIndex, optionIndex);
  };

  const checkAnswer = async (qIndex, optionIndex) => {
    try {
      const res = await fetch(`http://localhost:3001/quizzes/${takeQuizData._id}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: userId, questionIndex: qIndex, selectedIndex: optionIndex })
      });
      const data = await res.json();
      if (!res.ok) return;
      setCheckedMap((prev) => ({
        ...prev,
        [qIndex]: { selectedIndex: optionIndex, correctIndex: data.correctIndex, correct: data.correct }
      }));
    } catch (e) {
      // ignore transient errors
    }
  };

  const submitQuiz = async () => {
    if (!takeQuizData) return;
    if (answers.some((a) => a === -1)) {
      alert('Please answer all questions.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/quizzes/${takeQuizData._id}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: userId, answers })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to submit quiz');
        return;
      }
      setTakeResult({ score: data.score, numCorrect: data.numCorrect, totalMarks: data.totalMarks });
      fetchQuizzes();
    } catch (e) {
      alert('Error submitting quiz');
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
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
              {/* Quizzes */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Quizzes</h2>
                  {userRole && userRole.toLowerCase() === 'admin' && (
                    <Link to="/quiz" className="text-sm font-medium text-blue-600 hover:text-blue-800">Create Quiz</Link>
                  )}
                </div>
                <div className="divide-y divide-gray-200">
                  {quizzes.length === 0 ? (
                    <div className="p-4 text-gray-500">No quizzes available.</div>
                  ) : (
                    quizzes.slice(0, 5).map((qz) => (
                      <div key={qz._id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{qz.title}</p>
                            <p className="text-xs text-gray-500 mt-1">Total Marks: {qz.totalMarks} · Questions: {qz.questions?.length || 0}</p>
                          </div>
                          {(!userRole || userRole.toLowerCase() !== 'admin') ? (
                            <button
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              onClick={() => startTakeQuiz(qz._id)}
                              disabled={takingQuizLoading}
                            >
                              {takingQuizLoading ? 'Loading...' : 'Take Quiz'}
                            </button>
                          ) : (
                            <span className="text-gray-500 text-sm">Admin view</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50 text-right">
                  <Link to="/quizzes" className="text-sm font-medium text-blue-600 hover:text-blue-800">View all quizzes →</Link>
                </div>
              </div>
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

      {/* Take Quiz Modal */}
      {takingQuiz && takeQuizData && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => { setTakingQuiz(false); setTakeQuizData(null); setAnswers([]); setTakeResult(null); }}
            >
              Close
            </button>
            <h2 className="text-lg font-semibold mb-4">{takeQuizData.title}</h2>
            {takeResult ? (
              <div className="p-4 bg-green-50 rounded border border-green-200 text-green-800 mb-4">
                Score: {takeResult.score} / {takeResult.totalMarks} ({takeResult.numCorrect} correct)
              </div>
            ) : null}
            <div className="space-y-6 max-h-[60vh] overflow-auto pr-2">
              {takeQuizData.questions.map((q, qIndex) => (
                <div key={qIndex} className="border border-gray-200 rounded-md p-4">
                  <p className="text-sm font-medium text-gray-900 mb-3">Q{qIndex + 1}. {q.text}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, oIndex) => {
                      const check = checkedMap[qIndex];
                      const isCorrectOption = check && check.correctIndex === oIndex;
                      const isSelectedWrong = check && !check.correct && check.selectedIndex === oIndex;
                      const wrapperClass = isCorrectOption
                        ? 'bg-green-50 border-green-300'
                        : isSelectedWrong
                        ? 'bg-red-50 border-red-300'
                        : 'bg-white border-gray-200';
                      const textClass = isCorrectOption ? 'text-green-800' : isSelectedWrong ? 'text-red-800' : 'text-gray-700';
                      return (
                        <label key={oIndex} className={`flex items-center gap-2 text-sm border rounded px-3 py-2 ${wrapperClass}`}>
                          <input
                            type="radio"
                            name={`q-${qIndex}`}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            checked={answers[qIndex] === oIndex}
                            onChange={() => setAnswer(qIndex, oIndex)}
                          />
                          <span className={textClass}>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={submitQuiz}
                disabled={!!takeResult}
              >
                Submit Answers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
