import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Layout } from './components/Layout';

// Protected Route Wrapper
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

import { Dashboard } from './pages/dashboard/Dashboard';
import { IncidentList } from './pages/incidents/IncidentList';
import { CreateIncident } from './pages/incidents/CreateIncident';
import { InspectionList } from './pages/inspections/InspectionList';
import { CapaList } from './pages/capas/CapaList';
import { Billing } from './pages/billing/Billing';
import { Reports } from './pages/reports/Reports';

import { useEffect } from 'react';
import { processQueue } from './lib/offlineQueue';

export function App() {
  useEffect(() => {
    // Process queue on mount if online
    if (navigator.onLine) {
      processQueue();
    }

    // Listen for online status
    const handleOnline = () => {
      processQueue();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={
            <Layout title="Dashboard">
              <Dashboard />
            </Layout>
          } />

          <Route path="/incidents" element={
            <Layout title="Incidents">
              <IncidentList />
            </Layout>
          } />

          <Route path="/incidents/new" element={
            <Layout title="Report Incident" showBack>
              <CreateIncident />
            </Layout>
          } />

          <Route path="/inspections" element={
            <Layout title="Inspections">
              <InspectionList />
            </Layout>
          } />

          <Route path="/capas" element={
            <Layout title="Tasks">
              <CapaList />
            </Layout>
          } />

          <Route path="/billing" element={
            <Layout title="Billing">
              <Billing />
            </Layout>
          } />

          <Route path="/reports" element={
            <Layout title="Reports">
              <Reports />
            </Layout>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}