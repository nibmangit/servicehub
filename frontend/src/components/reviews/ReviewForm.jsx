import { useState } from 'react';
import { Star } from 'lucide-react';
import { reviewsApi } from '../../services/reviewsApi';
import { extractErrorMessage } from '../../lib/errorFormat';

export default function ReviewForm({ requestId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await reviewsApi.createReview({ request: requestId, rating, comment });
      onSubmitted({ rating, comment, created_at: new Date().toISOString() });
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not submit your review.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm font-semibold text-(--color-foreground)">Leave a review</p>

      {error && (
        <div className="p-3 rounded-(--radius-md) bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
          {error}
        </div>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1;
          const filled = value <= (hoverRating || rating);
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`${value} star${value !== 1 ? 's' : ''}`}
              className="p-0.5"
            >
              <Star
                size={26}
                className={filled ? 'text-(--color-warning) fill-(--color-warning)' : 'text-(--color-border)'}
              />
            </button>
          );
        })}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How was your experience? (optional)"
        rows="3"
        className="w-full px-3.5 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
      />

      <button
        type="submit"
        disabled={submitting}
        className="px-5 py-2.5 rounded-(--radius-md) bg-(--color-primary) text-(--color-primary-foreground) text-sm font-medium hover:opacity-95 transition-opacity disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}