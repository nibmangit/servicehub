import React, { useState } from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { usePaginatedResource } from '../../../lib/usePaginatedResource';
import AdminModal from '../../../components/admin/AdminModal';
import LoadMoreButton from '../../../components/common/LoadMoreButton';
import EmptyState from '../../../components/common/EmptyState';

const STATUS_FILTERS = [
  { key: '', label: 'All' },
  { key: 'verified', label: 'Verified' },
  { key: 'pending', label: 'Pending' },
  { key: 'failed', label: 'Failed' },
];

export default function AdminIdentityVerifications() {
  const [status, setStatus] = useState('');

  const { items, count, hasMore, loading, loadingMore, loadMore } =
    usePaginatedResource(adminApi.getIdentityVerifications, {
      status: status || undefined,
    });

  const [selected, setSelected] = useState(null);

  const getStatusBadge = (st) => {
    switch (st) {
      case 'verified':
        return 'bg-emerald-500/15 text-emerald-500';
      case 'pending':
        return 'bg-(--color-warning)/15 text-(--color-warning)';
      case 'failed':
        return 'bg-(--color-destructive)/15 text-(--color-destructive)';
      default:
        return 'bg-(--color-muted) text-(--color-foreground)';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-1 bg-(--color-muted) rounded-lg border border-(--color-border) w-fit">
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

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) p-12 shadow-soft">
          <EmptyState message="No identity verifications found." />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="flex flex-col justify-between gap-3 p-4 rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) hover:border-(--color-primary)/50 transition-colors text-left cursor-pointer h-full"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-(--color-foreground) truncate">
                      {item.citizen_name || item.user_email || 'Unknown'}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize shrink-0 ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-xs text-(--color-muted-foreground) truncate">
                    <span className="truncate">Account: <strong className="text-(--color-foreground)">{item.user_email}</strong></span>
                    <span className="truncate">FIN: <strong className="text-(--color-foreground)">{item.fin}</strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-(--color-border)/60 text-xs text-right text-(--color-muted-foreground) shrink-0">
                  {new Date(item.created_at).toLocaleDateString()}
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
        title={selected?.citizen_name || 'Unmatched FIN'}
        subtitle={`FIN: ${selected?.fin}`}
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="p-3 rounded-lg bg-(--color-muted) border border-(--color-border) text-xs">
              <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Account</p>
              <p className="font-semibold text-(--color-foreground) flex items-center gap-1">
                <Mail size={12} /> {selected.user_email}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-(--color-muted) border border-(--color-border)">
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Verification System</p>
                <p className="font-semibold uppercase text-(--color-foreground)">{selected.provider}</p>
              </div>
              <div className="p-3 rounded-lg bg-(--color-muted) border border-(--color-border)">
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Status</p>
                <p className="font-semibold capitalize text-(--color-foreground)">{selected.status}</p>
              </div>
            </div>

            {selected.status === 'failed' ? (
              <p className="text-xs text-(--color-muted-foreground) italic">
                No matching Fayda citizen record was found for this FIN — verification failed.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Phone</p>
                  <p className="text-(--color-foreground) flex items-center gap-1">
                    <Phone size={12} /> {selected.citizen_phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">City</p>
                  <p className="text-(--color-foreground) flex items-center gap-1">
                    <MapPin size={12} /> {selected.citizen_city || 'N/A'}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Verified At</p>
                <p className="text-(--color-foreground)">
                  {selected.verified_at ? new Date(selected.verified_at).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Created At</p>
                <p className="text-(--color-foreground)">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}