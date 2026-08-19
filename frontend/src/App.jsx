import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import MainLayout from './components/MainLayout';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-background) text-(--color-foreground)">
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

// Temporary placeholders for upcoming modules
function DashboardPlaceholder() {
  const { user } = useAuth();
  return (
    <div className="bg-(--color-card) p-8 rounded-(--radius-2xl) border border-(--color-border) shadow-elevated">
      <h1 className="text-3xl font-bold text-(--color-primary) mb-4">Dashboard Overview</h1>
      <p className="text-(--color-muted-foreground)">
        Welcome back, <span className="font-semibold text-(--color-foreground)">{user?.email || 'User'}</span>! Your layout shell and navbar are fully active.
      </p>
    </div>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="bg-(--color-card) p-8 rounded-(--radius-2xl) border border-(--color-border) shadow-elevated">
      <h1 className="text-2xl font-bold text-(--color-primary) mb-2">{title}</h1>
      <p className="text-(--color-muted-foreground)">This module view is ready to be built next.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Application Routes wrapped inside MainLayout */}
        <Route 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPlaceholder />} />
          <Route path="/services" element={<PlaceholderPage title="Service Catalog & Management" />} />
          <Route path="/requests" element={<PlaceholderPage title="Client & Provider Requests" />} />
          <Route path="/chats" element={<PlaceholderPage title="Messages & Conversations Inbox" />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;