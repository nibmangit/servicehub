import { Link } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, Star, Wrench, PlusCircle } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime, formatDate } from '../../lib/format';

export default function ProviderDashboard({ data }) {
  const { summary, performance, recent_requests, recent_reviews } = data;

  return (
    <div className="space-y-6">
      {/* Top Action & Rating Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-(--color-card) border border-(--color-border) rounded-(--radius-lg) shadow-soft p-5">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Star size={22} className="text-(--color-warning) fill-(--color-warning)" />
            <span className="text-2xl font-bold text-(--color-foreground)">{performance.rating.toFixed(1)}</span>
            <span className="text-sm text-(--color-muted-foreground)">rating</span>
          </div>
          <div className="text-sm text-(--color-muted-foreground) border-l border-(--color-border) pl-6">
            {performance.total_reviews} customer review{performance.total_reviews !== 1 ? 's' : ''} · Avg: {performance.avg_rating.toFixed(1)}
          </div>
        </div>
        <Link to="/my-services/new" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-(--color-primary) text-(--color-primary-foreground) rounded-(--radius-md) text-sm font-medium hover:opacity-90">
          <PlusCircle size={16} /> Add New Service
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Services" value={summary.total_services} icon={Wrench} />
        <StatCard label="Total Requests" value={summary.total_requests} icon={ClipboardList} />
        <StatCard label="Pending" value={summary.pending_requests} icon={Clock} />
        <StatCard label="Active Jobs" value={summary.active_requests} icon={ClipboardList} />
        <StatCard label="Completed" value={summary.completed_requests} icon={CheckCircle2} />
        <StatCard label="Cancelled" value={summary.cancelled_requests} icon={Clock} />
      </div>

      {/* Lists Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-(--color-card) border border-(--color-border) rounded-(--radius-lg) shadow-soft">
          <div className="px-5 py-4 border-b border-(--color-border) flex items-center justify-between">
            <h2 className="font-semibold text-(--color-foreground)">Recent Requests</h2>
            <Link to="/requests" className="text-sm text-(--color-primary) hover:underline">View all</Link>
          </div>
          {recent_requests.length === 0 ? (
            <EmptyState message="No requests received yet." />
          ) : (
            <ul className="divide-y divide-(--color-border)">
              {recent_requests.map((r) => (
                <Link to={`/requests/${r.id}`} >
                <li key={r.id} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-muted/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-(--color-foreground) truncate">{r.service__title}</p>
                    <p className="text-xs text-(--color-muted-foreground) truncate">
                      from {r.customer__email} · {formatDateTime(r.updated_at)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </li>
                </Link>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-(--color-card) border border-(--color-border) rounded-(--radius-lg) shadow-soft">
          <div className="px-5 py-4 border-b border-(--color-border)">
            <h2 className="font-semibold text-(--color-foreground)">Recent Reviews</h2>
          </div>
          {recent_reviews.length === 0 ? (
            <EmptyState message="No reviews received yet." />
          ) : (
            <ul className="divide-y divide-(--color-border)">
              {recent_reviews.map((r, i) => (
                <Link to={`/reviews/${r.id}`} >
                <li key={i} className="px-5 py-3.5 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={13}
                        className={idx < r.rating ? 'text-(--color-warning) fill-(--color-warning)' : 'text-(--color-border)'}
                      />
                    ))}
                  </div>
                  {r.comment && <p className="text-sm text-(--color-foreground) mb-1">{r.comment}</p>}
                  <p className="text-xs text-(--color-muted-foreground)">
                    {r.request__customer__email} · {formatDate(r.created_at)}
                  </p>
                </li>
                </Link>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}