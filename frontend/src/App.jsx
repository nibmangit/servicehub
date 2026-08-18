import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// A quick test component to see our theme in action
function ThemeTest() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-[var(--color-card)] p-8 rounded-[var(--radius-xl)] shadow-elevated border border-[var(--color-border)] max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">ServiceHub</h1>
        <p className="text-[var(--color-muted-foreground)] mb-6">
          Your theme context is successfully connected!
        </p>
        
        <button 
          onClick={toggleTheme}
          className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-6 py-2 rounded-[var(--radius-md)] font-medium hover:bg-opacity-90 transition-all cursor-pointer shadow-soft"
        >
          Toggle to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemeTest />
    </ThemeProvider>
  );
}

export default App;