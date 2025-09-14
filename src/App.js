import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Admin from './components/Admin';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';

// Create a layout wrapper component
const PageLayout = ({ children }) => {
  const location = useLocation();
  
  // Don't apply layout to auth pages
  if (location.pathname === '/signup' || location.pathname === '/signin') {
    return children;
  }
  
  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        {children}
      </div>
    </Layout>
  );
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <PageLayout>
            <Home />
          </PageLayout>
        } />
        <Route path="/quiz" element={
          <PageLayout>
            <Quiz />
          </PageLayout>
        } />
        <Route path="/admin" element={
          <PageLayout>
            <Admin />
          </PageLayout>
        } />
        <Route path="/dashboard" element={
          <PageLayout>
            <Dashboard />
          </PageLayout>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
