import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
 
export default function RoleRoute({ role, children }) {
  const { user } = useAuth();

  if (role === 'provider' && !user?.is_provider) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}