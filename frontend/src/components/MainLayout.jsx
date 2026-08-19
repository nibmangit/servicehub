import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { profileApi } from '../services/profileApi';
import CompleteProfileModal from '../features/profiles/CompleteProfileModal';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileApi.getMyProfile();
      setProfile(data);
    } catch (err) {
      console.error("Failed to load user profile in layout", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Services', path: '/services', icon: '🛠️' },
    { name: 'Requests / Bookings', path: '/requests', icon: '📋' },
    { name: 'Messages', path: '/chats', icon: '💬' },
    { name: 'Profile & Identity', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-foreground) flex flex-col transition-colors duration-300">
      
      {/* If profile has no full name, block/prompt them with the modal */}
      {!loadingProfile && (
        <CompleteProfileModal 
          profile={profile} 
          onProfileUpdated={(updatedProfile) => setProfile(updatedProfile)} 
        />
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-(--color-card) border-b border-(--color-border) shadow-soft h-16 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold text-(--color-primary)">ServiceHub</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-(--color-secondary) text-(--color-muted-foreground) font-medium">
            {user?.is_provider ? '🌟 Provider Mode' : '👤 Customer Mode'}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-(--radius-md) bg-(--color-secondary) text-(--color-secondary-foreground) hover:opacity-80 transition-all cursor-pointer border border-(--color-border)"
            title="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <div className="flex items-center space-x-3 pl-4 border-l border-(--color-border)">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{profile?.full_name || user?.email || 'Account'}</p>
              <p className="text-xs text-(--color-muted-foreground)">Active Session</p>
            </div>
            <button 
              onClick={logout}
              className="px-3 py-1.5 text-sm bg-(--color-destructive) text-(--color-destructive-foreground) rounded-(--radius-md) font-medium hover:opacity-90 transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Body with Sidebar and Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 hidden md:block p-6 border-r border-(--color-border) bg-(--color-card)/50">
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-(--radius-md) text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-(--color-primary) text-(--color-primary-foreground) shadow-soft' 
                      : 'text-(--color-foreground) hover:bg-(--color-secondary)'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content View */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}