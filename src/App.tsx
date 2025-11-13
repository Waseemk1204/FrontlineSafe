import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { AppShell } from './components/layout/AppShell';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/app/Dashboard';
import { Report } from './pages/app/Report';
export function App() {
  return <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected App Routes */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="report" element={<Report />} />
            {/* Placeholder routes for future pages */}
            <Route path="incidents" element={<PlaceholderPage title="Incidents" />} />
            <Route path="inspections" element={<PlaceholderPage title="Inspections" />} />
            <Route path="capas" element={<PlaceholderPage title="CAPAs" />} />
            <Route path="docs" element={<PlaceholderPage title="Documents" />} />
            <Route path="users" element={<PlaceholderPage title="Users" />} />
            <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>;
}
function PlaceholderPage({
  title
}: {
  title: string;
}) {
  return <div className="p-16 md:p-24">
      <h1 className="text-h1 font-bold text-primary mb-16">{title}</h1>
      <p className="text-neutral-600">This page is under construction.</p>
    </div>;
}