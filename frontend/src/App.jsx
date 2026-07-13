import { BrowserRouter, Routes, Route } from "react-router-dom";
import Toaster from "./components/ui/Toaster";

// Layout Components
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";

// Main Page View
import Home from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Browse } from "./pages/Browse";
import { ServiceDetail } from "./pages/ServiceDetail";
import NewService from "./pages/NewService";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        
        <main className="flex-1">
          <Routes>
            {/* The ONLY route in the entire application right now */}
            <Route path="/" element={<Home />} />
            <Route path="dashboard/" element={<Dashboard />} />
            <Route path="browse/" element={<Browse />} />
            <Route path="services/:id/" element={<ServiceDetail />} />
            <Route path="services/new/" element={<NewService />} />
            <Route path="profile/:id/" element={<Profile />} />
          </Routes>
        </main>

        <SiteFooter />
        <Toaster />
      </div>
    </BrowserRouter>
  );
}