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
  Bell,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useNotifications } from '../../context/NotificationContext';
import CompleteProfileModal from '../../features/profile/CompleteProfileModal';
import Header from './Header';

function NavBadge({ count, isCollapsed }) {
  if (!count) return null;
  return (
    <span
      className={`${
        isCollapsed
          ? 'absolute -top-1 -right-1 min-w-[1.1rem] h-4 text-[10px]'
          : 'ml-auto min-w-[1.25rem] h-5 text-xs'
      } px-1 rounded-full bg-(--color-primary) text-(--color-primary-foreground) font-semibold flex items-center justify-center`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

function SidebarNav({ isProvider, onNavigate, logout, isCollapsed = false }) {
  const { unreadCount: unreadChats } = useChat();
  const { unreadCount: unreadNotifs } = useNotifications();
  const { user } = useAuth();

  const sidebarLinkClass = ({ isActive }) =>
    `flex items-center ${
      isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'
    } py-2.5 rounded-(--radius-md) text-sm font-medium transition-colors relative ${
      isActive
        ? 'text-(--color-primary) bg-(--color-primary-soft)'
        : 'text-(--color-muted-foreground) hover:text-(--color-foreground) hover:bg-(--color-muted)'
    }`;

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto px-3 py-6">
      <nav className="space-y-6">

        <div>
          {!isCollapsed && (
            <div className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-2 px-1">
              General
            </div>
          )}
          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              className={sidebarLinkClass}
              onClick={onNavigate}
              title={isCollapsed ? "Dashboard" : undefined}
            >
              <LayoutDashboard size={18} className="shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>

            {user?.is_staff && (
              <NavLink
                to="/admin"
                className={sidebarLinkClass}
                onClick={onNavigate}
                title={isCollapsed ? "Admin Panel" : undefined}
              >
                <LayoutDashboard size={18} className="shrink-0" />
                {!isCollapsed && <span>Admin Panel</span>}
              </NavLink>
            )}
            
            <NavLink
              to="/services"
              className={sidebarLinkClass}
              onClick={onNavigate}
              title={isCollapsed ? "Browse Services" : undefined}
            >
              <Search size={18} className="shrink-0" />
              {!isCollapsed && <span>Browse Services</span>}
            </NavLink>
            <NavLink
              to="/requests"
              className={sidebarLinkClass}
              onClick={onNavigate}
              title={isCollapsed ? "My Requests" : undefined}
            >
              <ClipboardList size={18} className="shrink-0" />
              {!isCollapsed && <span>My Requests</span>}
            </NavLink>
            <NavLink
              to="/chats"
              className={sidebarLinkClass}
              onClick={onNavigate}
              title={isCollapsed ? "Messages" : undefined}
            >
              <MessageSquare size={18} className="shrink-0" />
              {!isCollapsed && <span>Messages</span>}
              <NavBadge count={unreadChats} isCollapsed={isCollapsed} />
            </NavLink>
            <NavLink
              to="/notifications"
              className={sidebarLinkClass}
              onClick={onNavigate}
              title={isCollapsed ? "Notifications" : undefined}
            >
              <Bell size={18} className="shrink-0" />
              {!isCollapsed && <span>Notifications</span>}
              <NavBadge count={unreadNotifs} isCollapsed={isCollapsed} />
            </NavLink>
            <NavLink
              to="/reviews"
              className={sidebarLinkClass}
              onClick={onNavigate}
              title={isCollapsed ? "My Reviews" : undefined}
            >
              <Star size={17} className="shrink-0" />
              {!isCollapsed && <span>My Reviews</span>}
            </NavLink>
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <div className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-2 px-1">
              {isProvider ? 'Provider Hub' : 'Client Hub'}
            </div>
          )}
          <div className="space-y-1">
            {isProvider ? (
              <NavLink
                to="/my-services"
                className={sidebarLinkClass}
                onClick={onNavigate}
                title={isCollapsed ? "Manage Listings" : undefined}
              >
                <Wrench size={18} className="shrink-0" />
                {!isCollapsed && <span>Manage Listings</span>}
              </NavLink>
            ) : (
              <NavLink
                to="/apply-provider"
                className={sidebarLinkClass}
                onClick={onNavigate}
                title={isCollapsed ? "Become a Provider" : undefined}
              >
                <UserPlus size={18} className="shrink-0" />
                {!isCollapsed && <span>Become a Provider</span>}
              </NavLink>
            )}
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <div className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-2 px-1">
              Account
            </div>
          )}
          <div className="space-y-1">
            <NavLink
              to="/profile"
              className={sidebarLinkClass}
              onClick={onNavigate}
              title={isCollapsed ? "Profile Settings" : undefined}
            >
              <User size={18} className="shrink-0" />
              {!isCollapsed && <span>Profile Settings</span>}
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
          title={isCollapsed ? "Log out" : undefined}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'
          } py-2.5 rounded-(--radius-md) text-sm font-medium text-(--color-destructive) hover:bg-(--color-destructive)/10 transition-colors cursor-pointer`}
        >
          <LogOut size={18} className="shrink-0" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { user, updateUser, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const profileIncomplete = !user?.full_name || user.full_name.trim() === '';

  return (
    <div className="min-h-screen flex flex-col bg-(--color-background)">

      <Header variant="dashboard" onMenuClick={() => setMobileSidebarOpen(true)} />

      <div className="flex-1 flex overflow-hidden max-w-[1600px] w-full mx-auto">

        {/* Desktop Sidebar with Toggle on Right Edge */}
        <aside
          className={`hidden md:flex relative flex-col border-r border-(--color-border) bg-(--color-card)/55 sticky top-0 h-[calc(100vh-4rem)] shrink-0 transition-all duration-300 ease-in-out ${
            desktopCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Right-side Toggle Button */}
          <button
            onClick={() => setDesktopCollapsed((prev) => !prev)}
            title={desktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="absolute -right-3 top-6 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-(--color-border) bg-(--color-card) text-(--color-muted-foreground) shadow-xs hover:text-(--color-foreground) hover:bg-(--color-muted) transition-colors cursor-pointer"
          >
            {desktopCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          <SidebarNav
            isProvider={user?.is_provider}
            logout={logout}
            isCollapsed={desktopCollapsed}
          />
        </aside>

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
                isCollapsed={false}
              />
            </div>
          </div>
        )}

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