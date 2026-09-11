import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import InvoicesPage from './pages/InvoicesPage';
import ContractsPage from './pages/ContractsPage';
import OnboardingPage from './pages/OnboardingPage';
import AssetsPage from './pages/AssetsPage';
import NotificationsPage from './pages/NotificationsPage';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />

          {/* Client management - admin & team_member */}
          <Route path="/clients" element={
            <ProtectedRoute allowedRoles={['admin', 'team_member']}>
              <ClientsPage />
            </ProtectedRoute>
          } />
          <Route path="/clients/:id" element={<ClientDetailPage />} />

          {/* Project management */}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />

          {/* Invoices - admin & team_member */}
          <Route path="/invoices" element={
            <ProtectedRoute allowedRoles={['admin', 'team_member']}>
              <InvoicesPage />
            </ProtectedRoute>
          } />

          {/* Contracts - admin & team_member */}
          <Route path="/contracts" element={
            <ProtectedRoute allowedRoles={['admin', 'team_member']}>
              <ContractsPage />
            </ProtectedRoute>
          } />

          {/* Onboarding */}
          <Route path="/onboarding/:id" element={<OnboardingPage />} />

          {/* Assets */}
          <Route path="/assets" element={<AssetsPage />} />

          {/* Notifications */}
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* User management - admin only */}
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UsersPage />
            </ProtectedRoute>
          } />

          {/* Reports - admin only */}
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ReportsPage />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <h1 style={{ fontSize: '4rem', color: '#4F46E5' }}>404</h1>
              <p style={{ fontSize: '1.25rem', color: '#6B7280' }}>Page not found</p>
              <a href="/" style={{ color: '#4F46E5', textDecoration: 'underline' }}>Go to Dashboard</a>
            </div>
          } />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
