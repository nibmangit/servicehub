import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import RootRedirect from './routes/RootRedirect';

import ServicesPage from './features/services/ServicesPage';
import ServiceDetailPage from './features/services/ServiceDetailPage';
import MyServicesPage from './features/services/MyServicesPage';
import ServiceFormPage from './features/services/ServiceFormPage';
import RequestsPage from './features/requests/RequestsPage';
import RequestDetailPage from './features/requests/RequestDetailPage';
import DashboardPage from './features/dashboard/DashboardPage';
import ProfilePage from './features/profile/ProfilePage';
import ApplyProviderPage from './features/profile/ApplyProviderPage';
import LandingPage from './features/LandingPaga';
import ProviderPublicProfilePage from './features/profile/ProviderPublicProfilePage';
import MyReviewsPage from './features/reviews/MyReviewsPage';
import ReviewDetailPage from './features/reviews/ReviewDetailPage';
import NotificationsPage from './features/notifications/NotificationsPage'; 

import ChatLayout from './features/chats/ChatLayout';
import EmptyChatState from './features/chats/EmptyChatState';
import ConversationDetailPage from './features/chats/ConversationDetailPage';

export default function App() {
  return (
    <Routes>
      {/* Public browsing — same layout whether logged in or not */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/providers/:id" element={<ProviderPublicProfilePage />} />

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
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/chats" element={<ChatLayout />}>
          <Route index element={<EmptyChatState />} />
          <Route path=":id" element={<ConversationDetailPage />} />
        </Route>
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/requests/:id" element={<RequestDetailPage />} />
        <Route path="/reviews" element={<MyReviewsPage />} />
        <Route path="/reviews/:id" element={<ReviewDetailPage />} />
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
        <Route
          path="/my-services/new"
          element={
            <RoleRoute role="provider">
              <ServiceFormPage />
            </RoleRoute>
          }
        />
        <Route
          path="/my-services/:id/edit"
          element={
            <RoleRoute role="provider">
              <ServiceFormPage />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}