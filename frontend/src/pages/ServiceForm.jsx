import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { servicesApi } from "../api/servicesApi"; 

export default function ServiceForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEditing);
  const [categories, setCategories] = useState([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  // Form states matching backend model fields
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    description: "",
    price_type: "negotiable",
    price: "",
  });

  // Image states: existing server images (for edit mode) and new local files
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  // Fetch categories and service data (if editing) on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const categoriesData = await servicesApi.getCategories();
        setCategories(categoriesData);

        if (isEditing) {
          const service = await servicesApi.getServiceById(id);
          // console.log(serviceRes)
          // const service = serviceRes.data;
          setFormData({
            title: service.title || "",
            category: String(service.category || ""),
            duration: service.duration || "",
            description: service.description || "",
            price_type: service.price_type || "negotiable",
            price: service.price || "",
          });
          setExistingImages(service.images || []);
        }
      } catch (err) {
        console.error("Failed to load form data:", err);
        toast.error("Could not load service details.");
        if (isEditing) navigate("/services/");
      } finally {
        setFetchingCategories(false);
        setFetchingData(false);
      }
    };

    loadInitialData();
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const totalCount = existingImages.length + newImages.length + selectedFiles.length;
      if (totalCount > 5) {
        toast.error("You can upload a maximum of 5 images total.");
        return;
      }
      setNewImages((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeExistingImage = async (imageId) => {
    try {
      await servicesApi.deleteServiceImage(imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Image removed");
    } catch (err) {
      console.error("Failed to delete image:", err);
      toast.error("Could not delete image.");
    }
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        category: parseInt(formData.category, 10),
        description: formData.description,
        price_type: formData.price_type,
        price: formData.price_type !== "negotiable" && formData.price ? parseFloat(formData.price) : null,
        duration: formData.duration || null,
      };

      let serviceId = id;

      if (isEditing) {
        await servicesApi.updateService(id, payload);
        toast.success("Service updated successfully.");
      } else {
        const newService = await servicesApi.createService(payload);
        serviceId = newService.id;
        toast.success("Service saved", { description: "Your listing is now live." });
      }

      // Upload newly selected images sequentially if any exist
      if (newImages.length > 0 && serviceId) {
        for (let i = 0; i < newImages.length; i++) {
          const isPrimary = existingImages.length === 0 && i === 0;
          await servicesApi.uploadServiceImage(serviceId, newImages[i], isPrimary);
        }
      }

      navigate("/services");
    } catch (err) {
      console.error("Failed to save service:", err);
      const errData = err.response?.data;
      if (errData) {
        const firstKey = Object.keys(errData)[0];
        const serverError = Array.isArray(errData[firstKey])
          ? errData[firstKey][0]
          : errData[firstKey];
        toast.error(serverError || "Failed to save service.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedCategoryObj = categories.find((c) => String(c.id) === String(formData.category));
  const previewImageSrc = existingImages[0]?.image || (newImages[0] ? URL.createObjectURL(newImages[0]) : null);

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <Link
        to="/services"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to my services
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Edit service" : "Create a new service"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditing ? "Update your listing details and photos." : "Add details customers will see before they book."}
          </p>
        </div>
      </div>

      <form className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Section title="Photos" desc="Upload up to 5 photos. First photo is the cover.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {/* Existing Server Images */}
              {existingImages.map((img) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                  <img src={img.image} alt="" className="h-full w-full object-cover" />
                  {img.is_primary && (
                    <span className="absolute bottom-0 inset-x-0 bg-primary/90 text-[10px] text-primary-foreground text-center font-medium py-0.5">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute right-2 top-2 rounded-full bg-background/95 p-1 shadow-soft opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove"
                  >
                    <X className="h-3.5 w-3.5 cursor-pointer" />
                  </button>
                </div>
              ))}

              {/* Newly Picked Local Files */}
              {newImages.map((file, i) => (
                <div key={`new-${i}`} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                  <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-amber-500/90 text-[10px] text-white text-center font-medium py-0.5">
                    New
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute right-2 top-2 rounded-full bg-background/95 p-1 shadow-soft opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {existingImages.length + newImages.length < 5 && (
                <label className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary-soft/40 hover:text-primary cursor-pointer">
                  <div className="text-center">
                    <Upload className="mx-auto h-5 w-5" />
                    <div className="mt-1 text-xs">Upload</div>
                  </div>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </Section>

          <Section title="Basics">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Same-day home plumbing repair"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => handleSelectChange("category", val)}
                  disabled={fetchingCategories}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={fetchingCategories ? "Loading..." : "Choose category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="duration">Typical duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 1–3 hours"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="What's included, materials, guarantees…"
                required
              />
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Price type</Label>
                <Select
                  value={formData.price_type}
                  onValueChange={(val) => handleSelectChange("price_type", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negotiable">Negotiable</SelectItem>
                    <SelectItem value="fixed">Fixed price</SelectItem>
                    <SelectItem value="hourly">Hourly rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.price_type !== "negotiable" && (
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (ETB) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="1200.00"
                    required={formData.price_type !== "negotiable"}
                  />
                </div>
              )}
            </div>
          </Section>
        </div>

        <aside className="space-y-4">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="text-sm font-semibold">Preview</h3>
              <div className="mt-3 overflow-hidden rounded-xl border border-border">
                <div className="grid aspect-[4/3] place-items-center bg-muted text-muted-foreground">
                  {previewImageSrc ? (
                    <img src={previewImageSrc} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8" />
                  )}
                </div>
                <div className="p-3">
                  <div className="line-clamp-2 text-sm font-semibold">
                    {formData.title || "Your service title"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {selectedCategoryObj?.name || "Category"} {formData.duration ? `· ${formData.duration}` : ""}
                  </div>
                  <div className="mt-2 text-base font-bold">
                    {formData.price_type === "negotiable"
                      ? "Negotiable"
                      : formData.price
                      ? `ETB ${Number(formData.price).toLocaleString()}`
                      : "ETB 0.00"}
                  </div>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save changes" : "Publish service"}
            </Button>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, desc, children }) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
      <header>
        <h2 className="text-base font-semibold">{title}</h2>
        {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
      </header>
      {children}
    </section>
  );
}