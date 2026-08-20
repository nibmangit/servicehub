import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

import DashboardPage from './features/dashboard/DashboardPage';
import ServicesPage from './features/services/ServicesPage';
import MyServicesPage from './features/services/MyServicesPage';
import RequestsPage from './features/requests/RequestsPage';
import ChatsPage from './features/chats/ChatsPage';
import NotificationsPage from './features/notifications/NotificationsPage';
import ProfilePage from './features/profile/ProfilePage';
import ApplyProviderPage from './features/profile/ApplyProviderPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/apply-provider" element={<ApplyProviderPage />} />
          <Route
            path="/my-services"
            element={
              <RoleRoute role="provider">
                <MyServicesPage />
              </RoleRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}