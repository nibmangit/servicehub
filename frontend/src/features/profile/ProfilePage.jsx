import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileApi } from '../../services/profileApi';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Edit3, CheckCircle2, Shield, Briefcase, UserPlus } from 'lucide-react';
import ProfileEditModal from './ProfileEditModal';

export default function ProfilePage() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileApi.getMyProfile();
      setProfile(data);
    } catch (err) {
      console.error("Failed to load profile", err);
      setError("Failed to load profile information.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (formDataToSend) => {
    setError('');
    setSuccessMessage('');
    
    const updated = await profileApi.updateMyProfile(formDataToSend, true);
    setProfile(updated);
    updateUser(updated); // Sync global AuthContext
    setSuccessMessage('Profile updated successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-(--color-muted-foreground)">
        Loading profile...
      </div>
    );
  }

  return ( 
    <div className="w-full space-y-6 pb-12">
       
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--color-border) pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-(--color-foreground) tracking-tight">My Profile</h1>
          <p className="text-sm text-(--color-muted-foreground) mt-1">View your account details and status.</p>
        </div>
        
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {!profile?.is_provider && (
            <Link
              to="/apply-provider"
              className="flex items-center gap-2 px-4 py-2 bg-(--color-secondary) text-(--color-foreground) border border-(--color-border) rounded-(--radius-md) font-medium text-sm hover:bg-(--color-muted) transition-all shadow-soft"
            >
              <UserPlus size={16} /> Become a Provider
            </Link>
          )}

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-(--color-primary) text-(--color-primary-foreground) rounded-(--radius-md) font-medium text-sm hover:opacity-90 transition-all cursor-pointer shadow-soft"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-(--radius-md) bg-(--color-success)/10 text-(--color-success) text-sm border border-(--color-success)/20 flex items-center gap-2">
          <CheckCircle2 size={18} /> {successMessage}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-(--radius-md) bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">
          {error}
        </div>
      )}
 
      <div className="w-full bg-(--color-card) rounded-(--radius-2xl) border border-(--color-border) shadow-elevated overflow-hidden">
        
        <div className="h-40 bg-gradient-to-r from-(--color-primary)/20 via-(--color-accent)/20 to-(--color-secondary)" />

        <div className="px-6 sm:px-10 pb-10 pt-0 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-6 gap-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-(--color-card) border-4 border-(--color-card) shadow-elevated flex items-center justify-center">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-(--color-muted-foreground)" />
              )}
            </div>

            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit ${
              profile?.is_provider 
                ? 'bg-(--color-accent)/10 text-(--color-accent)' 
                : 'bg-(--color-primary-soft) text-(--color-primary)'
            }`}>
              {profile?.is_provider ? <Briefcase size={14} /> : <Shield size={14} />}
              {profile?.is_provider ? 'Service Provider Account' : 'Customer Account'}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-(--color-foreground)">{profile?.full_name || 'Unnamed User'}</h2>
              <p className="text-sm text-(--color-muted-foreground) flex items-center gap-1.5 mt-1">
                <Mail size={14} /> {profile?.email}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-(--color-border)">
              <div className="p-4 rounded-(--radius-lg) bg-(--color-secondary)/50 border border-(--color-border)">
                <span className="text-xs text-(--color-muted-foreground) block mb-1">Phone Number</span>
                <span className="text-sm font-medium text-(--color-foreground) flex items-center gap-2">
                  <Phone size={14} className="text-(--color-primary)" /> {profile?.phone || 'Not provided'}
                </span>
              </div>

              <div className="p-4 rounded-(--radius-lg) bg-(--color-secondary)/50 border border-(--color-border)">
                <span className="text-xs text-(--color-muted-foreground) block mb-1">City</span>
                <span className="text-sm font-medium text-(--color-foreground) flex items-center gap-2">
                  <MapPin size={14} className="text-(--color-primary)" /> {profile?.city || 'Not provided'}
                </span>
              </div>

              <div className="p-4 rounded-(--radius-lg) bg-(--color-secondary)/50 border border-(--color-border)">
                <span className="text-xs text-(--color-muted-foreground) block mb-1">Member Since</span>
                <span className="text-sm font-medium text-(--color-foreground)">
                  {new Date(profile?.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Provider Bio Section */}
            {profile?.is_provider && (
              <div className="pt-4 border-t border-(--color-border)">
                <h3 className="text-sm font-semibold text-(--color-muted-foreground) uppercase tracking-wider mb-2">Professional Bio</h3>
                <p className="text-sm text-(--color-foreground) bg-(--color-secondary)/30 p-4 rounded-(--radius-lg) border border-(--color-border)">
                  {profile?.bio || 'No professional bio added yet.'}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Render Edit Modal Component */}
      <ProfileEditModal 
        profile={profile}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />

    </div>
  );
}