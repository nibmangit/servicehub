import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)]">
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

function DashboardPlaceholder() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] p-8">
      <div className="max-w-4xl mx-auto bg-[var(--color-card)] p-8 rounded-[var(--radius-2xl)] border border-[var(--color-border)] shadow-elevated">
        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-4">Dashboard</h1>
        <p className="text-[var(--color-muted-foreground)] mb-6">
          Welcome back, <span className="font-semibold text-[var(--color-foreground)]">{user?.username || 'User'}</span>! Your modular structure is locked in.
        </p>
        <button 
          onClick={logout}
          className="px-5 py-2 bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] rounded-[var(--radius-md)] font-medium cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPlaceholder />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;