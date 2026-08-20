import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon, Bell, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const publicNavLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-(--radius-md) text-sm font-medium transition-colors ${
    isActive
      ? 'text-(--color-primary) bg-(--color-primary-soft)'
      : 'text-(--color-muted-foreground) hover:text-(--color-foreground) hover:bg-(--color-muted)'
  }`;

export default function Header({ variant = 'public', onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false); 

  return (
    <header className="sticky top-0 z-40 w-full border-b border-(--color-border) bg-card/95 backdrop-blur-sm">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3 max-w-[1600px] mx-auto">
        
        {/* Left Side: Hamburger (Dashboard Mobile) + Logo */}
        <div className="flex items-center gap-3 min-w-0">
          {variant === 'dashboard' && (
            <button
              onClick={onMenuClick}
              aria-label="Open menu"
              className="md:hidden p-2 -ml-2 rounded-(--radius-md) text-(--color-muted-foreground) hover:bg-(--color-muted) transition-colors"
            >
              <Menu size={20} />
            </button>
          )}

          <Link to="/" className="text-xl font-bold text-(--color-primary) shrink-0 tracking-tight">
            ServiceHub
          </Link>

          {variant === 'public' && (
            <nav className="hidden md:flex items-center gap-1 ml-4 border-l border-(--color-border) pl-4">
              <NavLink to="/services" className={publicNavLinkClass}>
                Browse Services
              </NavLink>
            </nav>
          )}
        </div>

        {/* Right Side: Theme, Notifications, Auth */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-(--radius-md) text-(--color-muted-foreground) hover:bg-(--color-muted) transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user && (
            <button
              aria-label="Notifications"
              className="p-2 rounded-(--radius-md) text-(--color-muted-foreground) hover:bg-(--color-muted) transition-colors relative"
            >
              <Bell size={18} />
            </button>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 pl-2 pr-1 py-1.5 rounded-(--radius-md) hover:bg-(--color-muted) transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center text-sm font-semibold shrink-0">
                  {user?.email?.[0]?.toUpperCase() || '?'}
                </div>
                <ChevronDown size={14} className="hidden sm:block text-(--color-muted-foreground)" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-(--radius-md) border border-(--color-border) bg-(--color-card) shadow-elevated py-1 z-40">
                    <div className="px-4 py-3 text-sm border-b border-(--color-border)">
                      <p className="font-medium text-(--color-foreground) truncate">{user?.full_name || 'User'}</p>
                      <p className="text-(--color-muted-foreground) truncate">{user?.email}</p>
                    </div>
                    {variant === 'public' && (
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-(--color-foreground) hover:bg-(--color-muted) transition-colors mt-1"
                      >
                        Go to Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-(--color-foreground) hover:bg-(--color-muted) transition-colors"
                    >
                      <UserIcon size={16} /> My Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-(--color-destructive) hover:bg-(--color-destructive)/10 transition-colors mt-1 border-t border-(--color-border)"
                    >
                      <LogOut size={16} /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-(--radius-md) text-sm font-medium text-(--color-foreground) hover:bg-(--color-muted) transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-(--radius-md) text-sm font-medium bg-(--color-primary) text-(--color-primary-foreground) hover:opacity-95 transition-opacity shadow-soft"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Nav Toggle (Public Only) */}
          {variant === 'public' && (
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="sm:hidden p-2 rounded-(--radius-md) text-(--color-muted-foreground) hover:bg-(--color-muted) transition-colors"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Drawer (Public) */}
      {variant === 'public' && mobileNavOpen && (
        <div className="sm:hidden border-t border-(--color-border) bg-(--color-card) px-4 py-4 space-y-2 shadow-elevated">
          <NavLink to="/services" onClick={() => setMobileNavOpen(false)} className={publicNavLinkClass + " block"}>
            Browse Services
          </NavLink>

          {user ? (
            <NavLink to="/dashboard" onClick={() => setMobileNavOpen(false)} className={publicNavLinkClass + " block"}>
              Go to Dashboard
            </NavLink>
          ) : (
            <div className="flex flex-col gap-2 pt-4 border-t border-(--color-border)">
              <Link to="/login" onClick={() => setMobileNavOpen(false)} className="w-full text-center px-4 py-2.5 rounded-(--radius-md) text-sm font-medium text-(--color-foreground) border border-(--color-border)">
                Log in
              </Link>
              <Link to="/register" onClick={() => setMobileNavOpen(false)} className="w-full text-center px-4 py-2.5 rounded-(--radius-md) text-sm font-medium bg-(--color-primary) text-(--color-primary-foreground)">
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}