import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  ClipboardList, 
  Star, 
  Wrench, 
  UserPlus, 
  User, 
  MessageSquare, 
  X, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CompleteProfileModal from '../../features/profile/CompleteProfileModal';
import Header from './Header';

const sidebarLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-(--radius-md) text-sm font-medium transition-colors ${
    isActive
      ? 'text-(--color-primary) bg-(--color-primary-soft)'
      : 'text-(--color-muted-foreground) hover:text-(--color-foreground) hover:bg-(--color-muted)'
  }`;

function SidebarNav({ isProvider, onNavigate, logout }) {
  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 py-6">
      <nav className="space-y-6">
         
        <div>
          <div className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-2 px-1">
            General
          </div>
          <div className="space-y-1">
            <NavLink to="/dashboard" className={sidebarLinkClass} onClick={onNavigate}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/services" className={sidebarLinkClass} onClick={onNavigate}>
              <Search size={18} /> Browse Services
            </NavLink>
            <NavLink to="/requests" className={sidebarLinkClass} onClick={onNavigate}>
              <ClipboardList size={18} /> My Requests
            </NavLink>
            <NavLink to="/chat" className={sidebarLinkClass} onClick={onNavigate}>
              <MessageSquare size={18} /> Messages
            </NavLink>
            <NavLink to="/reviews" className={sidebarLinkClass} onClick={onNavigate}>
              <Star size={17} /> My Reviews
            </NavLink>
          </div>
        </div>
 
        <div>
          <div className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-2 px-1">
            {isProvider ? 'Provider Hub' : 'Client Hub'}
          </div>
          <div className="space-y-1">
            {isProvider ? (
              <NavLink to="/my-services" className={sidebarLinkClass} onClick={onNavigate}>
                <Wrench size={18} /> Manage Listings
              </NavLink>
            ) : (
              <NavLink to="/apply-provider" className={sidebarLinkClass} onClick={onNavigate}>
                <UserPlus size={18} /> Become a Provider
              </NavLink>
            )}
          </div>
        </div>
 
        <div>
          <div className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-2 px-1">
            Account
          </div>
          <div className="space-y-1">
            <NavLink to="/profile" className={sidebarLinkClass} onClick={onNavigate}>
              <User size={18} /> Profile Settings
            </NavLink>
          </div>
        </div>

      </nav>
 
      <div className="pt-6 mt-6 border-t border-(--color-border)">
        <button
          onClick={() => {
            if (onNavigate) onNavigate();
            logout();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-(--radius-md) text-sm font-medium text-(--color-destructive) hover:bg-(--color-destructive)/10 transition-colors cursor-pointer"
        >
          <LogOut size={18} /> Log out
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { user, updateUser, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const profileIncomplete = !user?.full_name || user.full_name.trim() === '';

  return (
    <div className="min-h-screen flex flex-col bg-(--color-background)">
      
      {/* Global Header */}
      <Header variant="dashboard" onMenuClick={() => setMobileSidebarOpen(true)} />

      {/* Main Container Layout */}
      <div className="flex-1 flex overflow-hidden max-w-[1600px] w-full mx-auto">
        
        {/* Desktop Sidebar - Changed to top-0 and added full height minus header offset cleanly */}
        <aside className="hidden md:flex md:w-64 flex-col border-r border-(--color-border) bg-(--color-card)/55 sticky top-0 h-[calc(100vh-4rem)] shrink-0">
          <SidebarNav isProvider={user?.is_provider} logout={logout} />
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 max-w-[80vw] bg-(--color-card) border-r border-(--color-border) flex flex-col shadow-elevated animate-in slide-in-from-left-4 duration-200 z-50">
              <div className="h-16 flex items-center justify-between px-5 border-b border-(--color-border)">
                <span className="text-lg font-bold text-(--color-primary)">Menu</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-(--radius-md) text-(--color-muted-foreground) hover:bg-(--color-muted) cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarNav 
                isProvider={user?.is_provider} 
                onNavigate={() => setMobileSidebarOpen(false)} 
                logout={logout}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
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