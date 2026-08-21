import { useEffect, useState } from 'react';
import { requestsApi } from '../../services/requestsApi';
import { useAuth } from '../../context/AuthContext';
import RequestCard from '../../components/requests/RequestCard';
import EmptyState from '../../components/common/EmptyState';
import { Inbox, BookmarkCheck, Sparkles } from 'lucide-react';

export default function RequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('bookings'); // "bookings" | "incoming"

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await requestsApi.getRequests();
        if (!cancelled) setRequests(data.results || data);
      } catch (err) {
        if (!cancelled) setError('Could not load your requests.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Match by email, since UserProfile.id and User.id are different numbers.
  const myBookings = requests.filter((r) => r.customer_email === user?.email);
  const incoming = requests.filter((r) => r.provider_email === user?.email);

  const visible = user?.is_provider && tab === 'incoming' ? incoming : myBookings;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-(--color-background) py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-(--color-border)">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--color-foreground)">
                {user?.is_provider ? 'Service Operations' : 'My Service Requests'}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-(--color-primary-soft) text-(--color-primary)">
                <Sparkles size={12} className="mr-1" /> Live Tracker
              </span>
            </div>
            <p className="text-sm text-(--color-muted-foreground) mt-1">
              {user?.is_provider 
                ? 'Manage incoming bookings from customers and oversee active service progress.' 
                : 'Track the status, schedule details, and secure OTP verification codes for your bookings.'}
            </p>
          </div>

          {/* Provider Tabs Switcher (Pill Style) */}
          {user?.is_provider && (
            <div className="flex items-center p-1 bg-(--color-muted) rounded-lg border border-(--color-border) self-start sm:self-auto">
              <button
                onClick={() => setTab('bookings')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-(--radius-md) transition-all cursor-pointer ${
                  tab === 'bookings'
                    ? 'bg-(--color-card) text-(--color-primary) shadow-soft'
                    : 'text-(--color-muted-foreground) hover:text-(--color-foreground)'
                }`}
              >
                <BookmarkCheck size={15} />
                My Bookings <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-(--color-primary-soft) text-(--color-primary)">{myBookings.length}</span>
              </button>
              
              <button
                onClick={() => setTab('incoming')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-(--radius-md) transition-all cursor-pointer ${
                  tab === 'incoming'
                    ? 'bg-(--color-card) text-(--color-primary) shadow-soft'
                    : 'text-(--color-muted-foreground) hover:text-(--color-foreground)'
                }`}
              >
                <Inbox size={15} />
                Incoming <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-(--color-accent-soft) text-(--color-accent)">{incoming.length}</span>
              </button>
            </div>
          )}
        </div>

        {/* Content States */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <div className="h-10 w-10 rounded-full border-3 border-(--color-border) border-t-(--color-primary) animate-spin" />
            <p className="text-xs text-(--color-muted-foreground) font-medium tracking-wide">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20 shadow-soft">
            {error}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-16 bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) shadow-soft">
            <EmptyState 
              message={
                tab === 'incoming' 
                  ? 'No incoming customer requests found at the moment.' 
                  : 'You have no active service requests. Explore our categories to book a service.'
              } 
            />
          </div>
        ) : (
          /* Cards List Layout */
          <div className="grid grid-cols-1 gap-4">
            {visible.map((r) => (
              <RequestCard 
                key={r.id} 
                request={r} 
                perspective={tab === 'incoming' ? 'provider' : 'customer'} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}