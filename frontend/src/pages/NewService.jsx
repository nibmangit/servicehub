import { Link, useNavigate } from "react-router-dom";
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

export default function NewService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  // Real image files state (array of File objects)
  const [images, setImages] = useState([]);

  // Fetch categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await servicesApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
        toast.error("Could not load categories.");
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

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
      if (images.length + selectedFiles.length > 5) {
        toast.error("You can upload a maximum of 5 images.");
        return;
      }
      setImages((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
      // Step 1: Create the service record
      const payload = {
        title: formData.title,
        category: parseInt(formData.category, 10),
        description: formData.description,
        price_type: formData.price_type,
        price: formData.price_type !== "negotiable" && formData.price ? parseFloat(formData.price) : null,
        duration: formData.duration || null,
      };
      console.log("Creating service with payload:", payload);
      const newService = await servicesApi.createService(payload);
      console.log("Service created successfully:", newService);
      const serviceId = newService.id;

      // Step 2: Upload selected images sequentially if any exist
      if (images.length > 0 && serviceId) {
        for (let i = 0; i < images.length; i++) {
          const isPrimary = i === 0;
          await servicesApi.uploadServiceImage(serviceId, images[i], isPrimary);
        }
      }

      toast.success("Service saved", { description: "Your listing is now live." });
      navigate("/services");
    } catch (err) {
      console.error("Failed to create service:", err);
      const errData = err.response?.data;
      if (errData) {
        const firstKey = Object.keys(errData)[0];
        const serverError = Array.isArray(errData[firstKey])
          ? errData[firstKey][0]
          : errData[firstKey];
        toast.error(serverError || "Failed to create service.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Find selected category name for the live preview card
  const selectedCategoryObj = categories.find((c) => String(c.id) === String(formData.category));

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
          <h1 className="text-2xl font-bold tracking-tight">Create a new service</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add details customers will see before they book.
          </p>
        </div>
      </div>

      <form className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Section title="Photos" desc="Upload up to 5 photos. First photo is the cover.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((file, i) => {
                const previewUrl = URL.createObjectURL(file);
                return (
                  <div
                    key={i}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                  >
                    <img src={previewUrl} alt="" className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-primary/90 text-[10px] text-primary-foreground text-center font-medium py-0.5">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-2 top-2 rounded-full bg-background/95 p-1 shadow-soft opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
              {images.length < 5 && (
                <label className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary-soft/40 hover:text-primary cursor-pointer">
                  <div className="text-center">
                    <Upload className="mx-auto h-5 w-5" />
                    <div className="mt-1 text-xs">Upload</div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
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
                  {images[0] ? (
                    <img
                      src={URL.createObjectURL(images[0])}
                      alt=""
                      className="h-full w-full object-cover"
                    />
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
              Publish service
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