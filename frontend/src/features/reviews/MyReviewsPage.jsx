import { useEffect, useState } from 'react';
import { reviewsApi } from '../../services/reviewsApi';
import { useAuth } from '../../context/AuthContext';
import ReviewCard from '../../components/reviews/ReviewCard';
import EmptyState from '../../components/common/EmptyState';
import { MessageSquareText, PenSquare, Inbox } from 'lucide-react';

export default function MyReviewsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('received');
  const [writtenReviews, setWrittenReviews] = useState([]);
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
 
    const requests = [reviewsApi.getReviews({ mine: 'true' })];
    if (user?.is_provider) {
      requests.push(reviewsApi.getReviews({ received: 'true' }));
    }

    Promise.all(requests)
      .then(([writtenData, receivedData]) => {
        if (cancelled) return;
        setWrittenReviews(writtenData.results || writtenData || []);
        if (receivedData) {
          setReceivedReviews(receivedData.results || receivedData || []);
        }
      })
      .catch(() => { if (!cancelled) setError('Could not load reviews.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user?.is_provider]);

  const activeReviews = tab === 'received' ? receivedReviews : writtenReviews;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-(--color-primary) bg-(--color-primary-soft) px-3 py-1 rounded-full uppercase tracking-wider">
            <MessageSquareText size={13} /> Feedback Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-(--color-foreground)">
            My Reviews
          </h1>
          <p className="text-xs sm:text-sm text-(--color-muted-foreground)">
            Manage ratings and reviews you've written{user?.is_provider ? ' and received from clients' : ''}.
          </p>
        </div>

        {/* Pill Toggle Tabs with Counts */}
        {user?.is_provider && (
          <div className="flex items-center gap-2 p-1.5 bg-(--color-card) border border-(--color-border) rounded-2xl w-fit shadow-soft shrink-0">
            {/* Written Tab */}
            <button
              onClick={() => setTab('written')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === 'written' 
                  ? 'bg-(--color-primary) text-(--color-primary-foreground) shadow-soft' 
                  : 'text-(--color-muted-foreground) hover:text-(--color-foreground)'
              }`}
            >
              <PenSquare size={14} />
              Written by Me
              <span 
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-colors ${
                  tab === 'written'
                    ? 'bg-black/20 dark:bg-white/20 text-(--color-primary-foreground)'
                    : 'bg-(--color-primary-soft) text-(--color-primary)'
                }`}
              >
                {writtenReviews.length}
              </span>
            </button>

            {/* Received Tab */}
            <button
              onClick={() => setTab('received')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === 'received' 
                  ? 'bg-(--color-primary) text-(--color-primary-foreground) shadow-soft' 
                  : 'text-(--color-muted-foreground) hover:text-(--color-foreground)'
              }`}
            >
              <Inbox size={14} />
              Received
              <span 
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-colors ${
                  tab === 'received'
                    ? 'bg-black/20 dark:bg-white/20 text-(--color-primary-foreground)'
                    : 'bg-(--color-primary-soft) text-(--color-primary)'
                }`}
              >
                {receivedReviews.length}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
          <p className="text-xs text-(--color-muted-foreground) font-medium">Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20 shadow-soft">
          {error}
        </div>
      ) : activeReviews.length === 0 ? (
        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) p-12 shadow-soft">
          <EmptyState message={tab === 'received' ? 'No reviews received yet.' : "You haven't written any reviews yet."} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeReviews.map((r) => (
            <ReviewCard key={r.id} review={r} perspective={tab} />
          ))}
        </div>
      )}

    </div>
  );
}