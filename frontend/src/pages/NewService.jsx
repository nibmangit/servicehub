import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Upload, X } from "lucide-react";
import { useState } from "react";
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
import { categories } from "../lib/mock-data";

export default function NewService() {
  const navigate = useNavigate();
  // Local previews only — mock UI
  const [images, setImages] = useState([]);

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

      <form
        className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]"
        onSubmit={(e) => {
          // Simulated — no network call
          e.preventDefault();
          toast.success("Service saved", { description: "Your listing is now live." });
          navigate("/services");
        }}
      >
        <div className="space-y-6">
          <Section title="Photos" desc="Upload up to 8 photos. First photo is the cover.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, x) => x !== i))}
                    className="absolute right-2 top-2 rounded-full bg-background/95 p-1 shadow-soft opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {images.length < 8 && (
                <button
                  type="button"
                  onClick={() =>
                    setImages([
                      ...images,
                      `https://picsum.photos/seed/${Date.now()}/400/400`,
                    ])
                  }
                  className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary-soft/40 hover:text-primary"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-5 w-5" />
                    <div className="mt-1 text-xs">Upload</div>
                  </div>
                </button>
              )}
            </div>
          </Section>

          <Section title="Basics">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="e.g. Same-day home plumbing repair" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select name="category">
                  <SelectTrigger>
                    <SelectValue placeholder="Choose category" />
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
                <Input id="duration" name="duration" placeholder="e.g. 1–3 hours" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={6}
                placeholder="What's included, materials, guarantees…"
              />
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Price type</Label>
                <Select name="price_type" defaultValue="starting">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed price</SelectItem>
                    <SelectItem value="hourly">Hourly rate</SelectItem>
                    <SelectItem value="starting">Starting from</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (ETB)</Label>
                <Input id="price" name="price" type="number" step="0.01" placeholder="1200.00" />
              </div>
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
                    <img src={images[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8" />
                  )}
                </div>
                <div className="p-3">
                  <div className="line-clamp-2 text-sm font-semibold">Your service title</div>
                  <div className="mt-1 text-xs text-muted-foreground">Category · Duration</div>
                  <div className="mt-2 text-base font-bold">ETB 1,200</div>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg">
              Publish service
            </Button>
            <Button type="button" variant="outline" className="w-full">
              Save as draft
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