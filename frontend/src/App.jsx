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
import NewService from "./pages/NewService";
import Profile from "./pages/Profile";
import BecomeProvider from "./pages/BecomeProvider";
import MyServices from "./pages/MyServices";
import Requests from "./pages/Requests";

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
          <Route path="become-provider" element={<BecomeProvider />} />

          {/* Dashboard Layout */}
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="services" element={<MyServices />} />
            <Route path="services/new" element={<NewService />} />
            <Route path="requests" element={<Requests />} />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}