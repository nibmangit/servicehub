import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart } from 'lucide-react';
import { formatPrice } from '../../lib/priceFormat';

export default function ServiceCard({ service }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const primaryImage = service.images?.[0]?.image;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // API call will add to persist favorite status
  };

  return (
    <Link
      to={`/services/${service.id}`}
      className="group bg-(--color-card) border border-(--color-border) rounded-(--radius-lg) overflow-hidden shadow-soft hover:shadow-elevated transition-all flex flex-col"
    >
      {/* Image Thumbnail & Overlay Badges */}
      <div className="relative aspect-16/10 bg-(--color-muted) overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-(--color-muted-foreground) text-sm font-medium">
            No image available
          </div>
        )}

        {/* Category Badge (Top-Left) */}
        {service.category_detail && (
          <span className="absolute top-3 left-3 text-xs font-semibold text-(--color-primary) bg-(--color-card)/90 backdrop-blur-md px-2.5 py-1 rounded-(--radius-md) shadow-xs border border-(--color-border)">
            {service.category_detail.name}
          </span>
        )}

        {/* Favorite Button (Top-Right) */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer border border-(--color-border) shadow-xs ${
            isFavorite
              ? 'bg-(--color-card) text-(--color-destructive) scale-110'
              : 'bg-card/80 text-(--color-muted-foreground) hover:text-(--color-foreground) hover:bg-(--color-card)'
          }`}
          aria-label="Save to favorites"
        >
          <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1.5"> 
          <h3 className="font-semibold text-(--color-foreground) text-base group-hover:text-(--color-primary) transition-colors line-clamp-1">
            {service.title}
          </h3>
 
          {service.description && (
            <p className="text-xs text-(--color-muted-foreground) line-clamp-2 leading-relaxed">
              {service.description}
            </p>
          )} 
          
          <p className="text-xs text-(--color-muted-foreground) flex items-center gap-1 pt-0.5">
            <MapPin size={13} className="text-(--color-primary)" /> {service.location}
          </p>
        </div>

        {/* Provider info row */}
        {service.provider_name && (
          <div className="flex items-center gap-2 pt-2 border-t border-(--color-border)">
            {service.provider_avatar ? (
              <img
                src={service.provider_avatar}
                alt={service.provider_name}
                className="w-6 h-6 rounded-full object-cover border border-(--color-border)"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center text-xs font-bold">
                {service.provider_name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-medium text-(--color-muted-foreground) truncate">{service.provider_name}</span>
          </div>
        )}

        {/* Price & Rating Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-(--color-border)">
          <div>
            <span className="font-bold text-sm text-(--color-foreground)">{formatPrice(service)}</span>
            {service.price_type && (
              <span className="text-[10px] text-(--color-muted-foreground) capitalize ml-1">
                /{service.price_type}
              </span>
            )}
          </div>

          {service.review_count > 0 ? (
            <span className="flex items-center gap-1 text-xs font-medium text-(--color-foreground)">
              <Star size={13} className="text-(--color-warning) fill-(--color-warning)" />
              {Number(service.average_rating).toFixed(1)}
              <span className="text-(--color-muted-foreground)">({service.review_count})</span>
            </span>
          ) : (
            <span className="text-[11px] font-medium text-(--color-primary) bg-(--color-primary-soft) px-2 py-0.5 rounded-(--radius-sm)">
              New
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}