import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Briefcase, User, Calendar, ExternalLink } from 'lucide-react';
import { reviewsApi } from '../../services/reviewsApi';
import { formatDate } from '../../lib/format';

export default function ReviewDetailPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    reviewsApi.getReview(id)
      .then((data) => { if (!cancelled) setReview(data); })
      .catch(() => { if (!cancelled) setError('Could not load this review.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
        <p className="text-xs text-(--color-muted-foreground) font-medium">Loading review details...</p>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-4 rounded-xl bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20 shadow-soft">
          {error || 'Review not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      
      {/* Back Link */}
      <Link 
        to="/reviews" 
        className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-muted-foreground) hover:text-(--color-primary) transition-colors"
      >
        <ArrowLeft size={16} /> Back to Reviews
      </Link>

      {/* Main Detailed Review Card */}
      <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) shadow-elevated p-8 space-y-6 relative overflow-hidden">
        
        {/* Aesthetic Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-(--color-primary)/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Header Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-(--color-border) relative z-10">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-(--color-muted-foreground)">Service Reviewed</span>
            <Link 
              to={`/services/${review.service_id}`} 
              className="text-xl sm:text-2xl font-extrabold text-(--color-foreground) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
            >
              {review.service_title}
              <ExternalLink size={18} className="text-(--color-muted-foreground) group-hover:text-(--color-primary) transition-colors" />
            </Link>
            <Link 
              to={`/providers/${review.provider_id}`} 
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--color-primary) hover:underline pt-1"
            >
              <Briefcase size={14} /> Provider: {review.provider_name}
            </Link>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-1 bg-(--color-muted)/50 border border-(--color-border) px-4 py-2.5 rounded-2xl shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={18} 
                className={i < review.rating ? 'text-(--color-warning) fill-(--color-warning)' : 'text-(--color-border)'} 
              />
            ))}
            <span className="ml-2 font-bold text-(--color-foreground)">{review.rating}.0</span>
          </div>
        </div>

        {/* Review Comment Body */}
        <div className="space-y-3 relative z-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-(--color-muted-foreground)">Client Feedback</h3>
          {review.comment ? (
            <p className="text-base text-(--color-foreground)/90 leading-relaxed whitespace-pre-line bg-(--color-muted)/30 border border-(--color-border) p-6 rounded-2xl">
              "{review.comment}"
            </p>
          ) : (
            <p className="text-sm text-(--color-muted-foreground) italic">No written commentary was provided for this rating.</p>
          )}
        </div>

        {/* Author & Timestamp Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-(--color-border) text-xs text-(--color-muted-foreground) relative z-10">
          <span className="flex items-center gap-1.5 font-medium text-(--color-foreground)">
            <User size={14} className="text-(--color-primary)" /> Written by {review.client_name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {formatDate(review.created_at)}
          </span>
        </div>

      </div>

    </div>
  );
}