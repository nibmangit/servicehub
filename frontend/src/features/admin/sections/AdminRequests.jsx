import React, { useState } from 'react';
import { Star, Calendar, MapPin } from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { usePaginatedResource } from '../../../lib/usePaginatedResource';
import AdminModal from '../../../components/admin/AdminModal';
import LoadMoreButton from '../../../components/common/LoadMoreButton';
import EmptyState from '../../../components/common/EmptyState';

const STATUS_FILTERS = [
  { key: '', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

export default function AdminRequests() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { items, count, hasMore, loading, loadingMore, loadMore } =
    usePaginatedResource(adminApi.getRequests, {
      status: status || undefined,
      search: search || undefined,
    });

  const [selected, setSelected] = useState(null);

  const getStatusBadge = (st) => {
    switch (st) {
      case 'COMPLETED':
        return 'bg-emerald-500/15 text-emerald-500';
      case 'PENDING':
        return 'bg-(--color-warning)/15 text-(--color-warning)';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-(--color-destructive)/15 text-(--color-destructive)';
      default:
        return 'bg-(--color-primary-soft) text-(--color-primary)';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 p-1 bg-(--color-muted) rounded-lg border border-(--color-border) w-fit overflow-x-auto">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatus(f.key)}
              className={`shrink-0 px-3.5 py-2 text-xs font-semibold rounded-(--radius-md) transition-all cursor-pointer ${
                status === f.key
                  ? 'bg-(--color-primary) text-(--color-primary-foreground) shadow-soft'
                  : 'text-(--color-muted-foreground) hover:text-(--color-foreground)'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search requests..."
          className="px-3.5 py-2.5 rounded-lg bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring) w-full sm:w-64"
        />
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) p-12 shadow-soft">
          <EmptyState message="No requests found matching this criteria." />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="flex flex-col justify-between gap-3 p-4 rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) hover:border-(--color-primary)/50 transition-colors text-left cursor-pointer h-full"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-(--color-foreground) truncate">
                      {r.service_title}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${getStatusBadge(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-xs text-(--color-muted-foreground) truncate">
                    <span className="truncate">Customer: <strong className="text-(--color-foreground)">{r.customer_email}</strong></span>
                    <span className="truncate">Provider: <strong className="text-(--color-foreground)">{r.provider_name}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-(--color-border)/60 text-xs shrink-0">
                  <p className="font-semibold text-(--color-primary)">
                    {r.agreed_price != null ? `${Number(r.agreed_price).toLocaleString()} ETB` : 'N/A'}
                  </p>
                  <p className="text-(--color-muted-foreground)">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </button>
            ))}
          </div>

          <LoadMoreButton
            hasMore={hasMore}
            loadingMore={loadingMore}
            onClick={loadMore}
            loadedCount={items.length}
            totalCount={count}
          />
        </>
      )}

      <AdminModal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.service_title}
        subtitle={`Request #${selected?.id}`}
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-(--color-muted) border border-(--color-border)">
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-1">Customer</p>
                <p className="font-semibold text-(--color-foreground)">{selected.customer_email}</p>
                <p className="text-(--color-muted-foreground)">ID: {selected.customer}</p>
              </div>
              <div className="p-3 rounded-lg bg-(--color-muted) border border-(--color-border)">
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-1">Provider</p>
                <p className="font-semibold text-(--color-foreground)">{selected.provider_name}</p>
                <p className="text-(--color-muted-foreground)">{selected.provider_email}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-1">Description / Notes</p>
              <p className="text-(--color-foreground) bg-(--color-input) p-3 rounded-lg border border-(--color-border) text-xs">
                {selected.description || 'No additional details provided.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Address</p>
                <p className="text-(--color-foreground) flex items-center gap-1">
                  <MapPin size={12} /> {selected.address || 'N/A'}
                </p>
              </div>
              <div>
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Preferred Date</p>
                <p className="text-(--color-foreground) flex items-center gap-1">
                  <Calendar size={12} /> {new Date(selected.preferred_date).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Agreed Price</p>
                <p className="text-(--color-foreground) font-semibold">
                  {selected.agreed_price != null ? `${Number(selected.agreed_price).toLocaleString()} ETB` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Status</p>
                <p className="text-(--color-foreground) capitalize font-semibold">{selected.status}</p>
              </div>
            </div>

            {selected.status === 'REJECTED' && selected.rejection_reason && (
              <div className="p-3 rounded-lg bg-(--color-destructive)/10 border border-(--color-destructive)/20 text-xs space-y-1">
                <p className="font-semibold text-(--color-destructive) uppercase tracking-wider">Rejection Reason</p>
                <p className="text-(--color-foreground)">{selected.rejection_reason}</p>
              </div>
            )}

            {selected.review && (
              <div className="p-3 rounded-lg bg-(--color-warning)/10 border border-(--color-warning)/20 text-xs space-y-1">
                <div className="flex items-center gap-1 font-semibold text-(--color-warning)">
                  <Star size={12} className="fill-current" />
                  Attached Review ({selected.review.rating}/5)
                </div>
                {selected.review.comment && (
                  <p className="text-(--color-foreground) italic">"{selected.review.comment}"</p>
                )}
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
}