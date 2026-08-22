import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { servicesApi } from '../../services/servicesApi';
import MyServiceCard from '../../components/services/MyServiceCard';
import EmptyState from '../../components/common/EmptyState';

export default function MyServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    servicesApi.getMyServices()
      .then((data) => { if (!cancelled) setServices(data.results || data); })
      .catch(() => { if (!cancelled) setError('Could not load your services.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (service) => {
    if (!window.confirm(`Delete "${service.title}"? This can't be undone.`)) return;
    try {
      await servicesApi.deleteService(service.id);
      setServices((prev) => prev.filter((s) => s.id !== service.id));
    } catch (err) {
      alert('Could not delete this service. It may have active requests tied to it.');
    }
  };

  const handleToggleActive = async (service) => {
    try {
      const updated = await servicesApi.updateService(service.id, { is_active: !service.is_active });
      setServices((prev) => prev.map((s) => (s.id === service.id ? updated : s)));
    } catch (err) {
      alert('Could not update this service.');
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--color-foreground)">My Services</h1>
          <p className="text-(--color-muted-foreground) mt-1">Manage the services you offer.</p>
        </div>
        <Link
          to="/my-services/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-(--radius-md) bg-(--color-primary) text-(--color-primary-foreground) text-sm font-medium hover:opacity-95 transition-opacity shrink-0"
        >
          <Plus size={16} /> Add Service
        </Link>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-(--radius-md) bg-destructive/10 text-(--color-destructive) text-sm border border-destructive/20">
          {error}
        </div>
      ) : services.length === 0 ? (
        <EmptyState message="You haven't listed any services yet." />
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <MyServiceCard
              key={service.id}
              service={service}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}