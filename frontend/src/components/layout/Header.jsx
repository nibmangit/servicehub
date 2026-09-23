import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, ChevronDown, LogOut, User as UserIcon, LayoutDashboard, MessageSquare, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-(--radius-md) text-sm font-medium transition-colors flex items-center gap-1.5 ${
    isActive
      ? 'text-(--color-primary) bg-(--color-primary-soft)'
      : 'text-(--color-muted-foreground) hover:text-(--color-foreground) hover:bg-(--color-muted)'
  }`;

export default function Header({ variant = 'public', onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking anywhere outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-(--color-border) bg-card/95 backdrop-blur-sm">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3 max-w-[1600px] mx-auto">
        
        {/* Left Side: Dashboard Menu Button (Mobile) + Logo + Browse Services */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          {variant === 'dashboard' && (
            <button
              onClick={onMenuClick}
              aria-label="Open sidebar menu"
              className="md:hidden p-2 -ml-2 rounded-(--radius-md) text-(--color-muted-foreground) hover:bg-(--color-muted) transition-colors cursor-pointer"
            >
              <Menu size={20} />
            </button>
          )}

          <Link to="/" className="text-xl font-bold text-(--color-primary) shrink-0 tracking-tight">
            ServiceHub
          </Link>

          {/* Always Available Browse Services Navigation */}
          <nav className="hidden md:flex items-center gap-1 border-l border-(--color-border) pl-4">
            <NavLink to="/services" className={navLinkClass}>
              <Compass size={16} /> Browse Services
            </NavLink>
          </nav>
        </div>

        {/* Right Side: Quick Action Links (Logged In), Theme, Notifications, User Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Quick Links for Logged-In Users on Desktop */}
          {user && (
            <div className="hidden lg:flex items-center gap-1">
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
              <NavLink to="/chat" className={navLinkClass}>
                <MessageSquare size={16} /> Chat
              </NavLink>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-(--radius-md) text-(--color-muted-foreground) hover:bg-(--color-muted) transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications Bell */}
          {user && (
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="p-2 rounded-(--radius-md) text-(--color-muted-foreground) hover:bg-(--color-muted) transition-colors relative cursor-pointer inline-flex items-center justify-center"
            >
              <Bell size={18} /> 
            </Link>
          )}

          {/* User Profile Dropdown or Logged Out Auth Buttons */}
          {user ? (
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-expanded={userMenuOpen}
                aria-label="User menu"
                className="flex items-center gap-1.5 pl-2 pr-1 py-1.5 rounded-(--radius-md) hover:bg-(--color-muted) transition-colors cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center text-sm font-semibold shrink-0">
                  {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                </div>
                <ChevronDown size={14} className="hidden sm:block text-(--color-muted-foreground)" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-(--radius-md) border border-(--color-border) bg-(--color-card) shadow-elevated py-1 z-50 animate-fade-in">
                  <div className="px-4 py-3 text-sm border-b border-(--color-border)">
                    <p className="font-medium text-(--color-foreground) truncate">{user?.full_name || 'User'}</p>
                    <p className="text-xs text-(--color-muted-foreground) truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/services"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-(--color-foreground) hover:bg-(--color-muted) transition-colors mt-1 md:hidden"
                  >
                    <Compass size={16} /> Browse Services
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-(--color-foreground) hover:bg-(--color-muted) transition-colors lg:hidden"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>

                  <Link
                    to="/chats"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-(--color-foreground) hover:bg-(--color-muted) transition-colors lg:hidden"
                  >
                    <MessageSquare size={16} /> Chat
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-(--color-foreground) hover:bg-(--color-muted) transition-colors"
                  >
                    <UserIcon size={16} /> My Profile
                  </Link>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-(--color-destructive) hover:bg-(--color-destructive)/10 transition-colors mt-1 border-t border-(--color-border) cursor-pointer"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link
                to="/login"
                className="px-3 sm:px-4 py-2 rounded-(--radius-md) text-sm font-medium text-(--color-foreground) hover:bg-(--color-muted) transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-block px-4 py-2 rounded-(--radius-md) text-sm font-medium bg-(--color-primary) text-(--color-primary-foreground) hover:opacity-95 transition-opacity shadow-soft"
              >
                Sign up
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}