import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
 
import ProviderDashboard from './ProviderDashboard';
import CustomerDashboard from './CustomerDashboard';
import { dashboardApi } from '../../services/dasboardApi';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError('');
      try {
        const result = await dashboardApi.getDashboard();
        console.log(result);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError('Could not load your dashboard. Please try refreshing.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="p-4 rounded-(--radius-md) bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
          {error}
        </div>
      </div>
    );
  }
 
  const isProvider = 'performance' in data;

  return (
    <div className=" mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-(--color-foreground)">
          Welcome back, {user?.full_name || user?.email}
        </h1>
        <p className="text-(--color-muted-foreground) mt-1">
          {isProvider ? "Here's how your services are doing." : "Here's what's happening with your requests."}
        </p>
      </div>

      {isProvider ? (
        <ProviderDashboard data={data} />
      ) : (
        <CustomerDashboard data={data} />
      )}
    </div>
  );
}