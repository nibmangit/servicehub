import { Link } from 'react-router-dom';
import { Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { formatPrice } from '../../lib/priceFormat';

export default function MyServiceCard({ service, onDelete, onToggleActive }) {
  const primaryImage = service.images?.[0]?.image;

  return (
    <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-lg) overflow-hidden shadow-soft flex flex-col sm:flex-row">
      <div className="sm:w-40 aspect-[4/3] sm:aspect-square bg-(--color-muted) shrink-0">
        {primaryImage ? (
          <img src={primaryImage} alt={service.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-(--color-muted-foreground) text-xs">
            No image
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-(--color-foreground) truncate">{service.title}</h3>
            {!service.is_active && (
              <span className="text-xs px-2 py-0.5 rounded-(--radius-sm) bg-(--color-muted) text-(--color-muted-foreground) shrink-0">
                Inactive
              </span>
            )}
          </div>
          <p className="text-sm text-(--color-muted-foreground) mt-0.5">{formatPrice(service)}</p>
          {service.review_count > 0 && (
            <span className="flex items-center gap-1 text-xs text-(--color-muted-foreground) mt-1">
              <Star size={12} className="text-(--color-warning) fill-(--color-warning)" />
              {service.average_rating.toFixed(1)} ({service.review_count})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Link
            to={`/my-services/${service.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-(--radius-md) border border-(--color-border) text-(--color-foreground) text-sm hover:bg-(--color-muted) transition-colors"
          >
            <Pencil size={13} /> Edit
          </Link>
          <button
            onClick={() => onToggleActive(service)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-(--radius-md) border border-(--color-border) text-(--color-foreground) text-sm hover:bg-(--color-muted) transition-colors"
          >
            {service.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
            {service.is_active ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={() => onDelete(service)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-(--radius-md) border border-(--color-destructive) text-(--color-destructive) text-sm hover:bg-(--color-destructive)/10 transition-colors"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}