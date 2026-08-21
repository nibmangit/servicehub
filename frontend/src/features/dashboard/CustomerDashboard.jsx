import { Link } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, XCircle, MessageSquare, Search, ArrowRight } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../lib/format';

export default function CustomerDashboard({ data }) {
  const { summary, recent_requests, recent_conversations, unread_notifications, unread_messages } = data;

  return (
    <div className="space-y-6">
      {/* Top Notification Alerts */}
      {(unread_notifications > 0 || unread_messages > 0) && (
        <div className="flex flex-wrap gap-3">
          {unread_notifications > 0 && (
            <Link to="/notifications" className="text-sm px-4 py-2 rounded-(--radius-md) bg-(--color-primary-soft) text-(--color-primary) font-medium hover:underline">
              {unread_notifications} unread notification{unread_notifications !== 1 ? 's' : ''}
            </Link>
          )}
          {unread_messages > 0 && (
            <Link to="/messages" className="text-sm px-4 py-2 rounded-(--radius-md) bg-(--color-primary-soft) text-(--color-primary) font-medium hover:underline">
              {unread_messages} unread message{unread_messages !== 1 ? 's' : ''}
            </Link>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={summary.total_requests} icon={ClipboardList} />
        <StatCard label="Active" value={summary.active_requests} icon={Clock} />
        <StatCard label="Completed" value={summary.completed_requests} icon={CheckCircle2} />
        <StatCard label="Cancelled" value={summary.cancelled_requests} icon={XCircle} />
      </div>

      {/* Quick Action Banner if no requests */}
      {summary.total_requests === 0 && (
        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-lg) p-6 text-center space-y-3 shadow-soft">
          <h3 className="text-lg font-bold text-(--color-foreground)">Looking for a service provider?</h3>
          <p className="text-sm text-(--color-muted-foreground)">Browse verified local service professionals and book your first request today.</p>
          <Link to="/services" className="inline-flex items-center gap-2 px-4 py-2.5 bg-(--color-primary) text-(--color-primary-foreground) rounded-(--radius-md) text-sm font-medium hover:opacity-90">
            <Search size={16} /> Browse Services <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Lists Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-(--color-card) border border-(--color-border) rounded-(--radius-lg) shadow-soft">
          <div className="px-5 py-4 border-b border-(--color-border) flex items-center justify-between">
            <h2 className="font-semibold text-(--color-foreground)">Recent Requests</h2>
            <Link to="/requests" className="text-sm text-(--color-primary) hover:underline">View all</Link>
          </div>
          {recent_requests.length === 0 ? (
            <EmptyState message="No requests yet." />
          ) : (
            <ul className="divide-y divide-(--color-border)">
              {recent_requests.map((r) => (
                <li key={r.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-(--color-foreground) truncate">{r.service__title}</p>
                    <p className="text-xs text-(--color-muted-foreground) truncate">
                      with {r.provider__user__email} · {formatDateTime(r.updated_at)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-(--color-card) border border-(--color-border) rounded-(--radius-lg) shadow-soft">
          <div className="px-5 py-4 border-b border-(--color-border) flex items-center justify-between">
            <h2 className="font-semibold text-(--color-foreground) flex items-center gap-2">
              <MessageSquare size={16} /> Recent Conversations
            </h2>
            <Link to="/messages" className="text-sm text-(--color-primary) hover:underline">Open chat</Link>
          </div>
          {recent_conversations.length === 0 ? (
            <EmptyState message="No conversations yet." />
          ) : (
            <ul className="divide-y divide-(--color-border)">
              {recent_conversations.map((c) => (
                <Link key={c.id} to={`/messages/${c.id}`} className="block hover:bg-(--color-muted)/50 transition-colors">
                  <li className="px-5 py-3.5">
                    <p className="text-sm font-medium text-(--color-foreground) truncate">{c.request__service__title}</p>
                    <p className="text-xs text-(--color-muted-foreground)">Last active: {formatDateTime(c.updated_at)}</p>
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