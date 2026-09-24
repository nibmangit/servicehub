import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import your useAuth hook
import { profileApi } from '../../services/profileApi';
import FaydaVerificationStep from './FaydaVerificationStep';
import { CheckCircle2, ArrowLeft, Send, Clock, AlertTriangle } from 'lucide-react';

export default function ApplyProviderPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Access user directly from context
  
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [applicationData, setApplicationData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  
  // Application Form States
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experienceYears, setExperienceYears] = useState('');
  const [professionalSummary, setProfessionalSummary] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const providerStatus = user?.provider_status || 'none';

  useEffect(() => {
    initCheck();
  }, [user]); // Re-run if user status updates

  const initCheck = async () => {
    try {
      // 1. If status is pending, rejected, or approved, fetch application details
      if (providerStatus !== 'none') {
        try {
          const appData = await profileApi.getProviderApplicationStatus();
          setApplicationData(appData);
          
          if (providerStatus === 'rejected' && appData) {
            setExperienceYears(appData.experience_years || '');
            setProfessionalSummary(appData.professional_summary || '');
            setSelectedSkills(appData.skills || []);
          }
        } catch (err) {
          console.error("Failed to fetch application details", err);
        }
      }

      // 2. Check Fayda Identity status
      const identityData = await profileApi.getIdentityStatus();
      if (identityData?.status === 'verified') {
        setIsVerified(true);
        loadSkills();
      } else {
        setIsVerified(false);
      }
    } catch (err) {
      console.error("Initialization check failed", err);
      setIsVerified(false);
    } finally {
      setLoadingStatus(false);
    }
  };

  const loadSkills = async () => {
    try {
      const skillsData = await profileApi.getSkills();
      setSkills(skillsData);
      console.log("Loaded skills:", skillsData);
    } catch (err) {
      console.error("Failed to load skills", err);
      setError("Could not load available skills.");
    }
  };

  const handleSkillToggle = (skillId) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      setError('Please select at least one skill.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        skills: selectedSkills,
        experience_years: parseInt(experienceYears, 10) || 0,
        professional_summary: professionalSummary
      };

      if (providerStatus === 'rejected') {
        await profileApi.updateProviderApplication(payload);
      } else {
        await profileApi.applyProvider(payload);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error("Application submission failed", err);
      setError(err.response?.data?.detail || 'Failed to submit provider application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingStatus) {
    return (
      <div className="flex items-center justify-center py-20 text-(--color-muted-foreground)">
        Loading application status...
      </div>
    );
  }

  // If application is Pending or Approved, show a read-only details view instead of the form
  if (providerStatus === 'pending' || providerStatus === 'approved') {
    return (
      <div className="w-full mx-auto space-y-6 pb-12">
        <button onClick={() => navigate('/profile')} className="flex items-center gap-1.5 text-sm text-(--color-muted-foreground) hover:text-(--color-foreground) cursor-pointer">
          <ArrowLeft size={16} /> Back to Profile
        </button>

        <div className="bg-(--color-card) p-8 rounded-(--radius-2xl) border border-(--color-border) shadow-elevated space-y-6">
          <div className="text-center space-y-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${providerStatus === 'approved' ? 'bg-(--color-success)/10 text-(--color-success)' : 'bg-amber-500/10 text-amber-500'}`}>
              {providerStatus === 'approved' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
            </div>
            <h2 className="text-2xl font-bold text-(--color-foreground)">
              {providerStatus === 'approved' ? 'Application Approved' : 'Application Under Review'}
            </h2>
            <p className="text-sm text-(--color-muted-foreground)">
              {providerStatus === 'approved' 
                ? 'Your provider application has been approved. You are now a service provider!' 
                : 'Your application has been submitted and is waiting for administrator review.'}
            </p>
          </div>

          {applicationData && (
            <div className="space-y-4 pt-4 border-t border-(--color-border) text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-(--radius-md) bg-(--color-secondary)/40 border border-(--color-border)">
                  <span className="block text-xs text-(--color-muted-foreground)">Experience</span>
                  <span className="font-medium text-(--color-foreground)">{applicationData.experience_years} Years</span>
                </div>
                <div className="p-3 rounded-(--radius-md) bg-(--color-secondary)/40 border border-(--color-border)">
                  <span className="block text-xs text-(--color-muted-foreground)">Submitted Date</span>
                  <span className="font-medium text-(--color-foreground)">{new Date(applicationData.submitted_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <span className="block text-xs text-(--color-muted-foreground) mb-1.5">Selected Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {applicationData.skills_detail?.map(skill => (
                    <span key={skill.id} className="px-2.5 py-1 rounded-(--radius-md) bg-(--color-primary)/10 text-(--color-primary) text-xs font-medium">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs text-(--color-muted-foreground) mb-1">Professional Summary</span>
                <p className="p-3 rounded-(--radius-md) bg-(--color-secondary)/40 border border-(--color-border) text-(--color-foreground) text-xs leading-relaxed">
                  {applicationData.professional_summary}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If user is not verified yet, show Fayda verification step first
  if (!isVerified) {
    return (
      <div className="w-full space-y-6 pb-12">
        <button onClick={() => navigate('/profile')} className="flex items-center gap-1.5 text-sm text-(--color-muted-foreground) hover:text-(--color-foreground) cursor-pointer">
          <ArrowLeft size={16} /> Back to Profile
        </button>
        <FaydaVerificationStep onVerified={() => {
          setIsVerified(true);
          loadSkills();
        }} />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6 pb-12">
      
      <div className="flex items-center justify-between border-b border-(--color-border) pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-(--color-foreground) tracking-tight">
            {providerStatus === 'rejected' ? 'Edit & Resubmit Application' : 'Provider Application'}
          </h1>
          <p className="text-sm text-(--color-muted-foreground) mt-1">Complete your professional background to register as a service provider.</p>
        </div>
        <button onClick={() => navigate('/profile')} className="text-sm text-(--color-muted-foreground) hover:text-(--color-foreground) cursor-pointer">
          Cancel
        </button>
      </div>

      {/* Rejection Notice Banner */}
      {providerStatus === 'rejected' && applicationData && (
        <div className="p-4 rounded-(--radius-lg) bg-(--color-destructive)/10 border border-(--color-destructive)/20 space-y-1 text-sm text-(--color-destructive)">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle size={18} />
            <span>Your previous application was rejected</span>
          </div>
          <p className="text-xs opacity-90 pl-6"><strong>Reason:</strong> {applicationData.rejection_reason || 'No specific reason provided.'}</p>
          <p className="text-xs opacity-90 pl-6 pt-1">You can update your details below and resubmit for review.</p>
        </div>
      )}

      {success ? (
        <div className="p-6 rounded-2xl bg-success/10 text-(--color-success) border border-success/20 text-center space-y-2">
          <CheckCircle2 size={32} className="mx-auto" />
          <h3 className="text-lg font-bold">Application Submitted Successfully!</h3>
          <p className="text-sm">Redirecting you back to your profile...</p>
        </div>
      ) : (
        <div className="bg-(--color-card) p-8 rounded-2xl border border-(--color-border) shadow-elevated">
          
          {error && (
            <div className="mb-6 p-3 rounded-(--radius-md) bg-destructive/10 text-(--color-destructive) text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitApplication} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Years of Experience</label>
              <input 
                type="number" 
                min="0"
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="e.g. 3"
                className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-(--color-foreground)">Select Your Skills</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 rounded-(--radius-md) bg-(--color-secondary)/40 border border-(--color-border)">
                {skills.length === 0 ? (
                  <p className="text-xs text-(--color-muted-foreground) col-span-full">Loading skills...</p>
                ) : (
                  skills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => handleSkillToggle(skill.id)}
                        className={`px-3 py-2 rounded-(--radius-md) text-xs font-medium text-left transition-all border cursor-pointer flex items-center justify-between ${
                          isSelected 
                            ? 'bg-(--color-primary) text-(--color-primary-foreground) border-(--color-primary)' 
                            : 'bg-(--color-card) text-(--color-foreground) border-(--color-border) hover:bg-(--color-muted)'
                        }`}
                      >
                        <span>{skill.name}</span>
                        {isSelected && <CheckCircle2 size={14} />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-foreground)">Professional Summary</label>
              <textarea 
                rows="4"
                required
                value={professionalSummary}
                onChange={(e) => setProfessionalSummary(e.target.value)}
                placeholder="I worked for three years and I have a good experience..."
                className="w-full px-4 py-2.5 rounded-(--radius-md) bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
              />
            </div>

            <button 
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-(--color-primary) text-(--color-primary-foreground) rounded-(--radius-md) font-medium text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-soft disabled:opacity-50"
            >
              <Send size={16} /> {submitting ? 'Submitting...' : providerStatus === 'rejected' ? 'Resubmit Application' : 'Submit Provider Application'}
            </button>

          </form>
        </div>
      )}

    </div>
  );
}