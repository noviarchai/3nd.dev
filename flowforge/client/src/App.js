import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import WorkflowBuilder from './pages/WorkflowBuilder';
import Apps from './pages/Apps';
import History from './pages/History';
import Billing from './pages/Billing';
import AdminDashboard from './pages/admin/Dashboard';
import Layout from './components/Layout';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !user.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/pricing" element={<Pricing />} />
      
      {/* Protected user routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/workflows/new" element={
        <ProtectedRoute>
          <Layout><WorkflowBuilder /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/workflows/:id/edit" element={
        <ProtectedRoute>
          <Layout><WorkflowBuilder /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/apps" element={
        <ProtectedRoute>
          <Layout><Apps /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/history" element={
        <ProtectedRoute>
          <Layout><History /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/billing" element={
        <ProtectedRoute>
          <Layout><Billing /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <Layout admin><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
