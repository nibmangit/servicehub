import React, { useState } from 'react';
import { profileApi } from '../../services/profileApi';

export default function CompleteProfileModal({ profile, onProfileUpdated }) { 
  
  if (profile && profile.full_name && profile.full_name.trim() !== '') {
    return null;
  }

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    city: profile?.city || '',
    bio: profile?.bio || '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const updated = await profileApi.updateMyProfile(formData);
      onProfileUpdated(updated); // Refresh parent state
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-(--color-card) p-8 rounded-2xl border border-(--color-border) shadow-elevated animate-in fade-in zoom-in duration-200">
        
        <div className="text-center mb-6">
          <span className="text-3xl mb-2 inline-block">👋</span>
          <h2 className="text-2xl font-bold text-(--color-primary)">Complete Your Profile</h2>
          <p className="text-sm text-(--color-muted-foreground) mt-1">
            Welcome! Please take a moment to fill in your profile details to get started on the platform.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-(--radius-md) bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Full Name *</label>
            <input 
              type="text" 
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Abebe Kebede"
              className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Phone Number</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+2519xxxxxxxx"
                className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">City</label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Bahir Dar"
                className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Short Bio</label>
            <textarea 
              name="bio"
              rows="2"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell others a bit about yourself..."
              className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full mt-2 bg-(--color-primary) text-(--color-primary-foreground) py-2.5 rounded-(--radius-md) font-medium hover:opacity-95 transition-all cursor-pointer shadow-soft disabled:opacity-50 text-sm"
          >
            {submitting ? 'Saving Profile...' : 'Save & Continue to Dashboard'}
          </button>
        </form>

      </div>
    </div>
  );
}