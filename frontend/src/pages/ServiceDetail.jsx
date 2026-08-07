import { Link, useParams, useNavigate } from "react-router-dom";
import { BadgeCheck, Calendar, CheckCircle2, Clock, Heart, MapPin, MessageCircle, Share2, ShieldCheck, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { ServiceCard } from "../components/ServiceCard";
import { RequestServiceModal } from "../components/request/RequestServiceModal";
import { servicesApi } from "../api/servicesApi";
import { Loader2 } from "lucide-react";

export function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookOpen, setBookOpen] = useState(false);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedServices, setRelatedServices] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      setLoading(true);
      setSelectedImage(null); // Reset active thumbnail on route change
      try {
        const data = await servicesApi.getServiceById(id);
        setService(data);

        // Fetch other services for the related list
        const allServices = await servicesApi.getServices();
        const filtered = allServices?.filter((s) => String(s.id) !== String(id)).slice(0, 3);
        setRelatedServices(filtered);
      } catch (err) {
        console.error("Failed to load service detail:", err);
        toast.error("Could not load service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Service not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This listing may have been removed or the link is invalid.
        </p>
        <Button onClick={() => navigate("/browse")} className="mt-6">
          Back to browse
        </Button>
      </div>
    );
  }

  const images = service.images || [];
  const primaryImg = images.find((img) => img.is_primary)?.image || images[0]?.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800";
  const currentMain = selectedImage || primaryImg;

  return (
    <>
      <RequestServiceModal service={service} open={bookOpen} onOpenChange={setBookOpen} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/browse" className="hover:text-foreground">Browse</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{service.category_detail?.name || "Service"}</span>
        </nav>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {service.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium text-foreground">
                  {service.average_rating ? Number(service.average_rating).toFixed(1) : "0.0"}
                </span>
                <span>({service.review_count || 0} reviews)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {service.location || "Bahir Dar"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-primary" /> Verified provider
              </span>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard!");
            }}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Saved to your favorites!")}>
              <Heart className="h-4 w-4" /> Save
            </Button>
          </div>
        </div>

        {/* Dynamic Image Gallery */}
        {images.length === 0 ? (
          <div className="mt-6 overflow-hidden rounded-2xl bg-muted aspect-[16/9]">
            <img src={primaryImg} alt={service.title} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-4 sm:grid-rows-2">
            {/* Main Active Viewer */}
            <div className="overflow-hidden rounded-2xl bg-muted sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto">
              <img src={currentMain} alt={service.title} className="h-full w-full object-cover transition-all duration-300" />
            </div>

            {/* Thumbnails (Excludes the currently active main image, limits to 5) */}
            {images
              .filter((imgObj) => imgObj.image !== currentMain)
              .slice(0, 5)
              .map((imgObj) => (
                <div 
                  key={imgObj.id} 
                  onClick={() => setSelectedImage(imgObj.image)}
                  className="hidden overflow-hidden rounded-2xl bg-muted sm:block aspect-[4/3] cursor-pointer transition-all hover:opacity-90 hover:ring-2 hover:ring-primary"
                >
                  <img src={imgObj.image} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={service.provider_avatar} alt={service.provider_name} />
                  <AvatarFallback>
                    {service.provider_name ? String(service.provider_name).slice(0, 1).toUpperCase() : "P"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">Provider {service.provider_name}</span>
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Responds in ~1 hour
                  </div>
                </div>
              </div>
              <Button variant="outline"><MessageCircle className="h-4 w-4" /> Message</Button>
            </div>

            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="w-full justify-start rounded-xl bg-secondary/60 p-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reviews">Reviews · {service.review_count || 0}</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-8">
                <section>
                  <h2 className="text-lg font-semibold">About this service</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {service.description}
                  </p>
                </section>

                <section className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground">Service Details</h3>
                  <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                    {service.duration && (
                      <div className="flex justify-between sm:flex-col">
                        <dt className="text-muted-foreground">Estimated Duration</dt>
                        <dd className="font-medium text-foreground mt-0.5">{service.duration}</dd>
                      </div>
                    )}
                    <div className="flex justify-between sm:flex-col">
                      <dt className="text-muted-foreground">Price Structure</dt>
                      <dd className="font-medium text-foreground capitalize mt-0.5">{service.price_type}</dd>
                    </div>
                    <div className="flex justify-between sm:flex-col">
                      <dt className="text-muted-foreground">Location</dt>
                      <dd className="font-medium text-foreground mt-0.5">{service.location || "Bahir Dar"}</dd>
                    </div>
                    <div className="flex justify-between sm:flex-col">
                      <dt className="text-muted-foreground">Category</dt>
                      <dd className="font-medium text-foreground mt-0.5">{service.category_detail?.name || "General"}</dd>
                    </div>
                  </dl>
                </section>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-[220px_1fr]">
                  <div className="text-center sm:border-r sm:border-border sm:pr-6">
                    <div className="text-4xl font-bold tracking-tight">
                      {service.average_rating ? Number(service.average_rating).toFixed(1) : "0.0"}
                    </div>
                    <div className="mt-1 flex justify-center gap-0.5 text-warning">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-warning" />
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {service.review_count || 0} verified reviews
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((n, i) => {
                      const pct = [78, 15, 4, 2, 1][i];
                      return (
                        <div key={n} className="flex items-center gap-3 text-xs">
                          <span className="w-3 text-muted-foreground">{n}</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full bg-warning"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-muted-foreground">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="faq" className="mt-6">
                <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-soft">
                  {[
                    { q: "How do I pay?", a: "Cash on completion, mobile money (Telebirr, CBE Birr), or bank transfer." },
                    { q: "Do you cover my area?", a: "Yes, we serve all of Bahir Dar and surrounding neighborhoods." },
                    { q: "Is there a warranty?", a: "All work comes with a 30-day workmanship warranty." },
                  ].map((f) => (
                    <div key={f.q} className="p-5">
                      <div className="font-medium">{f.q}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <aside>
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      {service.price_type === "hourly"
                        ? "Per hour"
                        : service.price_type === "fixed"
                        ? "Fixed price"
                        : "Negotiable"}
                    </div>
                    <div className="mt-1 text-3xl font-bold tracking-tight">
                      {service.price_type === "negotiable" || !service.price
                        ? "Negotiable"
                        : `ETB ${Number(service.price).toLocaleString()}`}
                    </div>
                  </div>
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
                    Available today
                  </span>
                </div>

                <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                  {service.duration && (
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> {service.duration}
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {service.location || "Bahir Dar"}
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Money-back guarantee
                  </li>
                </ul>

                <div className="mt-6 space-y-2">
                  <Button size="lg" className="w-full" onClick={() => setBookOpen(true)}>
                    <Calendar className="h-4 w-4" /> Book this service
                  </Button>
                  <Button size="lg" variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4" /> Message provider
                  </Button>
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  You won't be charged yet
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-primary-soft/60 p-4 text-xs text-primary">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    All ServiceHub providers are ID-verified and covered by our
                    satisfaction guarantee.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {relatedServices.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Related services
              </h2>
              <Link to="/browse" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}