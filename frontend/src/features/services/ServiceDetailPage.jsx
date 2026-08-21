import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock } from 'lucide-react';
import { servicesApi } from '../../services/servicesApi';
import { reviewsApi } from '../../services/reviewsApi'
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../lib/priceFormat';
import RequestServiceModal from '../../components/requests/RequestServiceModal';
import ReviewsList from '../../components/reviews/ReviewsList'

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
          setReviews(reviewsData.results);
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

  const handleRequestClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="p-4 rounded-(--radius-md) bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
          {error || 'Service not found.'}
        </div>
      </div>
    );
  }

  const images = service.images || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <div className="aspect-video bg-(--color-muted) rounded-lg overflow-hidden">
          {images.length > 0 ? (
            <img src={images[activeImage].image} alt={service.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-(--color-muted-foreground)">
              No image available
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-2">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 rounded-(--radius-md) overflow-hidden border-2 transition-colors ${
                  i === activeImage ? 'border-(--color-primary)' : 'border-transparent'
                }`}
              >
                <img src={img.image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          {service.category_detail && (
            <span className="text-xs font-medium text-(--color-primary) bg-(--color-primary-soft) px-2 py-0.5 rounded-sm">
              {service.category_detail.name}
            </span>
          )}
          <h1 className="text-2xl font-bold text-(--color-foreground) mt-2">{service.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-(--color-muted-foreground)">
            <span className="flex items-center gap-1"><MapPin size={14} /> {service.location}</span>
            {service.duration && <span className="flex items-center gap-1"><Clock size={14} /> {service.duration}</span>}
            {service.review_count > 0 && (
              <span className="flex items-center gap-1">
                <Star size={14} className="text-(--color-warning) fill-(--color-warning)" />
                {service.average_rating.toFixed(1)} ({service.review_count} reviews)
              </span>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xl font-bold text-(--color-foreground)">{formatPrice(service)}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-(--color-card) border border-(--color-border)">
        <div className="h-10 w-10 rounded-full bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center font-semibold shrink-0">
          {service.provider_name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-(--color-foreground) truncate">{service.provider_name || 'Provider'}</p>
          <p className="text-xs text-(--color-muted-foreground)">Service Provider</p>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-(--color-foreground) mb-2">Description</h2>
        <p className="text-foreground/90 whitespace-pre-line">{service.description}</p>
      </div>

      {!service.is_owner && (
        <div>
          {requestSent ? (
            <div className="p-4 rounded-(--radius-md) bg-(--color-success)/10 text-(--color-success) text-sm border border-(--color-success)/20">
              Request sent! The provider will respond soon — you'll find it under "My Requests".
            </div>
          ) : (
            <button
              onClick={handleRequestClick}
              className="w-full sm:w-auto px-6 py-3 rounded-(--radius-md) bg-(--color-primary) text-(--color-primary-foreground) font-medium hover:opacity-95 transition-opacity"
            >
              Request This Service
            </button>
          )}
        </div>
      )}

      <div>
        <h2 className="font-semibold text-(--color-foreground) mb-2">Reviews</h2>
        <ReviewsList reviews={reviews} />
      </div>

      {modalOpen && (
        <RequestServiceModal
          service={service}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
            setRequestSent(true);
          }}
        />
      )}
    </div>
  );
}