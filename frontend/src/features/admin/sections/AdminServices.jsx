import React, { useState } from 'react';
import { Eye, EyeOff, Trash2, Star, MapPin, Tag } from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { usePaginatedResource } from '../../../lib/usePaginatedResource';
import AdminModal from '../../../components/admin/AdminModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import LoadMoreButton from '../../../components/common/LoadMoreButton';
import EmptyState from '../../../components/common/EmptyState';

const FILTERS = [
  { key: '', label: 'All' },
  { key: 'true', label: 'Active' },
  { key: 'false', label: 'Inactive' },
];

export default function AdminServices() {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const { items, count, hasMore, loading, loadingMore, loadMore, goToPage } =
    usePaginatedResource(adminApi.getServices, {
      is_active: filter || undefined,
      search: search || undefined,
    });

  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const [deleting, setDeleting] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openService = (service) => {
    setSelected(service);
    setActionError('');
  };

  const closeModal = () => {
    if (actionLoading) return;
    setSelected(null);
  };

  const toggleActive = async () => {
    if (!selected) return;
    setActionLoading(true);
    setActionError('');
    try {
      const updated = await adminApi.updateService(selected.id, { is_active: !selected.is_active });
      setSelected(updated);
      goToPage(1);
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Could not update service status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await adminApi.deleteService(deleting.id);
      setDeleting(null);
      setSelected(null);
      goToPage(1);
    } catch {
      alert('Could not delete this service. It may have requests tied to it.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 p-1 bg-(--color-muted) rounded-lg border border-(--color-border) w-fit">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 px-3.5 py-2 text-xs font-semibold rounded-(--radius-md) transition-all cursor-pointer ${
                filter === f.key
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
          placeholder="Search services..."
          className="px-3.5 py-2.5 rounded-lg bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring) w-full sm:w-64"
        />
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) p-12 shadow-soft">
          <EmptyState message="No services match this filter." />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((s) => (
              <button
                key={s.id}
                onClick={() => openService(s)}
                className="flex flex-col justify-between p-4 rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) hover:border-(--color-primary)/50 transition-colors text-left cursor-pointer gap-3"
              >
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-(--color-primary) uppercase tracking-wider truncate">
                      {s.category_detail?.name || 'Service'}
                    </span>
                    <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${s.is_active ? 'bg-emerald-500/15 text-emerald-500' : 'bg-(--color-destructive)/15 text-(--color-destructive)'}`}>
                      {s.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-(--color-foreground) truncate">{s.title}</h3>
                  <p className="text-xs text-(--color-muted-foreground) line-clamp-2">{s.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-(--color-muted-foreground) pt-2 border-t border-(--color-border)/50 w-full">
                  <div className="flex items-center gap-2 truncate">
                    {s.provider_avatar && (
                      <img src={s.provider_avatar} alt="" className="h-5 w-5 rounded-full object-cover shrink-0" />
                    )}
                    <span className="truncate">{s.provider_name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-(--color-foreground)">
                      {s.price_type === 'negotiable' ? 'Negotiable' : `$${s.price}`}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-amber-500">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      {s.average_rating}
                    </span>
                  </div>
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
        onClose={closeModal}
        title={selected?.title}
        subtitle={selected?.category_detail?.name ? `Category: ${selected.category_detail.name}` : undefined}
        footer={
          selected ? (
            <div className="flex items-center gap-2 w-full justify-end">
              <button
                onClick={() => setDeleting(selected)}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-(--color-destructive)/15 text-(--color-destructive) text-xs font-semibold hover:bg-(--color-destructive)/20 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete
              </button>
              <button
                onClick={toggleActive}
                disabled={actionLoading}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold shadow-soft transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 ${
                  selected.is_active
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-(--color-primary) text-(--color-primary-foreground) hover:opacity-90'
                }`}
              >
                {selected.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                {actionLoading ? 'Saving...' : selected.is_active ? 'Hide Service' : 'Un-hide Service'}
              </button>
            </div>
          ) : null
        }
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-(--color-muted) border border-(--color-border)">
              {selected.provider_avatar && (
                <img src={selected.provider_avatar} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" />
              )}
              <div>
                <p className="text-xs text-(--color-muted-foreground)">Provider</p>
                <p className="font-semibold text-(--color-foreground)">{selected.provider_name}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-1">Description</p>
              <p className="text-(--color-foreground) bg-(--color-input) p-3 rounded-lg border border-(--color-border) text-xs leading-relaxed">
                {selected.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Location</p>
                <p className="text-(--color-foreground) flex items-center gap-1">
                  <MapPin size={12} /> {selected.location || 'N/A'}
                </p>
              </div>
              <div>
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Pricing</p>
                <p className="text-(--color-foreground) capitalize font-semibold">
                  {selected.price_type} {selected.price ? `($${selected.price})` : ''}
                </p>
              </div>
              <div>
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Duration</p>
                <p className="text-(--color-foreground)">{selected.duration || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Rating</p>
                <p className="text-(--color-foreground) flex items-center gap-1 font-semibold">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {selected.average_rating} ({selected.review_count} reviews)
                </p>
              </div>
            </div>

            {selected.images && selected.images.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-2">Service Images</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selected.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.image}
                      alt=""
                      className="h-20 w-20 object-cover rounded-lg border border-(--color-border) shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}

            {actionError && (
              <div className="p-3 rounded-lg bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
                {actionError}
              </div>
            )}
          </div>
        )}
      </AdminModal>

      <DeleteConfirmModal
        isOpen={Boolean(deleting)}
        title={`Delete "${deleting?.title}"?`}
        message="Any existing requests tied to this service will keep their history, but the service link will be cleared (agreed price and description on past requests are unaffected)."
        onClose={() => !isDeleting && setDeleting(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
      />
    </div>
  );
}