import { useState, useEffect } from "react";
import { toast } from "sonner";

import PendingApplicationView from "../components/profile/provider/PendingApplicationView";
import ApprovedApplicationView from "../components/profile/provider/ApprovedApplicationView";
import RejectedApplicationView from "../components/profile/provider/RejectedApplicationView";
import ProviderApplicationForm from "../components/profile/provider/ProviderApplicationForm";
import { profileApi } from "../api/profileApi"; 
import { useAuth } from "../context/AuthContext";

export default function BecomeProvider() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState("none"); // 'none', 'pending', 'approved', 'rejected'
  const [rejectionReason, setRejectionReason] = useState("");
  const [isEditingRejected, setIsEditingRejected] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
   
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false); 
  const [allSkillsMap, setAllSkillsMap] = useState({});
 
  const [formData, setFormData] = useState({
    skills: [], 
    experience_years: "",
    professional_summary: "",
  });

  useEffect(() => {
    const initData = async () => {
      try {
        // 1. Fetch skills mapping list
        const skillsData = await profileApi.getSkills();
        const map = {};
        skillsData.forEach((s) => { map[s.id] = s.name; });
        setAllSkillsMap(map);

        // 2. Fetch full application details if user has one
        try {
          const appData = await profileApi.getApplication?.();
          if (appData?.status) {
            setApplicationStatus(appData.status);
            setRejectionReason(appData.rejection_reason || "");
            
            // Pre-fill form state in case user needs to edit/re-apply
            setFormData({
              skills: appData.skills || [],
              experience_years: appData.experience_years || "",
              professional_summary: appData.professional_summary || "",
            });
          }
        } catch {
          // Fallback to auth context if application fetch standard endpoint isn't populated
          if (user?.provider_status) {
            setApplicationStatus(user.provider_status);
          } else if (user?.is_provider) {
            setApplicationStatus("approved");
          }
        }
      } catch (err) {
        console.error("Failed to load initial provider data:", err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [user]);

  const removeSkill = (skillId) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((id) => id !== skillId),
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (formData.skills.length === 0) {
      setError("Please select at least one skill.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        skills: formData.skills,
        experience_years: parseInt(formData.experience_years, 10),
        professional_summary: formData.professional_summary,
      };

      if (isEditingRejected) {
        await profileApi.updateApplication?.(payload);
      } else {
        await profileApi.submitApplication(payload);
      }

      setApplicationStatus("pending");
      setIsEditingRejected(false);
      toast.success("Provider application submitted successfully!");
    } catch (err) {
      const errData = err.response?.data;
      if (errData) {
        const firstKey = Object.keys(errData)[0];
        const serverError = Array.isArray(errData[firstKey])
          ? errData[firstKey][0]
          : errData[firstKey];
        setError(serverError || "Submission failed. Please check your inputs.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-muted-foreground animate-pulse">Loading application status...</p>
      </div>
    );
  }
 
  // Render views based on status
  if (applicationStatus === "pending") {
    return <PendingApplicationView />;
  }

  if (applicationStatus === "approved") {
    return <ApprovedApplicationView />;
  }

  if (applicationStatus === "rejected" && !isEditingRejected) {
    return (
      <RejectedApplicationView 
        rejectionReason={rejectionReason} 
        onReapply={() => setIsEditingRejected(true)} 
      />
    );
  }

  // Render form (for 'none' state OR when user clicks 'Edit & Re-apply' after rejection)
  return (
    <ProviderApplicationForm
      formData={formData}
      allSkillsMap={allSkillsMap}
      isSkillModalOpen={isSkillModalOpen}
      setIsSkillModalOpen={setIsSkillModalOpen}
      submitting={submitting}
      error={error}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      removeSkill={removeSkill}
      setFormData={setFormData}
    />
  );
}