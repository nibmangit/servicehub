import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
  const { id } = useParams(); // undefined when creating
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [service, setService] = useState(null); // set once created, or when editing
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
    setSubmitting(true);

    try {
      if (isEditing) {
        const updated = await servicesApi.updateService(id, buildPayload());
        setService(updated);
      } else {
        const created = await servicesApi.createService(buildPayload());
        setService(created); 
      }
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not save this service.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 flex justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link to="/my-services" className="inline-flex items-center gap-1.5 text-sm text-(--color-muted-foreground) hover:text-(--color-foreground) transition-colors">
        <ArrowLeft size={14} /> Back to My Services
      </Link>

      <h1 className="text-2xl font-bold text-(--color-foreground)">
        {isEditing ? 'Edit Service' : 'New Service'}
      </h1>

      {error && (
        <div className="p-3 rounded-(--radius-md) bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-(--color-card) border border-(--color-border) rounded-(--radius-lg) shadow-soft p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Title *</label>
          <input
            type="text" name="title" required value={formData.title} onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Description *</label>
          <textarea
            name="description" required rows="4" value={formData.description} onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Category</label>
            <select
              name="category" value={formData.category} onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Location *</label>
            <input
              type="text" name="location" required value={formData.location} onChange={handleChange}
              placeholder="e.g. Bole, Addis Ababa"
              className="w-full px-3.5 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Price Type</label>
            <select
              name="price_type" value={formData.price_type} onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            >
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </div>

          {formData.price_type !== 'negotiable' && (
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Price (ETB) *</label>
              <input
                type="number" name="price" min="0" required value={formData.price} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Duration</label>
            <input
              type="text" name="duration" value={formData.duration} onChange={handleChange}
              placeholder="e.g. 2 hours"
              className="w-full px-3.5 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-(--radius-md) bg-(--color-primary) text-(--color-primary-foreground) text-sm font-medium hover:opacity-95 transition-opacity disabled:opacity-50"
        >
          {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Service'}
        </button>
      </form>

      {service && (
        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-lg) shadow-soft p-6">
          <ServiceImageManager
            serviceId={service.id}
            images={images}
            onImagesChange={setImages}
          />
        </div>
      )}
    </div>
  );
}