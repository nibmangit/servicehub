import { useState } from 'react';
import { X } from 'lucide-react';
import { requestsApi } from '../../services/requestsApi'
import { extractErrorMessage } from '../../lib/errorFormat';

export default function RequestServiceModal({ service, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    description: '',
    preferred_date: '',
    address: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await requestsApi.createRequest({
        service: service.id,
        description: formData.description,
        // datetime-local gives "YYYY-MM-DDTHH:mm" — convert to a full ISO string.
        preferred_date: new Date(formData.preferred_date).toISOString(),
        address: formData.address,
      });
      onSuccess();
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not send request. Please check your details.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Prevent picking a time in the past — min attribute needs local format.
  const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-(--color-card) rounded-2xl border border-(--color-border) shadow-elevated">
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border)">
          <h2 className="text-lg font-bold text-(--color-foreground)">Request "{service.title}"</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-(--radius-md) text-(--color-muted-foreground) hover:bg-(--color-muted) transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-(--radius-md) bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-foreground)">What do you need done? *</label>
            <textarea
              name="description"
              required
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job..."
              className="w-full px-3.5 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Preferred date & time *</label>
            <input
              type="datetime-local"
              name="preferred_date"
              required
              min={nowLocal}
              value={formData.preferred_date}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Address</label>
            <textarea
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              placeholder="Where should the provider come?"
              className="w-full px-3.5 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-(--color-primary) text-(--color-primary-foreground) py-2.5 rounded-(--radius-md) font-medium hover:opacity-95 transition-opacity disabled:opacity-50"
          >
            {submitting ? 'Sending Request...' : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
}