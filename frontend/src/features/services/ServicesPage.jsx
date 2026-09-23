import { useEffect, useState } from 'react';
import { servicesApi } from '../../services/servicesApi';
import { categoriesApi } from '../../services/categoriesApi';
import { usePaginatedResource } from '../../lib/usePaginatedResource';
import FiltersBar from '../../components/services/FiltersBar';
import ServiceCard from '../../components/services/ServiceCard';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';

const PAGE_SIZE = 12;

const DEFAULT_FILTERS = {
  search: '',
  category: '',
  price_type: '',
  min_price: '',
  ordering: '-created_at',
};

export default function ServicesPage() {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const services = usePaginatedResource(servicesApi.getServices, filters);

  useEffect(() => {
    categoriesApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-(--color-foreground)">Browse Services</h1>
        <p className="text-(--color-muted-foreground) mt-1">Find trusted local providers near you.</p>
      </div>

      <FiltersBar categories={categories} filters={filters} onChange={setFilters} />

      {services.loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
        </div>
      ) : services.error ? (
        <div className="p-4 rounded-(--radius-md) bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
          {services.error}
        </div>
      ) : services.items.length === 0 ? (
        <EmptyState message="No services match your filters. Try adjusting them." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {services.items.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <Pagination
            page={services.page}
            pageSize={PAGE_SIZE}
            count={services.count}
            onPageChange={services.goToPage}
          />
        </>
      )}
    </div>
  );
}