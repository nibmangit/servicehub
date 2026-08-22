import { Link } from 'react-router-dom';
import { Pencil, Trash2, Star, Eye, EyeOff, MapPin, Clock } from 'lucide-react';
import { formatPrice } from '../../lib/priceFormat';

export default function MyServiceCard({ service, onDelete, onToggleActive }) {
  const primaryImage = service.images?.[0]?.image;

  return (
    <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col sm:flex-row group">
      
      {/* Thumbnail Image Container */}
      <div className="sm:w-56 aspect-[16/10] sm:aspect-auto bg-(--color-muted) shrink-0 relative overflow-hidden">
        {primaryImage ? (
          <img 
            src={primaryImage} 
            alt={service.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-(--color-muted-foreground) text-xs font-medium">
            No image available
          </div>
        )}
        
        {/* Status Badge Overlay */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-soft ${
            service.is_active 
              ? 'bg-(--color-accent)/90 text-(--color-accent-foreground)' 
              : 'bg-(--color-muted)/90 text-(--color-muted-foreground)'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${service.is_active ? 'bg-(--color-accent-foreground)' : 'bg-(--color-muted-foreground)'}`} />
            {service.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Content & Action Controls */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between min-w-0 space-y-4">
        
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base sm:text-lg font-bold text-(--color-foreground) tracking-tight truncate">
              {service.title}
            </h3>
            <span className="text-lg font-extrabold text-(--color-primary) shrink-0">
              {formatPrice(service)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-(--color-muted-foreground)">
            {service.location && (
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-(--color-primary)" /> {service.location}
              </span>
            )}
            {service.duration && (
              <span className="flex items-center gap-1">
                <Clock size={13} /> {service.duration}
              </span>
            )}
            {service.review_count > 0 && (
              <span className="flex items-center gap-1 font-medium text-(--color-foreground)">
                <Star size={13} className="text-(--color-warning) fill-(--color-warning)" />
                {service.average_rating.toFixed(1)} <span className="text-(--color-muted-foreground)">({service.review_count})</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Button Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-(--color-border)">
          <Link
            to={`/my-services/${service.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-(--color-muted) border border-(--color-border) text-(--color-foreground) text-xs font-semibold hover:bg-(--color-primary-soft) hover:text-(--color-primary) transition-all cursor-pointer"
          >
            <Pencil size={14} /> Edit
          </Link>

          <button
            onClick={() => onToggleActive(service)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-(--color-muted) border border-(--color-border) text-(--color-foreground) text-xs font-semibold hover:bg-(--color-muted-foreground)/10 transition-all cursor-pointer"
          >
            {service.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
            {service.is_active ? 'Deactivate' : 'Activate'}
          </button>

          <button
            onClick={() => onDelete(service)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold hover:bg-rose-500/20 transition-all cursor-pointer ml-auto"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>

      </div>
    </div>
  );
}