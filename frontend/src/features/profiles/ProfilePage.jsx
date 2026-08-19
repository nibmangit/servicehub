import React, { useState, useEffect } from 'react';
import { profileApi } from '../../services/profileApi';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [application, setApplication] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '', city: '', bio: '' });
  
  // Fayda Form State
  const [fin, setFin] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Provider Application Form State
  const [appForm, setAppForm] = useState({ experience_years: '', professional_summary: '', skills: [] });
  const [submittingApp, setSubmittingApp] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [profData, idData, appData, skillsData] = await Promise.all([
        profileApi.getMyProfile().catch(() => null),
        profileApi.getIdentityStatus().catch(() => null),
        profileApi.getProviderApplicationStatus().catch(() => null),
        profileApi.getSkills().catch(() => []),
      ]);

      setProfile(profData);
      if (profData) {
        setProfileForm({
          full_name: profData.full_name || '',
          phone: profData.phone || '',
          city: profData.city || '',
          bio: profData.bio || '',
        });
      }
      setIdentity(idData);
      setApplication(appData);
      setSkills(skillsData);
    } catch (err) {
      console.error("Error loading profile details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const updated = await profileApi.updateMyProfile(profileForm);
      setProfile(updated);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleFaydaVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setMessage({ type: '', text: '' });
    try {
      await profileApi.verifyFayda({ fin });
      setMessage({ type: 'success', text: 'Fayda ID verified successfully! Your profile details have been synced.' });
      setFin('');
      loadAllData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Verification failed. Check your FIN number.' });
    } finally {
      setVerifying(false);
    }
  };

  const handleApplyProvider = async (e) => {
    e.preventDefault();
    setSubmittingApp(true);
    setMessage({ type: '', text: '' });
    try {
      await profileApi.applyProvider(appForm);
      setMessage({ type: 'success', text: 'Provider application submitted successfully! Waiting for admin review.' });
      loadAllData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Application submission failed.' });
    } finally {
      setSubmittingApp(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-(--color-muted-foreground)">Loading your profile workspace...</div>;
  }

  const isVerified = identity?.status === 'verified' || identity?.verified;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
      {/* Header & Feedback Alert */}
      <div>
        <h1 className="text-3xl font-bold text-(--color-primary)">Profile & Identity Hub</h1>
        <p className="text-sm text-(--color-muted-foreground) mt-1">Manage your account information, verify via Fayda, and apply to become a service provider.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-(--radius-md) text-sm font-medium ${
          message.type === 'error' 
            ? 'bg-(--color-destructive)/10 text-(--color-destructive) border border-(--color-destructive)/20' 
            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
        }`}>
          {message.text}
        </div>
      )}

      {/* 1. User Profile Section */}
      <div className="bg-(--color-card) p-8 rounded-(--radius-2xl) border border-(--color-border) shadow-elevated">
        <h2 className="text-xl font-bold text-(--color-foreground) mb-4">Personal Information</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Full Name</label>
              <input 
                type="text" 
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Phone Number</label>
              <input 
                type="text" 
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">City</label>
              <input 
                type="text" 
                value={profileForm.city}
                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Bio</label>
              <input 
                type="text" 
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="px-5 py-2 bg-(--color-primary) text-(--color-primary-foreground) rounded-(--radius-md) font-medium hover:opacity-90 transition-all cursor-pointer shadow-soft text-sm"
          >
            Save Profile
          </button>
        </form>
      </div>

      {/* 2. Fayda Digital ID Verification Section */}
      <div className="bg-(--color-card) p-8 rounded-(--radius-2xl) border border-(--color-border) shadow-elevated">
        <h2 className="text-xl font-bold text-(--color-foreground) mb-2">Fayda Digital ID Verification</h2>
        <p className="text-sm text-(--color-muted-foreground) mb-6">National digital identity verification is required before applying to become a service provider.</p>

        {isVerified ? (
          <div className="p-4 rounded-(--radius-xl) bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-between">
            <span>✅ Identity Verified via Fayda (FIN: {identity?.fin || 'Verified'})</span>
            <span className="text-xs bg-emerald-500/20 px-2.5 py-1 rounded-full">Secure</span>
          </div>
        ) : (
          <form onSubmit={handleFaydaVerify} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Fayda Identification Number (FIN)</label>
              <input 
                type="text" 
                required
                value={fin}
                onChange={(e) => setFin(e.target.value)}
                placeholder="Enter FIN code"
                className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
              />
            </div>
            <button 
              type="submit" 
              disabled={verifying}
              className="px-6 py-2.5 bg-(--color-primary) text-(--color-primary-foreground) rounded-(--radius-md) font-medium hover:opacity-90 transition-all cursor-pointer shadow-soft disabled:opacity-50 text-sm"
            >
              {verifying ? 'Verifying with Fayda...' : 'Verify FIN'}
            </button>
          </form>
        )}
      </div>

      {/* 3. Provider Application Section */}
      <div className="bg-(--color-card) p-8 rounded-(--radius-2xl) border border-(--color-border) shadow-elevated">
        <h2 className="text-xl font-bold text-(--color-foreground) mb-2">Service Provider Application</h2>
        <p className="text-sm text-(--color-muted-foreground) mb-6">Offer your services on the platform after admin review.</p>

        {!isVerified ? (
          <div className="p-4 rounded-(--radius-xl) bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-medium">
            ⚠️ You must complete your Fayda ID verification above before you can apply to become a provider.
          </div>
        ) : application?.status === 'pending' ? (
          <div className="p-4 rounded-(--radius-xl) bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
            ⏳ Your provider application is currently **Pending** admin review.
          </div>
        ) : application?.status === 'approved' ? (
          <div className="p-4 rounded-(--radius-xl) bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            🎉 Congratulations! Your provider application has been **Approved**. You can now manage your service listings.
          </div>
        ) : (
          <form onSubmit={handleApplyProvider} className="space-y-4">
            {application?.status === 'rejected' && (
              <div className="p-4 rounded-(--radius-xl) bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm mb-4">
                ❌ Your previous application was rejected. Reason: {application.rejection_reason || 'Not specified'}. You may reapply below.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Years of Experience</label>
                <input 
                  type="number" 
                  min="0"
                  required
                  value={appForm.experience_years}
                  onChange={(e) => setAppForm({ ...appForm, experience_years: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Professional Summary</label>
              <textarea 
                rows="3"
                required
                value={appForm.professional_summary}
                onChange={(e) => setAppForm({ ...appForm, professional_summary: e.target.value })}
                placeholder="Describe your background and expertise..."
                className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
              />
            </div>

            <button 
              type="submit" 
              disabled={submittingApp}
              className="px-6 py-2.5 bg-(--color-primary) text-(--color-primary-foreground) rounded-(--radius-md) font-medium hover:opacity-90 transition-all cursor-pointer shadow-soft disabled:opacity-50 text-sm"
            >
              {submittingApp ? 'Submitting Application...' : 'Submit Provider Application'}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}