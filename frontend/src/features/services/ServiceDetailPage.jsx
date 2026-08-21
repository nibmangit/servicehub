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

const ACTIVE_STATUSES = ['PENDING', 'ACCEPTED', 'IN_PROGRESS'];

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
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
        const [serviceData, reviewsData] = await Promise.all([
          servicesApi.getService(id),
          reviewsApi.getServiceReviews(id),
        ]);

        if (!cancelled) {
          setService(serviceData);
          setReviews(reviewsData.results || []);
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
      } catch (err) {
        // Fallback to clipboard
      }
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
    navigate(`/messages?provider=${service.provider_id || service.provider_email}`);
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
          <div className="p-4 rounded-lg bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20 shadow-soft">
            {error || 'Service not found.'}
          </div>
        </div>
      </div>
    );
  }

  const images = service.images || [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-(--color-background) py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">

        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-muted-foreground) hover:text-(--color-primary) transition-colors"
        >
          <ArrowLeft size={16} /> Back to Services
        </Link>

        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) shadow-elevated p-6 sm:p-8 space-y-6">

          {/* TOP SECTION: Title Info on Left, Share/Favorite Buttons on Right */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-(--color-border)">
            <div className="space-y-2">
              {service.category_detail && (
                <span className="text-xs font-semibold text-(--color-primary) bg-(--color-primary-soft) px-3 py-1 rounded-(--radius-md) tracking-wider uppercase">
                  {service.category_detail.name}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--color-foreground) mt-1">
                {service.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm text-(--color-muted-foreground)">
                <span className="flex items-center gap-1.5 font-medium text-(--color-foreground)">
                  <MapPin size={16} className="text-(--color-primary)" /> {service.location}
                </span>
                {service.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} className="text-(--color-muted-foreground)" /> {service.duration}
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

            {/* Share and Favorite Buttons & Price Tag */}
            <div className="flex items-center sm:flex-col sm:items-end justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                {shareFeedback && (
                  <span className="text-xs font-semibold text-(--color-primary) bg-(--color-primary-soft) px-2.5 py-1 rounded-full animate-fade-in">
                    Copied!
                  </span>
                )}
                <button
                  onClick={handleShare}
                  title="Share service"
                  className="p-2.5 rounded-lg bg-(--color-muted) border border-(--color-border) text-(--color-foreground) hover:bg-(--color-card) transition-all shadow-soft cursor-pointer"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                  className={`p-2.5 rounded-lg border transition-all shadow-soft cursor-pointer ${
                    isFavorite ? 'text-rose-500 bg-rose-500/10 border-rose-500/20' : 'bg-(--color-muted) border-(--color-border) text-(--color-foreground) hover:bg-(--color-card)'
                  }`}
                >
                  <Heart size={16} className={isFavorite ? 'fill-rose-500' : ''} />
                </button>
              </div>

              <div className="text-right sm:mt-2">
                <span className="text-[11px] font-semibold text-(--color-muted-foreground) uppercase tracking-wider">Fee: </span>
                <span className="text-xl font-bold text-(--color-foreground)">{formatPrice(service)}</span>
              </div>
            </div>
          </div>

          {/* BELOW HEADER: Image Gallery Section */}
          <div className="space-y-3">
            <div className="aspect-video bg-(--color-muted) rounded-xl overflow-hidden border border-(--color-border) shadow-soft">
              {images.length > 0 ? (
                <img src={images[activeImage].image} alt={service.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-(--color-muted-foreground) space-y-2">
                  <MapPin size={24} className="opacity-40" />
                  <span className="text-sm font-medium">No image preview available</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      i === activeImage ? 'border-(--color-primary) ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BELOW IMAGE: Provider Card & Direct Chat Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-(--color-muted) border border-(--color-border)">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-12 w-12 rounded-full bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center font-bold text-lg shadow-soft shrink-0">
                {service.provider_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-(--color-foreground) truncate">{service.provider_name || 'Service Provider'}</p>
                  <ShieldCheck size={15} className="text-(--color-primary) shrink-0" />
                </div>
                <p className="text-xs text-(--color-muted-foreground)">Verified Professional Provider</p>
              </div>
            </div>

            {!service.is_owner && (
              <button
                onClick={handleChatProvider}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-(--color-card) border border-(--color-border) text-(--color-foreground) hover:bg-(--color-muted) text-sm font-semibold transition-all shadow-soft cursor-pointer"
              >
                <MessageSquare size={16} className="text-(--color-primary)" />
                <span>Chat Provider</span>
              </button>
            )}
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-(--color-muted-foreground)">About This Service</h2>
            <div className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed p-4 rounded-xl bg-muted/50 border border-(--color-border)">
              {service.description || 'No description provided.'}
            </div>
          </div>

          {/* Booking Action Box */}
          {!service.is_owner && (
            <div className="pt-2">
              {requestSent ? (
                <div className="p-4 rounded-xl bg-(--color-primary-soft) text-(--color-primary) text-sm border border-primary/20 flex items-center gap-2.5 shadow-soft">
                  <CheckCircle2 size={18} />
                  <span>Request sent successfully! Track it under your "My Requests" tab.</span>
                </div>
              ) : checkingExisting ? (
                <div className="h-16 rounded-xl bg-(--color-muted) animate-pulse" />
              ) : existingRequest ? (
                <div className="p-4 rounded-xl bg-(--color-primary-soft) text-(--color-primary) text-sm border border-primary/20 flex flex-wrap items-center justify-between gap-3 shadow-soft">
                  <span className="flex items-center gap-2.5">
                    <AlertCircle size={18} />
                    You already have a pending or active request for this service.
                  </span>
                  <Link to={`/requests/${existingRequest.id}`} className="font-semibold underline shrink-0">
                    View Request
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-(--color-primary-soft) border border-primary/20">
                  <div>
                    <h3 className="text-sm font-semibold text-(--color-primary)">Ready to book this service?</h3>
                    <p className="text-xs text-(--color-muted-foreground) mt-0.5">Select a preferred date and send a custom request.</p>
                  </div>
                  <button
                    onClick={handleRequestClick}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-(--color-primary) text-(--color-primary-foreground) text-sm font-semibold shadow-soft hover:opacity-90 transition-all cursor-pointer shrink-0"
                  >
                    <Calendar size={16} />
                    Request This Service
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reviews List Section */}
          <div className="space-y-4 pt-6 border-t border-(--color-border)">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-(--color-foreground)">Customer Reviews</h2>
              {service.review_count > 0 && (
                <span className="text-xs font-semibold text-(--color-muted-foreground)">
                  Showing {reviews.length} of {service.review_count} reviews
                </span>
              )}
            </div>
            <ReviewsList reviews={reviews} />
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