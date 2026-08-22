import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, DollarSign, User, ShieldCheck, Clock } from 'lucide-react';
import { requestsApi } from '../../services/requestsApi';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDateTime } from '../../lib/format';
import ProviderActions from '../../components/requests/ProviderActions';
import CustomerActions from '../../components/requests/CustomerActions';
import ReviewDisplay from '../../components/reviews/ReviewDisplay';
import ReviewForm from '../../components/reviews/ReviewForm';

export default function RequestDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    requestsApi.getRequest(id)
      .then((data) => { if (!cancelled) setRequest(data); })
      .catch(() => { if (!cancelled) setError('Could not load this request.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-10 w-10 rounded-full border-3 border-(--color-border) border-t-(--color-primary) animate-spin" />
          <p className="text-xs text-(--color-muted-foreground) font-medium">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-(--color-background) py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="p-4 rounded-lg bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20 shadow-soft">
            {error || 'Request not found.'}
          </div>
        </div>
      </div>
    );
  }

  const isCustomer = request.customer_email === user?.email;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-(--color-background) py-8 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto space-y-6">
        
        {/* Back Link */}
        <Link 
          to="/requests" 
          className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-muted-foreground) hover:text-(--color-primary) transition-colors"
        >
          <ArrowLeft size={16} /> Back to Requests
        </Link>

        {/* Main Details Card */}
        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) shadow-elevated p-6 sm:p-8 space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-(--color-border)">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-(--color-primary) uppercase tracking-wider">Service Request #{request.id}</span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--color-foreground)">
                {request.service_title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-(--color-muted-foreground) pt-1">
                <User size={15} className="text-(--color-primary)" />
                <span>
                  {isCustomer ?(
                      <>
                        Provider: <Link to={`/providers/${request.provider}`} className="text-(--color-primary) hover:underline">{request.provider_name || request.provider_email}</Link>
                      </>
                    ): (
                      `Customer: ${request.customer_email}`
                    )}
                </span>
              </div>
            </div>
            <div>
              <StatusBadge status={request.status} />
            </div>
          </div>

          {/* Grid Information Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Preferred Date Card */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-(--color-muted) border border-(--color-border) lg:col-span-1">
            <div className="p-2.5 rounded-lg bg-(--color-card) text-(--color-primary) shadow-soft">
            <Calendar size={18} />
            </div>
            <div>
            <p className="text-[11px] font-medium text-(--color-muted-foreground) uppercase tracking-wider">Preferred Date</p>
            <p className="text-sm font-semibold text-(--color-foreground) mt-0.5">{formatDateTime(request.preferred_date)}</p>
            </div>
        </div>

        {/* Agreed Price Card */}
        {request.agreed_price != null && (
            <div className="flex items-center gap-3 p-4 rounded-(--radius-xl) bg-(--color-muted) border border-(--color-border) lg:col-span-1">
            <div className="p-2.5 rounded-(--radius-lg) bg-(--color-card) text-(--color-accent) shadow-soft">
                <DollarSign size={18} />
            </div>
            <div>
                <p className="text-[11px] font-medium text-(--color-muted-foreground) uppercase tracking-wider">Agreed Price</p>
                <p className="text-sm font-semibold text-(--color-foreground) mt-0.5">{Number(request.agreed_price).toLocaleString()} ETB</p>
            </div>
            </div>
        )}

        {/* Service Location Card */}
        {request.address && (
            <div className={`flex items-center gap-3 p-4 rounded-xl bg-(--color-muted) border border-(--color-border) ${request.agreed_price != null ? 'sm:col-span-2 lg:col-span-1' : 'sm:col-span-1 lg:col-span-1'}`}>
            <div className="p-2.5 rounded-lg bg-(--color-card) text-(--color-primary) shadow-soft shrink-0">
                <MapPin size={18} />
            </div>
            <div>
                <p className="text-[11px] font-medium text-(--color-muted-foreground) uppercase tracking-wider">Service Location</p>
                <p className="text-sm font-semibold text-(--color-foreground) mt-0.5">{request.address}</p>
            </div>
            </div>
        )}
        </div>

          {/* Description Section */}
          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-semibold text-(--color-foreground)">Request Description</h2>
            <div className="p-4 rounded-xl bg-muted/50 border border-(--color-border) text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
              {request.description || 'No description provided.'}
            </div>
          </div>

          {/* Rejection Notification Box */}
          {request.status === 'REJECTED' && request.rejection_reason && (
            <div className="p-4 rounded-xl bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20 shadow-soft space-y-1">
              <strong className="block font-semibold">Rejection Reason:</strong>
              <p>{request.rejection_reason}</p>
            </div>
          )}

          {request.status === 'COMPLETED' && (
            <div className="pt-2 border-t border-(--color-border)">
                {request.review && (
                <ReviewDisplay review={request.review} />
                )  }
            </div>
            )}

          {/* Completion Info Box */}
          {request.status === 'COMPLETED' && isCustomer && (
            <div className="pt-2 border-t border-(--color-border)">
                {!request.review && (
                <ReviewForm
                    requestId={request.id}
                    onSubmitted={(review) => setRequest((prev) => ({ ...prev, review }))}
                />
                )}
            </div>
            )}

          {/* Action Trigger Controls */}
          <div className="pt-4 border-t border-(--color-border)">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-(--color-muted-foreground) mb-3">
              {isCustomer ? 'Customer Controls' : 'Provider Controls'}
            </h3>
            {isCustomer ? (
              <CustomerActions request={request} onUpdated={setRequest} />
            ) : (
              <ProviderActions request={request} onUpdated={setRequest} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}