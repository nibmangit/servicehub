import React, { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { usePaginatedResource } from '../../../lib/usePaginatedResource';
import AdminModal from '../../../components/admin/AdminModal';
import LoadMoreButton from '../../../components/common/LoadMoreButton';
import EmptyState from '../../../components/common/EmptyState';

export default function AdminReviews() {
  const [search, setSearch] = useState('');

  const { items, count, hasMore, loading, loadingMore, loadMore, goToPage } =
    usePaginatedResource(adminApi.getReviews, { search: search || undefined });

  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const openReview = (rev) => {
    setSelected(rev);
    setActionError('');
  };

  const handleDelete = async () => {
    if (!selected || !window.confirm('Delete this review permanently?')) return;
    setActionLoading(true);
    setActionError('');
    try {
      await adminApi.deleteReview(selected.id);
      setSelected(null);
      goToPage(1);
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Could not delete review.');
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reviews..."
          className="px-3.5 py-2.5 rounded-lg bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring) w-full sm:w-64"
        />
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) p-12 shadow-soft">
          <EmptyState message="No reviews found." />
        </div>
      ) : (
        <>
          {/* Responsive Grid layout for reviews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((rev) => (
              <button
                key={rev.id}
                onClick={() => openReview(rev)}
                className="flex flex-col justify-between gap-3 p-4 rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) hover:border-(--color-primary)/50 transition-colors text-left cursor-pointer h-full"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-(--color-muted-foreground)/30'}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-(--color-foreground) truncate">
                      {rev.service_title}
                    </span>
                  </div>
                  <p className="text-xs text-(--color-muted-foreground) line-clamp-2">
                    {rev.comment ? `"${rev.comment}"` : <span className="italic">No comment text</span>}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-(--color-border)/60 text-[11px] text-(--color-muted-foreground) shrink-0 truncate">
                  <span className="truncate">Client: <strong className="text-(--color-foreground)">{rev.client_name}</strong></span>
                  <span>•</span>
                  <span className="truncate">Provider: <strong className="text-(--color-foreground)">{rev.provider_name}</strong></span>
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
        subtitle={`Review #${selected?.id}`}
        footer={
          selected ? (
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="px-4 py-2.5 rounded-xl bg-(--color-destructive) text-white text-xs font-semibold hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              {actionLoading ? 'Deleting...' : 'Delete Review'}
            </button>
          ) : null
        }
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < selected.rating ? 'fill-amber-400 text-amber-400' : 'text-(--color-muted-foreground)/30'}
                />
              ))}
              <span className="ml-2 text-xs font-semibold text-(--color-foreground)">{selected.rating} out of 5</span>
            </div>

            <div>
              <p className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-1">Comment</p>
              <p className="text-(--color-foreground) bg-(--color-input) p-3 rounded-lg border border-(--color-border) text-xs">
                {selected.comment || 'No text content provided.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Client</p>
                <p className="text-(--color-foreground)">{selected.client_name}</p>
              </div>
              <div>
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Provider</p>
                <p className="text-(--color-foreground)">{selected.provider_name}</p>
              </div>
              <div>
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Submitted</p>
                <p className="text-(--color-foreground)">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
            </div>

            {actionError && (
              <div className="p-3 rounded-lg bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
                {actionError}
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
}