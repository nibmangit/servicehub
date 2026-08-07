import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Toaster from "./components/ui/Toaster";

// Layout Components
import AppLayout from "./layouts/AppLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Main Page View
import Home from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Browse } from "./pages/Browse";
import { ServiceDetail } from "./pages/ServiceDetail";
import ServiceForm from "./pages/ServiceForm";
import Profile from "./pages/Profile";
import BecomeProvider from "./pages/BecomeProvider";
import MyServices from "./pages/MyServices";
import Requests from "./pages/Requests";
import ReviewsPage from "./pages/Reviews"; 
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProviderRouteGuard from "./components/profile/provider/ProviderRouteGuard";
import VerifyFayda from "./pages/VerifyFayda";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Parent Layout */}
        <Route element={<AppLayout />}>

          {/* Public Pages */}
          <Route index element={<Home />} />
          <Route path="browse" element={<Browse />} />
          <Route path="services/:id" element={<ServiceDetail />} />

          <Route element={<ProviderRouteGuard />}>
            <Route path="become-provider" element={<BecomeProvider />} />
          </Route>

          <Route path="/verify-identity" element={<VerifyFayda />} />

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Dashboard Layout */}
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="services" element={<MyServices />} />
            <Route path="services/new" element={<ServiceForm />} />
            <Route path="/services/:id/edit" element={<ServiceForm />} />
            <Route path="requests" element={<Requests />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="messages" element={<Messages />} />

            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}