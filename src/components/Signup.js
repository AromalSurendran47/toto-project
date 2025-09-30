import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import Layout from './Layout';

const semesters = ['1st', '2nd', '3rd', '4th'];

const Signup = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    semester: semesters[0],
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e, form) => {
    const { name, value } = e.target;
    if (form === 'login') {
      setLoginData(prev => ({ ...prev, [name]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateEmail = (email) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    // Simple phone validation (10 digits)
    return /^\d{10}$/.test(phone);
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(loginData.email)) newErrors.email = 'Invalid email format';
    if (!loginData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!registerData.name) newErrors.name = 'Name is required';
    if (!registerData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(registerData.email)) newErrors.email = 'Invalid email format';
    if (!registerData.phone) newErrors.phone = 'Phone is required';
    else if (!validatePhone(registerData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!registerData.semester) newErrors.semester = 'Semester is required';
    if (!registerData.password) newErrors.password = 'Password is required';
    else if (registerData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (validateLogin()) {
      try {
        const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData)
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', data.name);   // Store user name
          localStorage.setItem('userEmail', loginData.email); // Store user email
          localStorage.setItem('userRole', data.role);   // Store user role
          toast.success('Login successful!');
          setTimeout(() => navigate('/'), 1500);
        } else {
          toast.error(data.message || 'Login failed');
        }
      } catch (error) {
        toast.error('Network error. Please try again.');
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (validateRegister()) {
      try {
        const response = await fetch('http://localhost:3001/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...registerData, role: 'user' }) // Always send role as 'user'
        });
        const data = await response.json();
        if (response.ok) {
          toast.success('Registration successful!');
          setRegisterData({
            name: '',
            email: '',
            phone: '',
            semester: semesters[0],
            password: ''
          }); // Clear registration form
          setActiveTab('login');
        } else {
          toast.error(data.message || 'Registration failed');
        }
      } catch (error) {
        toast.error('Network error. Please try again.');
      }
    }
  };

  const checkEmailExists = async (email) => {
    if (!validateEmail(email)) return; // Only check valid emails
    try {
      const response = await fetch('http://localhost:3001/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.exists) {
        toast.error(data.message || 'Email already registered');
        setErrors(prev => ({ ...prev, email: data.message || 'Email already registered' }));
      } else {
        toast.success('Email is available');
        setErrors(prev => ({ ...prev, email: '' }));
      }
    } catch (error) {
      toast.error('Error validating email');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Layout/> */}
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4">
        <ToastContainer position="top-right" autoClose={2000} />
        <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md">
          <div className="flex mb-8">
            <button
              className={`flex-1 py-2 rounded-t-lg font-semibold ${activeTab === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'bg-gray-200 text-gray-600'}`}
              onClick={() => { setActiveTab('login'); setErrors({}); }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-t-lg font-semibold ${activeTab === 'register' ? 'bg-white text-blue-600 shadow-sm' : 'bg-gray-200 text-gray-600'}`}
              onClick={() => { setActiveTab('register'); setErrors({}); }}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Login to your account</h2>
              <form className="space-y-6" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="login-email">Email address</label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="mt-1 w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={e => handleChange(e, 'login')}
                    required
                  />
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="mt-1 w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={e => handleChange(e, 'login')}
                    required
                  />
                  {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm"
                >
                  Login
                </button>
              </form>
            </div>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create an account</h2>
              <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="mt-1 w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      value={registerData.name}
                      onChange={e => handleChange(e, 'register')}
                      required
                    />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="mt-1 w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      value={registerData.email}
                      onChange={e => handleChange(e, 'register')}
                      onBlur={e => checkEmailExists(e.target.value)} // Add this line
                      required
                    />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-1 w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    value={registerData.phone}
                    onChange={e => handleChange(e, 'register')}
                    required
                  />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="semester">Semester</label>
                  <select
                    id="semester"
                    name="semester"
                    className="mt-1 w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    value={registerData.semester}
                    onChange={e => handleChange(e, 'register')}
                    required
                  >
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                  {errors.semester && <p className="text-sm text-red-600 mt-1">{errors.semester}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="register-password">Password</label>
                  <input
                    id="register-password"
                    name="password"
                    type="password"
                    className="mt-1 w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    value={registerData.password}
                    onChange={e => handleChange(e, 'register')}
                    required
                  />
                  {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm"
                >
                  Register
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
