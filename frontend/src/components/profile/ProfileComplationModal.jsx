import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import client from "../../api/client";
import { profileApi } from "../../api/profileApi";

export default function ProfileCompletionModal({ isOpen, onComplete, initialData }) {
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || "",
    phone: initialData?.phone || "",
    city: initialData?.city || "",
    bio: initialData?.bio || "",
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use FormData to support image/avatar file uploads alongside text data
      const data = new FormData();
      data.append("full_name", formData.full_name);
      data.append("phone", formData.phone);
      data.append("city", formData.city);
      data.append("bio", formData.bio);
      if (avatarFile) {
        data.append("avatar", avatarFile);
      }

      
      const response =  await profileApi.updateProfile(data);
 
      onComplete(response);
    } catch (err) {
      const errData = err.response?.data;
      if (errData) {
        const firstKey = Object.keys(errData)[0];
        const serverError = Array.isArray(errData[firstKey]) 
          ? errData[firstKey][0] 
          : errData[firstKey];
        setError(serverError || "Failed to update profile.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-card text-card-foreground border border-border shadow-elevated rounded-2xl p-6 md:p-8 space-y-6">
        
        {/* Header */}
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="text-2xl font-bold tracking-tight">Complete Your Profile</h2>
          <p className="text-sm text-muted-foreground">
            Please provide a few details about yourself to get started with EthioServe.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="e.g. Abebe Kebede"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0911223344"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="e.g. Bahir Dar"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              placeholder="Tell us a bit about yourself..."
              value={formData.bio}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="avatar">Profile Picture / Avatar</Label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Saving Profile..." : "Save and Continue"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}