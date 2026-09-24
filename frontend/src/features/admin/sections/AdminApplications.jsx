import React, { useState } from 'react';
import { FileCheck } from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { usePaginatedResource } from '../../../lib/usePaginatedResource';
import AdminModal from '../../../components/admin/AdminModal';
import AdminStatusBadge from '../../../components/admin/AdminStatusBadge';
import LoadMoreButton from '../../../components/common/LoadMoreButton';
import EmptyState from '../../../components/common/EmptyState';

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export default function AdminApplications() {
  const [tab, setTab] = useState('pending');
  const { items, count, hasMore, loading, loadingMore, loadMore, goToPage } =
    usePaginatedResource(adminApi.getApplications, { status: tab });

  const [selected, setSelected] = useState(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const openApplication = (app) => {
    setSelected(app);
    setShowRejectForm(false);
    setReason('');
    setActionError('');
  };

  const closeModal = () => {
    if (actionLoading) return;
    setSelected(null);
  };

  const handleApprove = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      await adminApi.approveApplication(selected.id);
      setSelected(null);
      goToPage(1);
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Could not approve this application.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) return;
    setActionLoading(true);
    setActionError('');
    try {
      await adminApi.rejectApplication(selected.id, reason.trim());
      setSelected(null);
      goToPage(1);
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Could not reject this application.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-1 bg-(--color-muted) rounded-lg border border-(--color-border) w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-(--radius-md) transition-all cursor-pointer ${
              tab === t.key
                ? 'bg-(--color-primary) text-(--color-primary-foreground) shadow-soft'
                : 'text-(--color-muted-foreground) hover:text-(--color-foreground)'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) p-12 shadow-soft">
          <EmptyState message={`No ${tab} applications.`} />
        </div>
      ) : (
        <>
          {/* Responsive Grid layout for applications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((app) => (
              <button
                key={app.id}
                onClick={() => openApplication(app)}
                className="flex items-center justify-between gap-4 p-4 rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) hover:border-(--color-primary)/50 transition-colors text-left cursor-pointer h-full"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-(--color-foreground) truncate">
                    {app.user_full_name || app.user_email}
                  </p>
                  <p className="text-xs text-(--color-muted-foreground) mt-0.5 truncate">
                    {app.experience_years ? `${app.experience_years} yrs experience` : 'Experience not specified'}
                    {app.skills?.length > 0 && ` · ${app.skills.join(', ')}`}
                  </p>
                </div>
                <div className="shrink-0">
                  <AdminStatusBadge status={app.status} />
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
        title={selected?.user_full_name || selected?.user_email}
        subtitle={selected?.user_email}
        footer={
          selected?.status === 'pending' && !showRejectForm ? (
            <>
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl border border-(--color-destructive)/40 text-(--color-destructive) bg-(--color-destructive)/5 hover:bg-(--color-destructive)/10 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-(--color-primary) text-(--color-primary-foreground) text-xs font-semibold shadow-soft hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? 'Approving...' : 'Approve'}
              </button>
            </>
          ) : selected?.status === 'pending' && showRejectForm ? (
            <>
              <button
                onClick={() => setShowRejectForm(false)}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-(--color-muted) border border-(--color-border) text-(--color-foreground) text-xs font-semibold hover:bg-(--color-muted-foreground)/10 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || !reason.trim()}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-soft hover:bg-rose-700 transition-all disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </>
          ) : null
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AdminStatusBadge status={selected.status} />
              <span className="text-xs text-(--color-muted-foreground)">
                Submitted {new Date(selected.submitted_at).toLocaleDateString()}
              </span>
            </div>

            {selected.experience_years != null && (
              <div>
                <p className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-1">Experience</p>
                <p className="text-sm text-(--color-foreground)">{selected.experience_years} years</p>
              </div>
            )}

            {selected.skills?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-1.5">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.skills.map((skill) => (
                    <span key={skill} className="text-xs px-2.5 py-1 rounded-xl bg-(--color-muted) border border-(--color-border) text-(--color-foreground) font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selected.professional_summary && (
              <div>
                <p className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-1">Summary</p>
                <p className="text-sm text-(--color-foreground) whitespace-pre-line leading-relaxed">
                  {selected.professional_summary}
                </p>
              </div>
            )}

            {selected.status === 'rejected' && selected.rejection_reason && (
              <div className="p-3 rounded-lg bg-(--color-destructive)/10 border border-(--color-destructive)/20">
                <p className="text-xs font-semibold text-(--color-destructive) uppercase tracking-wider mb-1">Rejection Reason</p>
                <p className="text-sm text-(--color-foreground)">{selected.rejection_reason}</p>
              </div>
            )}

            {showRejectForm && (
              <div className="space-y-2 pt-2 border-t border-(--color-border)">
                <p className="text-xs font-semibold text-(--color-foreground)">Reason for rejection</p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Explain why this application is being rejected..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
                />
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
    </div>
  );
}