import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, title, message, onConfirm, onClose, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) shadow-elevated max-w-md w-full p-6 space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 rounded-xl text-(--color-muted-foreground) hover:bg-(--color-muted) transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20 shadow-soft">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-(--color-foreground) tracking-tight">
              {title || 'Delete Confirmation'}
            </h3>
            <p className="text-xs text-(--color-muted-foreground)">This action cannot be undone.</p>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-(--color-muted-foreground) leading-relaxed">
          {message || 'Are you sure you want to delete this item?'}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-(--color-border)">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-(--color-muted) border border-(--color-border) text-(--color-foreground) text-xs font-semibold hover:bg-(--color-muted-foreground)/10 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-soft hover:bg-rose-700 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>

      </div>
    </div>
  );
}