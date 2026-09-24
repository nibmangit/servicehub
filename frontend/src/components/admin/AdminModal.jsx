import { X } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, title, subtitle, children, footer, maxWidth = 'max-w-lg' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className={`bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) shadow-elevated ${maxWidth} w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-(--color-muted-foreground) hover:bg-(--color-muted) transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div>
          <h3 className="text-lg font-bold text-(--color-foreground) tracking-tight pr-8">{title}</h3>
          {subtitle && <p className="text-xs text-(--color-muted-foreground) mt-0.5">{subtitle}</p>}
        </div>

        <div>{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-(--color-border)">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}