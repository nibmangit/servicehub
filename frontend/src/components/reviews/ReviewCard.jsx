import { Link } from 'react-router-dom';
import { Star, User, Briefcase, ChevronRight } from 'lucide-react';
import { formatDate } from '../../lib/format';

export default function ReviewCard({ review, perspective }) {
  const otherParty = perspective === 'written' ? review.provider_name : review.client_name;

  return (
    <Link
      to={`/reviews/${review.id}`}
      className="group flex flex-col justify-between bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) p-6 shadow-soft hover:shadow-elevated hover:border-(--color-primary)/40 transition-all duration-300 relative overflow-hidden"
    >
      {/* Aesthetic Glow Accent on Hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-(--color-primary)/5 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="space-y-4 relative z-10">
        
        {/* Header: Service & Rating */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <h3 className="font-bold text-(--color-foreground) group-hover:text-(--color-primary) transition-colors truncate text-base">
              {review.service_title}
            </h3>
            <p className="text-xs text-(--color-muted-foreground) flex items-center gap-1.5 font-medium">
              <Briefcase size={13} className="text-(--color-primary)" />
              {perspective === 'written' ? 'Provider:' : 'From Client:'} <span className="text-(--color-foreground) font-semibold">{otherParty}</span>
            </p>
          </div>
          
          {/* Rating Stars */}
          <div className="flex items-center gap-0.5 shrink-0 bg-(--color-muted)/50 px-2.5 py-1.5 rounded-xl border border-(--color-border)">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={i < review.rating ? 'text-(--color-warning) fill-(--color-warning)' : 'text-(--color-border)'} 
              />
            ))}
          </div>
        </div>

        {/* Comment Excerpt */}
        {review.comment ? (
          <p className="text-sm text-(--color-muted-foreground) line-clamp-3 leading-relaxed">
            "{review.comment}"
          </p>
        ) : (
          <p className="text-xs text-(--color-muted-foreground) italic">No written comment provided.</p>
        )}

      </div>

      {/* Footer: Date & Arrow Indicator */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-(--color-border) text-xs text-(--color-muted-foreground) relative z-10">
        <span>{formatDate(review.created_at)}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-(--color-primary) opacity-0 group-hover:opacity-100 transition-opacity">
          View details <ChevronRight size={14} />
        </span>
      </div>

    </Link>
  );
}