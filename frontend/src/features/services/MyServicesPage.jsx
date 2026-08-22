import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase } from 'lucide-react';
import { servicesApi } from '../../services/servicesApi';
import MyServiceCard from '../../components/services/MyServiceCard';
import EmptyState from '../../components/common/EmptyState';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

export default function MyServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    servicesApi.getMyServices()
      .then((data) => { if (!cancelled) setServices(data.results || data); })
      .catch(() => { if (!cancelled) setError('Could not load your services.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    try {
      await servicesApi.deleteService(serviceToDelete.id);
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      setServiceToDelete(null);
    } catch (err) {
      alert('Could not delete this service. It may have active requests tied to it.');
    } finally {
      setIsDeleting(false);
    }
  };

  

  const handleToggleActive = async (service) => {
    try {
      const updated = await servicesApi.updateService(service.id, { is_active: !service.is_active });
      setServices((prev) => prev.map((s) => (s.id === service.id ? updated : s)));
    } catch (err) {
      alert('Could not update this service status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1"> 
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-(--color-foreground)">
            My Services
          </h1>
          <p className="text-xs sm:text-sm text-(--color-muted-foreground)">
            Manage your service listings, adjust pricing, or toggle availability.
          </p>
        </div>

        <Link
          to="/my-services/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-(--color-primary) text-(--color-primary-foreground) text-sm font-semibold shadow-soft hover:opacity-95 transition-all shrink-0 cursor-pointer"
        >
          <Plus size={18} /> Add New Service
        </Link>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
          <p className="text-xs text-(--color-muted-foreground) font-medium">Loading your services...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20 shadow-soft">
          {error}
        </div>
      ) : services.length === 0 ? (
        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) p-12 shadow-soft">
          <EmptyState message="You haven't listed any services yet. Create your first listing to start receiving requests!" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {services.map((service) => (
            <MyServiceCard
              key={service.id}
              service={service}
              onDelete={handleDeleteClick}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={Boolean(serviceToDelete)}
        title={`Delete "${serviceToDelete?.title}"?`}
        message="Are you sure you want to delete this listing? Clients will no longer be able to view or request it."
        onClose={() => !isDeleting && setServiceToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}