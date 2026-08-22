import { useRef, useState } from 'react';
import { X, Upload } from 'lucide-react';
import { servicesApi } from '../../services/servicesApi';

export default function ServiceImageManager({ serviceId, images, onImagesChange }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError('');
    setUploading(true);
    try { 
      const uploaded = [];
      for (const file of files) {
        const image = await servicesApi.uploadServiceImage(serviceId, file);
        uploaded.push(image);
      }
      onImagesChange([...images, ...uploaded]);
    } catch (err) {
      setError('Some images failed to upload. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await servicesApi.deleteServiceImage(imageId);
      onImagesChange(images.filter((img) => img.id !== imageId));
    } catch (err) {
      setError('Could not delete that image.');
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-(--color-foreground)">Photos</label>

      {error && (
        <div className="p-3 rounded-(--radius-md) bg-destructive/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative h-24 w-24 rounded-(--radius-md) overflow-hidden border border-(--color-border) group">
            <img src={img.image} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleDelete(img.id)}
              aria-label="Remove image"
              className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="h-24 w-24 rounded-(--radius-md) border-2 border-dashed border-(--color-border) flex flex-col items-center justify-center gap-1 text-(--color-muted-foreground) hover:border-(--color-primary) hover:text-(--color-primary) transition-colors disabled:opacity-50"
        >
          <Upload size={18} />
          <span className="text-xs">{uploading ? 'Uploading...' : 'Add'}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelected}
        className="hidden"
      />
    </div>
  );
}