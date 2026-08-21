import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-average_rating', label: 'Top Rated' },
];

export default function FiltersBar({ categories, filters, onChange }) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onChange({ ...filters, search: searchInput, page: 1 });
  };

  const handleFieldChange = (field) => (e) => {
    onChange({ ...filters, [field]: e.target.value, page: 1 });
  };
 
  const hasActiveFilters = Boolean(filters.category || filters.price_type || filters.min_price);

  return (
    <div className="bg-(--color-card) border border-(--color-border) rounded-lg p-4 shadow-soft">
       
      <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-3">
        
        {/* Search Input Bar & Mobile Toggle */}
        <div className="relative flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted-foreground)" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-9 pr-3 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-(--radius-md) bg-(--color-primary) text-(--color-primary-foreground) text-sm font-medium hover:opacity-95 transition-opacity shrink-0 cursor-pointer"
          >
            Search
          </button>

          {/* Mobile Filter Toggle Button (hidden on large screens) */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={`lg:hidden relative px-3.5 py-2.5 rounded-(--radius-md) border border-(--color-border) text-sm font-medium flex items-center gap-2 transition-colors shrink-0 cursor-pointer ${
              mobileFiltersOpen || hasActiveFilters
                ? 'bg-(--color-primary-soft) text-(--color-primary) border-(--color-primary)/30'
                : 'bg-(--color-input) text-(--color-foreground) hover:bg-(--color-muted)'
            }`}
            aria-label="Toggle Filters"
          >
            <SlidersHorizontal size={16} />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-(--color-primary)" />
            )}
          </button>
        </div>
 
        <div
          className={`${
            mobileFiltersOpen ? 'grid' : 'hidden'
          } lg:flex grid-cols-1 sm:grid-cols-2 lg:items-center gap-3 pt-2 lg:pt-0 border-t border-(--color-border) lg:border-t-0`}
        >
          <select
            value={filters.category}
            onChange={handleFieldChange('category')}
            className="px-3 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring) lg:w-44"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={filters.price_type}
            onChange={handleFieldChange('price_type')}
            className="px-3 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring) lg:w-40"
          >
            <option value="">Any Price Type</option>
            <option value="fixed">Fixed</option>
            <option value="hourly">Hourly</option>
            <option value="negotiable">Negotiable</option>
          </select>

          <input
            type="number"
            min="0"
            placeholder="Min price"
            value={filters.min_price}
            onChange={handleFieldChange('min_price')}
            className="px-3 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring) lg:w-32"
          />

          <select
            value={filters.ordering}
            onChange={handleFieldChange('ordering')}
            className="px-3 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring) lg:w-44"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

      </form>
    </div>
  );
}