import { Star } from 'lucide-react';
import { formatDate } from '../../lib/format';

export default function ReviewDisplay({ review }) {
    console.log(review)
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-(--color-foreground)">Your review</p>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < review.rating ? 'text-(--color-warning) fill-(--color-warning)' : 'text-(--color-border)'}
          />
        ))}
        <span className="text-xs text-(--color-muted-foreground) ml-1">{formatDate(review.created_at)}</span>
      </div>
      {review.comment && <p className="text-sm text-foreground/90">{review.comment}</p>}
    </div>
  );
}