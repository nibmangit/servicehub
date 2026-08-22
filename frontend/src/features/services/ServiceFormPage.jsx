import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { servicesApi } from '../../services/servicesApi';
import { categoriesApi } from '../../services/categoriesApi';
import { extractErrorMessage } from '../../lib/errorFormat';
import ServiceImageManager from '../../components/services/ServiceImageManager';

const EMPTY_FORM = {
  title: '',
  description: '',
  location: '',
  category: '',
  price_type: 'negotiable',
  price: '',
  duration: '',
};

export default function ServiceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [service, setService] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    categoriesApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    let cancelled = false;
    servicesApi.getService(id)
      .then((data) => {
        if (cancelled) return;
        setService(data);
        setImages(data.images || []);
        setFormData({
          title: data.title,
          description: data.description,
          location: data.location,
          category: data.category || '',
          price_type: data.price_type,
          price: data.price || '',
          duration: data.duration || '',
        });
      })
      .catch(() => { if (!cancelled) setError('Could not load this service.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => ({
    ...formData,
    category: formData.category || null,
    price: formData.price_type === 'negotiable' ? null : formData.price,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setSubmitting(true);

    try {
      if (isEditing) {
        const updated = await servicesApi.updateService(id, buildPayload());
        setService(updated);
        setSuccessMessage('Service updated successfully!');
      } else {
        const created = await servicesApi.createService(buildPayload());
        setService(created); 
        setSuccessMessage('Service created successfully! You can now upload gallery photos on the right.');
      }
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not save this service.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
        <p className="text-xs text-(--color-muted-foreground) font-medium">Loading service details...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      
      {/* Back Link */}
      <Link 
        to="/my-services" 
        className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-muted-foreground) hover:text-(--color-primary) transition-colors"
      >
        <ArrowLeft size={16} /> Back to My Services
      </Link>

      {/* Header Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-(--color-foreground)">
          {isEditing ? 'Edit Service Listing' : 'Create New Service'}
        </h1>
        <p className="text-xs sm:text-sm text-(--color-muted-foreground) mt-1">
          {isEditing ? 'Update your service offering details and pricing.' : 'Fill out the core information and upload photos to list your service.'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20 shadow-soft">
          {error}
        </div>
      )}

      {/* Success Banner Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-sm border border-emerald-500/30 flex items-center gap-2.5 shadow-soft animate-fade-in">
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">{successMessage}</span>
        </div>
        )}

      {/* DYNAMIC LAYOUT: Full-width when creating, Two-Column when service object exists */}
      <div className={`grid grid-cols-1 ${service ? 'lg:grid-cols-12' : 'mx-auto'} gap-8 items-start`}>
        
        {/* Left Form Panel */}
        <div className={service ? 'lg:col-span-7 space-y-6' : 'w-full'}>
          <form onSubmit={handleSubmit} className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) shadow-elevated p-6 sm:p-8 space-y-6">
            
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-(--color-muted-foreground)">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1.5 text-(--color-foreground)">Service Title *</label>
                <input
                  type="text" 
                  name="title" 
                  required 
                  value={formData.title} 
                  onChange={handleChange}
                  placeholder="e.g. Professional Home Plumbing & Leak Repair"
                  className="w-full px-4 py-3 rounded-xl bg-(--color-input) border border-(--color-border) text-(--color-foreground) placeholder:text-(--color-muted-foreground)/60 focus:outline-none focus:ring-2 focus:ring-(--color-ring) transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-(--color-foreground)">Description *</label>
                <textarea
                  name="description" 
                  required 
                  rows="5" 
                  value={formData.description} 
                  onChange={handleChange}
                  placeholder="Describe what your service entails..."
                  className="w-full px-4 py-3 rounded-xl bg-(--color-input) border border-(--color-border) text-(--color-foreground) placeholder:text-(--color-muted-foreground)/60 focus:outline-none focus:ring-2 focus:ring-(--color-ring) transition-all text-sm leading-relaxed"
                />
              </div>
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-(--color-border)">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-(--color-foreground)">Category</label>
                <select
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  style={{ backgroundColor: 'var(--color-input)', color: 'var(--color-foreground)' }}
                  className="w-full px-4 py-3 rounded-xl border border-(--color-border) focus:outline-none focus:ring-2 focus:ring-(--color-ring) transition-all text-sm cursor-pointer"
                >
                  <option value="" style={{ backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option 
                      key={cat.id} 
                      value={cat.id} 
                      style={{ backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-(--color-foreground)">Location *</label>
                <input
                  type="text" 
                  name="location" 
                  required 
                  value={formData.location} 
                  onChange={handleChange}
                  placeholder="e.g. Bahir Dar, Kebele 4"
                  className="w-full px-4 py-3 rounded-xl bg-(--color-input) border border-(--color-border) text-(--color-foreground) placeholder:text-(--color-muted-foreground)/60 focus:outline-none focus:ring-2 focus:ring-(--color-ring) transition-all text-sm"
                />
              </div>
            </div>

            {/* Pricing & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-(--color-border)">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-(--color-foreground)">Price Type</label>
                <select
                  name="price_type" 
                  value={formData.price_type} 
                  onChange={handleChange}
                  style={{ backgroundColor: 'var(--color-input)', color: 'var(--color-foreground)' }}
                  className="w-full px-4 py-3 rounded-xl border border-(--color-border) focus:outline-none focus:ring-2 focus:ring-(--color-ring) transition-all text-sm cursor-pointer"
                >
                  <option value="fixed" style={{ backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}>Fixed Price</option>
                  <option value="hourly" style={{ backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}>Hourly Rate</option>
                  <option value="negotiable" style={{ backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}>Negotiable</option>
                </select>
              </div>

              {formData.price_type !== 'negotiable' ? (
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-(--color-foreground)">Price (ETB) *</label>
                  <input
                    type="number" 
                    name="price" 
                    min="0" 
                    required 
                    value={formData.price} 
                    onChange={handleChange}
                    placeholder="e.g. 500"
                    className="w-full px-4 py-3 rounded-xl bg-(--color-input) border border-(--color-border) text-(--color-foreground) placeholder:text-(--color-muted-foreground)/60 focus:outline-none focus:ring-2 focus:ring-(--color-ring) transition-all text-sm"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-end pb-1">
                  <span className="text-xs text-(--color-muted-foreground) italic">Price discussed with client.</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5 text-(--color-foreground)">Duration</label>
                <input
                  type="text" 
                  name="duration" 
                  value={formData.duration} 
                  onChange={handleChange}
                  placeholder="e.g. 2 hours"
                  className="w-full px-4 py-3 rounded-xl bg-(--color-input) border border-(--color-border) text-(--color-foreground) placeholder:text-(--color-muted-foreground)/60 focus:outline-none focus:ring-2 focus:ring-(--color-ring) transition-all text-sm"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-(--color-border)">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-(--color-primary) text-(--color-primary-foreground) text-sm font-semibold shadow-soft hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles size={16} />
                {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Save Service Details'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Image Manager Sticky Panel (Appears once service ID is established) */}
        {service && (
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4 animate-fade-in">
            <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) shadow-elevated p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-(--color-border)">
                <ImageIcon size={20} className="text-(--color-primary)" />
                <h2 className="text-base font-bold text-(--color-foreground)">Service Gallery Photos</h2>
              </div>
              <p className="text-xs text-(--color-muted-foreground) leading-relaxed">
                Add photos showcasing your work. The first photo will act as the primary card cover thumbnail.
              </p>
              <ServiceImageManager
                serviceId={service.id}
                images={images}
                onImagesChange={setImages}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}