import React, { useState } from 'react';
import { User, Camera, X, Lock } from 'lucide-react';

export default function ProfileEditModal({ profile, isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const isProvider = profile?.is_provider;

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    city: profile?.city || '',
    bio: profile?.bio || '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar || null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const dataToSend = new FormData();
      
      // If user is a provider, only send bio updates (and keep old values for everything else)
      if (isProvider) {
        dataToSend.append('bio', formData.bio || '');
        // Note: If your Django backend requires full_name on PATCH requests, 
        // you can include it without changing state, or keep it as-is.
        dataToSend.append('full_name', profile.full_name);
        dataToSend.append('phone', profile.phone || '');
        dataToSend.append('city', profile.city || '');
      } else {
        // Customers can edit all standard fields
        dataToSend.append('full_name', formData.full_name);
        dataToSend.append('phone', formData.phone);
        dataToSend.append('city', formData.city);
        
        if (avatarFile) {
          dataToSend.append('avatar', avatarFile);
        }
      }

      await onSave(dataToSend);
      onClose();
    } catch (err) {
      console.error("Failed to update profile", err);
      setError(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-(--color-card) p-8 rounded-(--radius-2xl) border border-(--color-border) shadow-elevated max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-(--color-border)">
          <div>
            <h2 className="text-xl font-bold text-(--color-primary)">
              {isProvider ? 'Edit Professional Bio' : 'Edit Profile Details'}
            </h2>
            {isProvider && (
              <p className="text-xs text-(--color-muted-foreground) flex items-center gap-1 mt-0.5">
                <Lock size={12} /> Provider accounts can only update their bio here.
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-(--radius-md) text-(--color-muted-foreground) hover:bg-(--color-muted) cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-(--radius-md) bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Avatar Section: Disabled / Locked for Providers */}
          <div className="flex flex-col items-center mb-6">
            <div className={`relative w-24 h-24 rounded-full overflow-hidden bg-(--color-secondary) border border-(--color-border) ${isProvider ? 'opacity-75' : 'group'}`}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="m-auto text-(--color-muted-foreground)" />
              )}
              
              {!isProvider && (
                <>
                  <label htmlFor="modal-avatar-upload" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                    <Camera size={18} />
                  </label>
                  <input id="modal-avatar-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </>
              )}
            </div>
            <span className="text-xs text-(--color-muted-foreground) mt-2">
              {isProvider ? 'Avatar locked for service providers' : 'Click image to change avatar'}
            </span>
          </div>

          {/* Customer Fields (Read-only if Provider) */}
          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-foreground)">
              Full Name {isProvider && <span className="text-xs text-(--color-muted-foreground)">(Locked)</span>}
            </label>
            <input 
              type="text" 
              name="full_name"
              required
              disabled={isProvider}
              value={formData.full_name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 rounded-(--radius-md) border border-(--color-border) text-sm ${
                isProvider 
                  ? 'bg-(--color-secondary) text-(--color-muted-foreground) cursor-not-allowed' 
                  : 'bg-(--color-input) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">
                Phone Number {isProvider && <span className="text-xs text-(--color-muted-foreground)">(Locked)</span>}
              </label>
              <input 
                type="text" 
                name="phone"
                disabled={isProvider}
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-(--radius-md) border border-(--color-border) text-sm ${
                  isProvider 
                    ? 'bg-(--color-secondary) text-(--color-muted-foreground) cursor-not-allowed' 
                    : 'bg-(--color-input) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">
                City {isProvider && <span className="text-xs text-(--color-muted-foreground)">(Locked)</span>}
              </label>
              <input 
                type="text" 
                name="city"
                disabled={isProvider}
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-(--radius-md) border border-(--color-border) text-sm ${
                  isProvider 
                    ? 'bg-(--color-secondary) text-(--color-muted-foreground) cursor-not-allowed' 
                    : 'bg-(--color-input) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)'
                }`}
              />
            </div>
          </div>

          {/* Bio Field (Always editable since only providers have it or can update it) */}
          {isProvider && (
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Professional Bio</label>
              <textarea 
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Describe your professional background..."
                className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-(--color-border)">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-(--color-secondary) text-(--color-foreground) rounded-(--radius-md) font-medium text-sm hover:opacity-80 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-(--color-primary) text-(--color-primary-foreground) rounded-(--radius-md) font-medium text-sm hover:opacity-90 transition-all cursor-pointer shadow-soft disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}