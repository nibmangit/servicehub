import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, ClipboardList, Wrench, UserPlus, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CompleteProfileModal from '../../features/profile/CompleteProfileModal';
import Header from './Header';

const sidebarLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-(--radius-md) text-sm font-medium transition-colors ${
    isActive
      ? 'text-(--color-primary) bg-(--color-primary-soft)'
      : 'text-(--color-muted-foreground) hover:text-(--color-foreground) hover:bg-(--color-muted)'
  }`;

function SidebarNav({ isProvider, onNavigate }) {
  return (
    <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
      <div className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-3 px-1">Menu</div>
      <NavLink to="/dashboard" className={sidebarLinkClass} onClick={onNavigate}>
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>
      <NavLink to="/services" className={sidebarLinkClass} onClick={onNavigate}>
        <Search size={18} /> Browse Services
      </NavLink>
      <NavLink to="/requests" className={sidebarLinkClass} onClick={onNavigate}>
        <ClipboardList size={18} /> My Requests
      </NavLink>

      <div className="mt-8 mb-3 px-1 text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider pt-6 border-t border-(--color-border)">Account</div>
      {isProvider ? (
        <NavLink to="/my-services" className={sidebarLinkClass} onClick={onNavigate}>
          <Wrench size={18} /> Manage Listings
        </NavLink>
      ) : (
        <NavLink to="/apply-provider" className={sidebarLinkClass} onClick={onNavigate}>
          <UserPlus size={18} /> Become a Provider
        </NavLink>
      )}

      <NavLink to="/profile" className={sidebarLinkClass} onClick={onNavigate}>
        <User size={18} /> Profile Settings
      </NavLink>
    </nav>
  );
}

export default function DashboardLayout() {
  const { user, updateUser } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const profileIncomplete = !user?.full_name || user.full_name.trim() === '';

  return (
    // 1. Column layout for the whole page
    <div className="min-h-screen flex flex-col bg-(--color-background)">
      
      {/* 2. Global Header stays completely at the top */}
      <Header variant="dashboard" onMenuClick={() => setMobileSidebarOpen(true)} />

      {/* 3. Row layout for Sidebar + Content that sits beneath the header */}
      <div className="flex-1 flex overflow-hidden max-w-[1600px] w-full mx-auto">
        
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:w-64 flex-col border-r border-(--color-border) bg-(--color-card)/50">
          <SidebarNav isProvider={user?.is_provider} />
        </aside>

        {/* Mobile sidebar drawer */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 max-w-[80vw] bg-(--color-card) border-r border-(--color-border) flex flex-col shadow-elevated animate-in slide-in-from-left-4 duration-200">
              <div className="h-16 flex items-center justify-between px-5 border-b border-(--color-border)">
                <span className="text-lg font-bold text-(--color-primary)">Menu</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-(--radius-md) text-(--color-muted-foreground) hover:bg-(--color-muted)"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarNav isProvider={user?.is_provider} onNavigate={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area - Full width available after sidebar */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-(--color-background)">
          <Outlet />
        </main>
      </div>

      {profileIncomplete && (
        <CompleteProfileModal profile={user} onProfileUpdated={updateUser} />
      )}
    </div>
  );
}