import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Ideas from './pages/Ideas';
import RoadmapPage from './pages/RoadmapPage';
import Mentors from './pages/Mentors';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard'; // ✅ NEW

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/" />;
};

// ✅ NEW — Only lets admins through
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/ideas" element={<PrivateRoute><Ideas /></PrivateRoute>} />
      <Route path="/roadmap/:ideaId" element={<PrivateRoute><RoadmapPage /></PrivateRoute>} />
      <Route path="/mentors" element={<PrivateRoute><Mentors /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} /> {/* ✅ NEW */}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;