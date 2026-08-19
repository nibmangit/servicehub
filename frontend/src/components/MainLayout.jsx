import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-foreground) flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-(--color-card) border-b border-(--color-border) shadow-soft">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold text-(--color-primary)">
              ServiceHub
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link to="/dashboard" className="hover:text-(--color-primary) transition-colors">Dashboard</Link>
              <Link to="/services" className="hover:text-(--color-primary) transition-colors">Services</Link>
              <Link to="/requests" className="hover:text-(--color-primary) transition-colors">Requests</Link>
              <Link to="/chats" className="hover:text-(--color-primary) transition-colors">Messages</Link>
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-(--radius-md) bg-(--color-secondary) text-(--color-secondary-foreground) hover:opacity-80 transition-all cursor-pointer border border-(--color-border)"
              title="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* User Profile / Logout */}
            <div className="flex items-center space-x-3 pl-4 border-l border-(--color-border)">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.username || user?.email || 'Account'}</p>
                <p className="text-xs text-(--color-muted-foreground)">Active User</p>
              </div>
              <button 
                onClick={logout}
                className="px-3 py-1.5 text-sm bg-(--color-destructive) text-(--color-destructive-foreground) rounded-(--radius-md) font-medium hover:opacity-90 transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}