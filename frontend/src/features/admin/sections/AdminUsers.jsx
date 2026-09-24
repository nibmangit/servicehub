import React, { useState } from 'react';
import { Users as UsersIcon, ShieldCheck, ShieldOff, Shield } from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { useAuth } from '../../../context/AuthContext';
import { usePaginatedResource } from '../../../lib/usePaginatedResource';
import AdminModal from '../../../components/admin/AdminModal';
import LoadMoreButton from '../../../components/common/LoadMoreButton';
import EmptyState from '../../../components/common/EmptyState';

const FILTERS = [
  { key: '', label: 'All' },
  { key: 'customer', label: 'Customers' },
  { key: 'provider', label: 'Providers' },
  { key: 'staff', label: 'Staff' },
  { key: 'inactive', label: 'Banned' },
];

function filterToParams(filterKey) {
  if (filterKey === 'customer') return { is_provider: 'false' };
  if (filterKey === 'provider') return { is_provider: 'true' };
  if (filterKey === 'staff') return { is_staff: 'true' };
  if (filterKey === 'inactive') return { is_active: 'false' };
  return {};
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const { items, count, hasMore, loading, loadingMore, loadMore, goToPage } =
    usePaginatedResource(adminApi.getUsers, { ...filterToParams(filter), search: search || undefined });

  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const openUser = (u) => {
    setSelected(u);
    setActionError('');
  };

  const closeModal = () => {
    if (actionLoading) return;
    setSelected(null);
  };

  const applyFlags = async (flags) => {
    setActionLoading(true);
    setActionError('');
    try {
      const updated = await adminApi.updateUserFlags(selected.id, flags);
      setSelected(updated);
      goToPage(1);
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Could not update this user.');
    } finally {
      setActionLoading(false);
    }
  };

  const isSelf = selected && currentUser && selected.id === currentUser.id;
  const canManageStaff = currentUser?.is_superuser;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 p-1 bg-(--color-muted) rounded-lg border border-(--color-border) w-fit overflow-x-auto">
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
          placeholder="Search by email..."
          className="px-3.5 py-2.5 rounded-lg bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring) w-full sm:w-64"
        />
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) p-12 shadow-soft">
          <EmptyState message="No users match this filter." />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {items.map((u) => (
              <button
                key={u.id}
                onClick={() => openUser(u)}
                className="flex items-center justify-between gap-4 p-4 rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) hover:border-(--color-primary)/50 transition-colors text-left cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-(--color-foreground) truncate">
                      {u.full_name || u.email}
                    </p>
                    {u.is_staff && <Shield size={13} className="text-(--color-primary) shrink-0" />}
                  </div>
                  <p className="text-xs text-(--color-muted-foreground) mt-0.5 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {!u.is_active && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-(--color-destructive)/15 text-(--color-destructive)">
                      Banned
                    </span>
                  )}
                  {u.is_provider && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-(--color-primary-soft) text-(--color-primary)">
                      Provider
                    </span>
                  )}
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
        title={selected?.full_name || selected?.email}
        subtitle={selected?.email}
        footer={
          selected && !isSelf ? (
            <>
              {canManageStaff && (
                <button
                  onClick={() => applyFlags({ is_staff: !selected.is_staff })}
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl bg-(--color-muted) border border-(--color-border) text-(--color-foreground) text-xs font-semibold hover:bg-(--color-muted-foreground)/10 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {selected.is_staff ? 'Revoke Staff' : 'Grant Staff'}
                </button>
              )}
              <button
                onClick={() => applyFlags({ is_active: !selected.is_active })}
                disabled={actionLoading}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-soft transition-all disabled:opacity-50 cursor-pointer ${
                  selected.is_active
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-(--color-primary) text-(--color-primary-foreground) hover:opacity-90'
                }`}
              >
                {actionLoading ? 'Saving...' : selected.is_active ? 'Ban User' : 'Unban User'}
              </button>
            </>
          ) : null
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${selected.is_active ? 'bg-emerald-500/15 text-emerald-500' : 'bg-(--color-destructive)/15 text-(--color-destructive)'}`}>
                {selected.is_active ? 'Active' : 'Banned'}
              </span>
              {selected.is_staff && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-(--color-primary-soft) text-(--color-primary)">Staff</span>
              )}
              {selected.is_superuser && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-(--color-accent-soft) text-(--color-accent)">Superuser</span>
              )}
              {selected.is_provider && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-(--color-muted) text-(--color-foreground)">Provider</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {selected.phone && (
                <div>
                  <p className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Phone</p>
                  <p className="text-(--color-foreground)">{selected.phone}</p>
                </div>
              )}
              {selected.city && (
                <div>
                  <p className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">City</p>
                  <p className="text-(--color-foreground)">{selected.city}</p>
                </div>
              )}
              {selected.provider_status && (
                <div>
                  <p className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Provider Application</p>
                  <p className="text-(--color-foreground) capitalize">{selected.provider_status}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-0.5">Joined</p>
                <p className="text-(--color-foreground)">{new Date(selected.date_joined).toLocaleDateString()}</p>
              </div>
            </div>

            {isSelf && (
              <p className="text-xs text-(--color-muted-foreground) italic">You can't modify your own account here.</p>
            )}
            {!isSelf && selected.is_superuser && !canManageStaff && (
              <p className="text-xs text-(--color-muted-foreground) italic">Only a superuser can modify another superuser's account.</p>
            )}

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