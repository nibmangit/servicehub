import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Bell, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import CompleteProfileModal from '../../features/profile/CompleteProfileModal';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-(--radius-md) text-sm font-medium transition-colors ${
    isActive
      ? 'text-(--color-primary) bg-(--color-primary-soft)'
      : 'text-(--color-muted-foreground) hover:text-(--color-foreground) hover:bg-(--color-muted)'
  }`;

export default function MainLayout() {
  const { user, logout, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const profileIncomplete = !user?.full_name || user.full_name.trim() === '';

  return (
    <div className="min-h-screen flex flex-col bg-(--color-background)">
      <header className="border-b border-(--color-border) bg-(--color-card)">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-lg font-bold text-(--color-primary) shrink-0">
              ServiceHub
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/services" className={navLinkClass}>Browse Services</NavLink>
              <NavLink to="/requests" className={navLinkClass}>My Requests</NavLink>
              <NavLink to="/chats" className={navLinkClass}>Messages</NavLink>

              {user?.is_provider ? (
                <NavLink to="/my-services" className={navLinkClass}>My Services</NavLink>
              ) : (
                <NavLink to="/apply-provider" className={navLinkClass}>Become a Provider</NavLink>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-(--radius-md) text-(--color-muted-foreground) hover:bg-(--color-muted) transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/notifications"
              aria-label="Notifications"
              className="p-2 rounded-(--radius-md) text-(--color-muted-foreground) hover:bg-(--color-muted) transition-colors relative"
            >
              <Bell size={18} />
              {/* unread dot wired up in step 4 */}
            </Link>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 pl-2 pr-1 py-1.5 rounded-(--radius-md) hover:bg-(--color-muted) transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center text-sm font-semibold">
                  {user?.email?.[0]?.toUpperCase() || '?'}
                </div>
                <ChevronDown size={14} className="text-(--color-muted-foreground)" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-(--radius-md) border border-(--color-border) bg-(--color-card) shadow-elevated py-1 z-40">
                  <div className="px-3 py-2 text-sm text-(--color-muted-foreground) truncate border-b border-(--color-border)">
                    {user?.email}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-(--color-foreground) hover:bg-(--color-muted) transition-colors"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-(--color-destructive) hover:bg-(--color-muted) transition-colors"
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-(--color-border) py-6 text-center text-sm text-(--color-muted-foreground)">
        ServiceHub
      </footer>

      {profileIncomplete && (
        <CompleteProfileModal profile={user} onProfileUpdated={updateUser} />
      )}
    </div>
  );
}