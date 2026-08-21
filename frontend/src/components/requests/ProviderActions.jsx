import { useState } from 'react';
import { requestsApi } from '../../services/requestsApi';
import { extractErrorMessage } from '../../lib/errorFormat';
import { CheckCircle2, XCircle, KeyRound, Play, CheckCheck } from 'lucide-react';

export default function ProviderActions({ request, onUpdated }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [otpInput, setOtpInput] = useState('');

  const runUpdate = async (payload) => {
    setError('');
    setBusy(true);
    try {
      const updated = await requestsApi.updateStatus(request.id, payload); 
      onUpdated({ updated });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const errorBanner = error && (
    <div className="p-3.5 rounded-xl bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20 shadow-soft">
      {error}
    </div>
  );

  if (request.status === 'PENDING') {
    return (
      <div className="space-y-4">
        {errorBanner}
        {showRejectForm ? (
          <div className="p-4 rounded-xl bg-(--color-muted) border border-(--color-border) space-y-3">
            <p className="text-xs font-semibold text-(--color-foreground)">Please provide a reason for rejection:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why you cannot take this job..."
              rows="3"
              className="w-full px-3.5 py-2.5 rounded-lg bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => runUpdate({ status: 'REJECTED', rejection_reason: rejectionReason })}
                disabled={busy || !rejectionReason.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-(--color-destructive) text-(--color-destructive-foreground) text-sm font-semibold shadow-soft hover:opacity-90 disabled:opacity-50 cursor-pointer transition-all"
              >
                <XCircle size={16} /> Confirm Reject
              </button>
              <button
                onClick={() => setShowRejectForm(false)}
                className="px-4 py-2 rounded-lg border border-(--color-border) text-sm font-medium text-(--color-foreground) hover:bg-(--color-muted) cursor-pointer transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => runUpdate({ status: 'ACCEPTED' })}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-(--color-primary) text-(--color-primary-foreground) text-sm font-semibold shadow-soft hover:opacity-90 disabled:opacity-50 cursor-pointer transition-all"
            >
              <CheckCircle2 size={16} /> Accept Booking
            </button>
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-(--color-border) text-(--color-destructive) hover:bg-(--color-destructive)/5 text-sm font-semibold disabled:opacity-50 cursor-pointer transition-all"
            >
              <XCircle size={16} /> Reject
            </button>
          </div>
        )}
      </div>
    );
  }

  if (request.status === 'ACCEPTED' || request.status === 'IN_PROGRESS') {
    const isStarting = request.status === 'ACCEPTED';
    return (
      <div className="space-y-4">
        {errorBanner}
        <div className="p-4 rounded-xl bg-(--color-muted) border border-(--color-border) space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-(--color-foreground)">
            <KeyRound size={15} className="text-(--color-primary)" />
            <span>Ask the customer for their {isStarting ? 'start' : 'completion'} code</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full sm:w-36 px-3.5 py-2.5 rounded-lg bg-(--color-input) border border-(--color-border) text-(--color-foreground) font-mono text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
            <button
              onClick={() =>
                runUpdate({
                  status: isStarting ? 'IN_PROGRESS' : 'COMPLETED',
                  otp_code: otpInput,
                })
              }
              disabled={busy || otpInput.length !== 4}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-(--color-primary) text-(--color-primary-foreground) text-sm font-semibold shadow-soft hover:opacity-90 disabled:opacity-50 cursor-pointer transition-all"
            >
              {isStarting ? <Play size={16} /> : <CheckCheck size={16} />}
              {isStarting ? 'Start Service' : 'Mark Completed'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}