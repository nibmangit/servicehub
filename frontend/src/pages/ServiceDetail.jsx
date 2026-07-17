import { Link, useParams, useNavigate } from "react-router-dom";
import { BadgeCheck, Calendar, CheckCircle2, Clock, Heart, MapPin, MessageCircle, Share2, ShieldCheck, Star, } from "lucide-react";

import { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { ServiceCard } from "../components/ServiceCard";
import { RequestServiceModal } from "../components/request/RequestServiceModal";
import { formatETB, services } from "../lib/mock-data";

export function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookOpen, setBookOpen] = useState(false);

  const service = useMemo(() => {
    return services.find((s) => String(s.id) === id);
  }, [id]);

  const related = useMemo(() => {
    if (!service) return [];
    return services.filter((s) => s.id !== service.id).slice(0, 3);
  }, [service]);

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

  return (
    <>
      <RequestServiceModal service={service} open={bookOpen} onOpenChange={setBookOpen} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/browse" className="hover:text-foreground">Browse</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{service._categoryName}</span>
        </nav>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {service.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium text-foreground">{service.average_rating.toFixed(1)}</span>
                <span>({service.review_count} reviews)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {service._city}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-primary" /> Verified provider
              </span>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm"><Share2 className="h-4 w-4" /> Share</Button>
            <Button variant="outline" size="sm"><Heart className="h-4 w-4" /> Save</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4 sm:grid-rows-2">
          <div className="overflow-hidden rounded-2xl bg-muted sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto">
            <img src={service._cover} alt={service.title} className="h-full w-full object-cover" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="hidden overflow-hidden rounded-2xl bg-muted sm:block aspect-[4/3]">
              <img
                src={`${service._cover}&sat=${-20 + i * 10}`}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={service._providerAvatar} alt={service._providerName} />
                  <AvatarFallback>{service._providerName.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">{service._providerName}</span>
                    {service._providerVerified && (
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {service._providerJobs} jobs completed · Responds in ~1 hour
                  </div>
                </div>
              </div>
              <Button variant="outline"><MessageCircle className="h-4 w-4" /> Message</Button>
            </div>

            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="w-full justify-start rounded-xl bg-secondary/60 p-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reviews">Reviews · {service.review_count}</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-8">
                <section>
                  <h2 className="text-lg font-semibold">About this service</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.description} Whether it's a small residential job or a full
                    commercial project, we bring the right tools, materials, and care to
                    every visit. Same-day availability across {service._city} and
                    transparent pricing before any work begins.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-semibold">What's included</h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      "On-site inspection & consultation",
                      "All standard materials included",
                      "30-day workmanship warranty",
                      "Cleanup after the job",
                      "Flexible mobile-money payment",
                      "English & Amharic support",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-[220px_1fr]">
                  <div className="text-center sm:border-r sm:border-border sm:pr-6">
                    <div className="text-4xl font-bold tracking-tight">
                      {service.average_rating.toFixed(1)}
                    </div>
                    <div className="mt-1 flex justify-center gap-0.5 text-warning">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-warning" />
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {service.review_count} verified reviews
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

                <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card shadow-soft">
                  {[
                    { name: "Mekdes A.", when: "2 weeks ago", text: "Very professional, arrived on time and fixed the issue quickly. Highly recommend!" },
                    { name: "Robel G.", when: "1 month ago", text: "Fair pricing and clean work. Will book again for the next project." },
                    { name: "Feven T.", when: "2 months ago", text: "Great communication in Amharic. Everything was clear from start to finish." },
                  ].map((r) => (
                    <div key={r.name} className="p-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{r.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-semibold">{r.name}</div>
                          <div className="text-xs text-muted-foreground">{r.when}</div>
                        </div>
                        <div className="ml-auto flex gap-0.5 text-warning">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-warning" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="faq" className="mt-6">
                <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-soft">
                  {[
                    { q: "How do I pay?", a: "Cash on completion, mobile money (Telebirr, CBE Birr), or bank transfer." },
                    { q: "Do you cover my area?", a: `Yes, we serve all of ${service._city} and surrounding neighborhoods.` },
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
                        : service.price_type === "starting"
                        ? "Starting from"
                        : "Fixed price"}
                    </div>
                    <div className="mt-1 text-3xl font-bold tracking-tight">
                      {formatETB(service.price)}
                    </div>
                  </div>
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
                    Available today
                  </span>
                </div>

                <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> {service.duration}
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {service._city}
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
            {related.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}