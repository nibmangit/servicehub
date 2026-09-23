import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, Clock, ArrowLeft, Share2, Heart, MessageSquare, ShieldCheck, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';
import { servicesApi } from '../../services/servicesApi';
import { reviewsApi } from '../../services/reviewsApi';
import { requestsApi } from '../../services/requestsApi';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../lib/priceFormat';
import RequestServiceModal from '../../components/requests/RequestServiceModal';
import ReviewsList from '../../components/reviews/ReviewsList';
import { usePaginatedResource } from '../../lib/usePaginatedResource';
import LoadMoreButton from '../../components/common/LoadMoreButton';

const ACTIVE_STATUSES = ['PENDING', 'ACCEPTED', 'IN_PROGRESS'];

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const serviceReviews = usePaginatedResource(reviewsApi.getReviews, { service: id });
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const [isFavorite, setIsFavorite] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  const [existingRequest, setExistingRequest] = useState(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      setRequestSent(false);
      try {
        const serviceData = await servicesApi.getService(id);

        if (!cancelled) {
          setService(serviceData);
          setActiveImage(0);
        }
      } catch (err) {
        if (!cancelled) setError('Could not load this service.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);
 
  useEffect(() => {
    if (!user) {
      setCheckingExisting(false);
      return;
    }

    let cancelled = false;
    setCheckingExisting(true);

    requestsApi.getRequests({ service: id })
      .then((data) => {
        if (cancelled) return;
        const results = data.results || data;
        const active = results.find(
          (r) => r.customer_email === user.email && ACTIVE_STATUSES.includes(r.status)
        );
        setExistingRequest(active || null);
      })
      .catch(() => { 
        if (!cancelled) setExistingRequest(null);
      })
      .finally(() => {
        if (!cancelled) setCheckingExisting(false);
      });

    return () => { cancelled = true; };
  }, [id, user]);

  const handleShare = async () => {
    const shareData = {
      title: service?.title,
      text: `Check out ${service?.title} on EthioServe!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {}
    }

    navigator.clipboard.writeText(window.location.href);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2500);
  };

  const handleChatProvider = () => {
    if (!user) {
      navigate('/login');
      return;
    } 
    navigate(`/chats?provider=${service.provider_id || service.provider_email}`);
  };

  const handleRequestClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-10 w-10 rounded-full border-3 border-(--color-border) border-t-(--color-primary) animate-spin" />
          <p className="text-xs text-(--color-muted-foreground) font-medium">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-(--color-background) py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="p-4 rounded-xl bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20 shadow-soft">
            {error || 'Service not found.'}
          </div>
        </div>
      </div>
    );
  }

  const images = service.images || [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-(--color-background) py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Back Navigation Link */}
        <div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-muted-foreground) hover:text-(--color-primary) transition-colors"
          >
            <ArrowLeft size={16} /> Back to Services
          </Link>
        </div>

        {/* TOP TITLE HEADER ROW WITH CATEGORY, TITLE, & ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-2">
          <div className="space-y-2">
            {service.category_detail && (
              <span className="inline-block text-xs font-semibold text-(--color-primary) bg-(--color-primary-soft) px-3 py-1 rounded-(--radius-md) tracking-wider uppercase">
                {service.category_detail.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-(--color-foreground)">
              {service.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-(--color-muted-foreground)">
              <span className="flex items-center gap-1.5 font-medium text-(--color-foreground)">
                <MapPin size={16} className="text-(--color-primary)" /> {service.location}
              </span>
              {service.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock size={16} /> {service.duration}
                </span>
              )}
              {service.review_count > 0 ? (
                <span className="flex items-center gap-1.5 font-medium">
                  <Star size={16} className="text-(--color-warning) fill-(--color-warning)" />
                  <strong className="text-(--color-foreground)">{service.average_rating.toFixed(1)}</strong>
                  <span>({service.review_count} {service.review_count === 1 ? 'review' : 'reviews'})</span>
                </span>
              ) : (
                <span className="text-xs italic">No ratings yet</span>
              )}
            </div>
          </div>

          {/* Share and Favorite Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 pt-1">
            {shareFeedback && (
              <span className="text-xs font-semibold text-(--color-primary) bg-(--color-primary-soft) px-2.5 py-1 rounded-full animate-fade-in">
                Copied!
              </span>
            )}
            <button
              onClick={handleShare}
              title="Share service"
              className="p-2.5 rounded-lg bg-(--color-card) border border-(--color-border) text-(--color-foreground) hover:bg-(--color-muted) transition-all shadow-soft cursor-pointer"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              className={`p-2.5 rounded-lg border transition-all shadow-soft cursor-pointer ${
                isFavorite ? 'text-rose-500 bg-rose-500/10 border-rose-500/20' : 'bg-(--color-card) border-(--color-border) text-(--color-foreground) hover:bg-(--color-muted)'
              }`}
            >
              <Heart size={16} className={isFavorite ? 'fill-rose-500' : ''} />
            </button>
          </div>
        </div>

        {/* TWO-COLUMN GRID ALIGNED AT THE TOP WITH THE IMAGE GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT 2 COLUMNS: Image Gallery, Provider, About, Reviews */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="aspect-[16/10] bg-(--color-muted) rounded-(--radius-2xl) overflow-hidden border border-(--color-border) shadow-elevated">
                {images.length > 0 ? (
                  <img src={images[activeImage].image} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-(--color-muted-foreground) space-y-2">
                    <MapPin size={28} className="opacity-40" />
                    <span className="text-sm font-medium">No image preview available</span>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(i)}
                      className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        i === activeImage ? 'border-(--color-primary) ring-4 ring-primary/10' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Provider Section */}
            <div className="flex items-center justify-between p-5 rounded-(--radius-2xl) bg-(--color-card) border border-(--color-border) shadow-soft">
              <Link to={`/providers/${service.provider}`} className="flex items-center gap-3.5 min-w-0 hover:opacity-80 transition-opacity">
                <div className="h-14 w-14 rounded-full bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center font-bold text-xl shadow-soft shrink-0">
                  {service.provider_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-base font-bold text-(--color-foreground) truncate">{service.provider_name || 'Service Provider'}</p>
                    <ShieldCheck size={16} className="text-(--color-primary) shrink-0" />
                  </div>
                  <p className="text-xs text-(--color-muted-foreground)">Verified Professional Provider</p>
                </div>
              </Link>

              {!service.is_owner && (
                <button
                  onClick={handleChatProvider}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-(--color-muted) border border-(--color-border) text-(--color-foreground) hover:bg-(--color-primary-soft) hover:text-(--color-primary) text-sm font-semibold transition-all cursor-pointer shrink-0"
                >
                  <MessageSquare size={16} />
                  <span>Chat</span>
                </button>
              )}
            </div>

            {/* About Service Section */}
            <div className="space-y-3 bg-(--color-card) border border-(--color-border) p-6 rounded-(--radius-2xl) shadow-soft">
              <h2 className="text-xs font-bold uppercase tracking-wider text-(--color-muted-foreground)">About This Service</h2>
              <div className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                {service.description || 'No description provided.'}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-4 bg-(--color-card) border border-(--color-border) p-6 rounded-(--radius-2xl) shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-(--color-foreground)">Customer Reviews</h2>
              {serviceReviews.count > 0 && (
                <span className="text-xs font-semibold text-(--color-muted-foreground)">
                  {serviceReviews.items.length} of {serviceReviews.count} shown
                </span>
              )}
            </div>
            <ReviewsList reviews={serviceReviews.items} />
            <LoadMoreButton
              hasMore={serviceReviews.hasMore}
              loadingMore={serviceReviews.loadingMore}
              onClick={serviceReviews.loadMore}
              loadedCount={serviceReviews.items.length}
              totalCount={serviceReviews.count}
            />
          </div>

          </div>

          {/* RIGHT 1 COLUMN: Sticky Booking Widget Sidebar (Aligned to top with Image) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) shadow-elevated p-6 space-y-6">
              
              {/* Pricing Display */}
              <div className="flex items-baseline justify-between pb-6 border-b border-(--color-border)">
                <div>
                  <span className="text-xs font-semibold text-(--color-muted-foreground) uppercase tracking-wider">Service Fee</span>
                  <div className="text-3xl font-extrabold text-(--color-foreground) mt-1">
                    {formatPrice(service)}
                  </div>
                </div>
                {service.duration && (
                  <span className="text-xs font-medium text-(--color-muted-foreground) bg-(--color-muted) px-2.5 py-1 rounded-full">
                    {service.duration}
                  </span>
                )}
              </div>

              {/* Booking Actions */}
              {!service.is_owner ? (
                <div className="space-y-4">
                  {requestSent ? (
                    <div className="p-4 rounded-(--radius-md) bg-(--color-success)/10 text-(--color-success) text-sm border border-(--color-success)/20 flex items-center gap-2.5 shadow-soft">
                      <CheckCircle2 size={18} className="text-(--color-accent) shrink-0" />
                      <span>Request sent successfully! Track it in your requests dashboard.</span>
                    </div>
                  ) : checkingExisting ? (
                    <div className="h-16 rounded-xl bg-(--color-muted) animate-pulse" />
                  ) : existingRequest ? (
   <div className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-900 dark:text-amber-200 text-sm border border-amber-500/30 dark:border-amber-500/40 space-y-3 shadow-soft">
    <div className="flex items-center gap-2 font-semibold">
      <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
      <span className="text-amber-900 dark:text-amber-200">Active Request Imminent</span>
    </div>
    <p className="text-xs text-amber-800/80 dark:text-amber-200/80">You have a pending/active booking for this service.</p>
    <Link 
      to={`/requests/${existingRequest.id}`} 
      className="block text-center w-full py-2 rounded-lg bg-(--color-card) font-semibold text-xs text-(--color-card-foreground) border border-amber-500/30 hover:bg-(--color-muted) transition-colors shadow-xs"
    >
      View Request Details
    </Link>
  </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={handleRequestClick}
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-(--color-primary) text-(--color-primary-foreground) text-sm font-bold shadow-elevated hover:opacity-95 transition-all cursor-pointer"
                      >
                        <Calendar size={18} />
                        Request This Service
                      </button>
                      <p className="text-[11px] text-center text-(--color-muted-foreground)">
                        You won't be charged until the provider accepts your request.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-(--color-muted) text-center text-xs text-(--color-muted-foreground) font-medium">
                  This is your own listed service.
                </div>
              )}

              {/* Quick Trust Checklist */}
              <div className="pt-4 border-t border-(--color-border) space-y-2.5 text-xs text-(--color-muted-foreground)">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-(--color-primary)" />
                  <span>Secure Escrow & OTP Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-(--color-accent)" />
                  <span>Verified Local Professionals</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Booking Modal */}
      {modalOpen && (
        <RequestServiceModal
          service={service}
          onClose={() => setModalOpen(false)}
          onSuccess={(created) => {
            setModalOpen(false);
            setRequestSent(true);
            setExistingRequest(created);
          }}
        />
      )}
    </div>
  );
}