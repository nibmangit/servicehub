import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-(--color-foreground)">
        Welcome, {user?.full_name || user?.email}
      </h1>
      <p className="text-(--color-muted-foreground) mt-1">
        Real dashboard content lands in step 6.
      </p>
    </div>
  );
}