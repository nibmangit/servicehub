import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Briefcase, CheckCircle2, MapPin, ArrowLeft, ShieldCheck, Award } from 'lucide-react';
import { profileApi } from '../../services/profileApi';
import { servicesApi } from '../../services/servicesApi';
import { reviewsApi } from '../../services/reviewsApi';
import { usePaginatedResource } from '../../lib/usePaginatedResource';
import ServiceCard from '../../components/services/ServiceCard';
import ReviewsList from '../../components/reviews/ReviewsList';
import LoadMoreButton from '../../components/common/LoadMoreButton';
import EmptyState from '../../components/common/EmptyState';

export default function ProviderPublicProfilePage() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const services = usePaginatedResource(servicesApi.getServices, { provider: id });
  const reviews = usePaginatedResource(reviewsApi.getReviews, { provider: id });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    profileApi.getPublicProviderProfile(id)
      .then((data) => { if (!cancelled) setProvider(data); })
      .catch(() => { if (!cancelled) setError('Could not load this provider profile.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
        <p className="text-xs text-(--color-muted-foreground) font-medium">Loading provider profile...</p>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-4 rounded-xl bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20 shadow-soft">
          {error || 'Provider not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">

      <Link
        to={-1}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-muted-foreground) hover:text-(--color-primary) transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) shadow-elevated p-6 sm:p-8 space-y-6 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-64 h-64 bg-(--color-primary)/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div className="relative">
                <div className="h-28 w-28 rounded-3xl bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center text-4xl font-extrabold shadow-soft overflow-hidden border-2 border-(--color-border)">
                  {provider.avatar ? (
                    <img src={provider.avatar} alt={provider.full_name} className="w-full h-full object-cover" />
                  ) : (
                    provider.full_name?.[0]?.toUpperCase() || '?'
                  )}
                </div>
                {provider.is_available && (
                  <span className="absolute -bottom-2 right-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-soft flex items-center gap-1 border-2 border-(--color-card)">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" /> Available
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-(--color-foreground) tracking-tight">
                    {provider.full_name}
                  </h1>
                  <ShieldCheck size={18} className="text-(--color-primary)" title="Verified Provider" />
                </div>
                {provider.city && (
                  <p className="text-xs text-(--color-muted-foreground) flex items-center justify-center gap-1">
                    <MapPin size={13} className="text-(--color-primary)" /> {provider.city}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-(--color-muted)/50 border border-(--color-border) text-center relative z-10">
              <div className="space-y-0.5 pr-3 border-r border-(--color-border)">
                <div className="flex items-center justify-center gap-1">
                  <Star size={15} className="text-(--color-warning) fill-(--color-warning)" />
                  <span className="font-bold text-(--color-foreground) text-sm">{provider.rating.toFixed(1)}</span>
                </div>
                <span className="text-[11px] text-(--color-muted-foreground)">({provider.total_reviews} reviews)</span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-center gap-1">
                  <Award size={15} className="text-(--color-primary)" />
                  <span className="font-bold text-(--color-foreground) text-sm">{provider.completed_jobs}</span>
                </div>
                <span className="text-[11px] text-(--color-muted-foreground)">Jobs Done</span>
              </div>
            </div>

            {provider.bio && (
              <div className="space-y-2 relative z-10 pt-2 border-t border-(--color-border)">
                <h3 className="text-xs font-bold uppercase tracking-wider text-(--color-muted-foreground)">About</h3>
                <p className="text-xs sm:text-sm text-(--color-muted-foreground) leading-relaxed">
                  {provider.bio}
                </p>
              </div>
            )}

            {provider.skills?.length > 0 && (
              <div className="space-y-2.5 relative z-10 pt-2 border-t border-(--color-border)">
                <h3 className="text-xs font-bold uppercase tracking-wider text-(--color-muted-foreground)">Expertise</h3>
                <div className="flex flex-wrap gap-1.5">
                  {provider.skills.map((skill) => (
                    <span key={skill.id} className="text-xs px-2.5 py-1 rounded-xl bg-(--color-muted) border border-(--color-border) text-(--color-foreground) font-medium flex items-center gap-1 shadow-soft">
                      <Briefcase size={11} className="text-(--color-primary)" /> {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="lg:col-span-8 space-y-10">

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-(--color-foreground) tracking-tight">Active Services</h2>
              <span className="text-xs text-(--color-muted-foreground) font-semibold uppercase tracking-wider">{services.count} Listed</span>
            </div>

            {services.loading ? (
              <div className="py-12 flex justify-center">
                <div className="h-6 w-6 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
              </div>
            ) : services.items.length === 0 ? (
              <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) p-10 shadow-soft">
                <EmptyState message="This provider doesn't have any active services right now." />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {services.items.map((service) => <ServiceCard key={service.id} service={service} />)}
                </div>
                <LoadMoreButton
                  hasMore={services.hasMore}
                  loadingMore={services.loadingMore}
                  onClick={services.loadMore}
                  loadedCount={services.items.length}
                  totalCount={services.count}
                />
              </>
            )}
          </div>

          <div className="space-y-4 pt-6 border-t border-(--color-border)">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-(--color-foreground) tracking-tight">Client Reviews</h2>
              <span className="text-xs text-(--color-muted-foreground) font-semibold uppercase tracking-wider">{reviews.count} Total</span>
            </div>

            <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) p-6 sm:p-8 shadow-soft">
              <ReviewsList reviews={reviews.items} />
              <LoadMoreButton
                hasMore={reviews.hasMore}
                loadingMore={reviews.loadingMore}
                onClick={reviews.loadMore}
                loadedCount={reviews.items.length}
                totalCount={reviews.count}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}