import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#EF4444' }}>403</h1>
        <p style={{ fontSize: '1.25rem', color: '#6B7280' }}>You don't have permission to access this page.</p>
        <a href="/" style={{ color: '#4F46E5', textDecoration: 'underline' }}>Go to Dashboard</a>
      </div>
    );
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

