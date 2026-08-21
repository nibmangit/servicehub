import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDateTime } from '../../lib/format';

export default function RequestCard({ request, perspective }) {
  // perspective: "customer" (I booked this) or "provider" (I received this)
  const otherParty = perspective === 'customer' ? request.provider_name || request.provider_email : request.customer_email;

  return (
    <Link
      to={`/requests/${request.id}`}
      className="block bg-(--color-card) border border-(--color-border) rounded-(--radius-lg) p-4 shadow-soft hover:shadow-elevated transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-(--color-foreground) truncate">{request.service_title}</p>
          <p className="text-sm text-(--color-muted-foreground) truncate">
            {perspective === 'customer' ? 'Provider' : 'From'}: {otherParty}
          </p>
          <p className="text-xs text-(--color-muted-foreground) flex items-center gap-1 mt-1.5">
            <Calendar size={12} /> {formatDateTime(request.preferred_date)}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>
    </Link>
  );
}