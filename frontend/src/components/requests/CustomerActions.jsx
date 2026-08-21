import { useState } from 'react';
import OtpChip from '../common/OtpChip';
import { requestsApi } from '../../services/requestsApi';
import { extractErrorMessage } from '../../lib/errorFormat';
import { XCircle } from 'lucide-react';

export default function CustomerActions({ request, onUpdated }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = async () => {
    setError('');
    setBusy(true);
    try {
      const updated = await requestsApi.updateStatus(request.id, { status: 'CANCELLED' }); 
      onUpdated({ updated });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const canCancel = request.status === 'PENDING' || request.status === 'ACCEPTED';

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3.5 rounded-xl bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20 shadow-soft">
          {error}
        </div>
      )}

      {request.status === 'ACCEPTED' && (
        <div className="p-4 rounded-xl bg-(--color-muted) border border-(--color-border) space-y-2">
          <p className="text-xs font-medium text-(--color-muted-foreground)">Secure Start Code</p>
          <OtpChip code={request.start_otp} label="Give this code to your provider to start the job" />
        </div>
      )}

      {request.status === 'IN_PROGRESS' && (
        <div className="p-4 rounded-xl bg-(--color-muted) border border-(--color-border) space-y-2">
          <p className="text-xs font-medium text-(--color-muted-foreground)">Secure Completion Code</p>
          <OtpChip code={request.complete_otp} label="Give this code to your provider once the job is done" />
        </div>
      )}

      {canCancel && (
        <div className="pt-2">
          <button
            onClick={handleCancel}
            disabled={busy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-destructive/40 text-(--color-destructive) bg-destructive/5 hover:bg-(--color-destructive)/10 text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            <XCircle size={16} />
            {busy ? 'Cancelling...' : 'Cancel Request'}
          </button>
        </div>
      )}
    </div>
  );
}