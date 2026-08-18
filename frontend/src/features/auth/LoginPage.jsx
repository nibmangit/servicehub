import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-background)] transition-colors duration-300"> 

      <div className="w-full max-w-md bg-[var(--color-card)] p-8 rounded-[var(--radius-2xl)] shadow-elevated border border-[var(--color-border)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Welcome Back</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-2">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]"> Email </label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full mt-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] py-2.5 rounded-[var(--radius-md)] font-medium hover:opacity-95 transition-all cursor-pointer shadow-soft disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--color-muted-foreground)] mt-6">
          Don't have an account? <Link to="/register" className="text-[var(--color-primary)] font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}