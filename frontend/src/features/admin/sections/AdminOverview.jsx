import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../services/adminApi';
import { Users, Wrench, ClipboardList, Star, Briefcase, FileCheck } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="p-5 rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) shadow-soft space-y-1">
      <div className="flex items-center gap-2 text-(--color-muted-foreground)">
        <Icon size={16} />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-(--color-foreground)">{value}</p>
      {sub && <p className="text-xs text-(--color-muted-foreground)">{sub}</p>}
    </div>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminApi.getStats()
      .then((data) => { if (!cancelled) setStats(data); })
      .catch(() => { if (!cancelled) setError('Could not load platform stats.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-4 rounded-lg bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        icon={Users}
        label="Users"
        value={stats.users.total}
        sub={`${stats.users.providers} providers · ${stats.users.customers} customers`}
      />
      <StatCard
        icon={FileCheck}
        label="Provider Applications"
        value={stats.provider_applications.pending}
        sub={`${stats.provider_applications.approved} approved · ${stats.provider_applications.rejected} rejected`}
      />
      <StatCard
        icon={Wrench}
        label="Services"
        value={stats.services.active}
        sub={`${stats.services.total} total listed`}
      />
      <StatCard
        icon={ClipboardList}
        label="Requests"
        value={stats.requests.total}
        sub={`${stats.requests.pending} pending · ${stats.requests.completed} completed`}
      />
      <StatCard
        icon={Star}
        label="Reviews"
        value={stats.reviews.total}
        sub={`${stats.reviews.avg_rating.toFixed(1)} average rating`}
      />
      <StatCard
        icon={Briefcase}
        label="Jobs Completed"
        value={stats.jobs_completed}
      />
    </div>
  );
}