import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import RootRedirect from './routes/RootRedirect';

import ServicesPage from './features/services/ServicesPage';
import DashboardPage from './features/dashboard/DashboardPage';
import MyServicesPage from './features/services/MyServicesPage';
import RequestsPage from './features/requests/RequestsPage';
import ProfilePage from './features/profile/ProfilePage';
import ApplyProviderPage from './features/profile/ApplyProviderPage';
import LandingPage from './features/LandingPaga';

export default function App() {
  return (
    <BrowserRouter>
      <Routes> 
        {/* Public browsing — same layout whether logged in or not */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          {/* /services/:id lands here once we build Service Detail */}

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Authenticated app, sidebar layout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/requests" element={<RequestsPage />} />
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
        </Route>

        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}