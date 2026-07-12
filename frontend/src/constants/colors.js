// src/constants/colors.js

export const colors = {
  light: {
    primary: '#1E40AF',     // Deep Blue
    accent: '#10B981',      // Green
    success: '#10B981',     // Green
    warning: '#F97316',     // Orange
    danger: '#EF4444',      // Red
    background: '#F8FAFC',  // Very light gray
    card: '#FFFFFF',        // Pure White
    text: {
      primary: '#0F172A',   // Slate 900
      secondary: '#475569', // Slate 600
      muted: '#94A3B8',     // Slate 400
    },
    border: '#E2E8F0',      // Slate 200
  },
  dark: {
    primary: '#3B82F6',     // Vibrant Blue for Dark Mode readability
    accent: '#10B981',      // Green
    success: '#10B981',     // Green
    warning: '#FB923C',     // Lighter Orange
    danger: '#F87171',      // Lighter Red
    background: '#0F172A',  // Slate 900
    card: '#1E293B',        // Slate 800
    text: {
      primary: '#F8FAFC',   // Slate 50
      secondary: '#CBD5E1', // Slate 300
      muted: '#64748B',     // Slate 500
    },
    border: '#334155',      // Slate 700
  }
};

export const requestStatusColors = {
  PENDING: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-900/50' },
  ACCEPTED: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-900/50' },
  IN_PROGRESS: { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-900/50' },
  COMPLETED: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900/50' },
  CANCELLED: { bg: 'bg-slate-50 dark:bg-slate-800/50', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' },
  REJECTED: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-900/50' },
};