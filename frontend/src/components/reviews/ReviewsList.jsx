import { Star } from 'lucide-react';
import { formatDate } from '../../lib/format';
import EmptyState from '../common/EmptyState';

export default function ReviewsList({ reviews }) {
    console.log(reviews)
  if (reviews.length === 0) {
    return <EmptyState message="No reviews yet." />;
  }

  return (
    <ul className="divide-y divide-(--color-border)">
      {reviews.map((review) => (
        <li key={review.id} className="py-4">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="h-8 w-8 rounded-full bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center text-xs font-semibold shrink-0">
              {review.client_name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-sm font-medium text-(--color-foreground)">{review.client_name || 'Anonymous'}</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < review.rating ? 'text-(--color-warning) fill-(--color-warning)' : 'text-(--color-border)'}
                  />
                ))}
                <span className="text-xs text-(--color-muted-foreground) ml-1">{formatDate(review.created_at)}</span>
              </div>
            </div>
          </div>
          {review.comment && <p className="text-sm text-(--color-foreground) ml-11">{review.comment}</p>}
        </li>
      ))}
    </ul>
  );
}