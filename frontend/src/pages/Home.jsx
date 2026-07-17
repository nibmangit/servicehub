import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { ServiceCard } from "../components/ServiceCard";
import { categories, services, stats, testimonials } from "../lib/mock-data";
import { useI18n } from "../lib/i18n";
import { Featured } from "../components/home/Featured";
import { Categories } from "../components/home/Categories";

export default function LandingPage() {
  const { t } = useI18n();
  const featured = services.filter((s) => s._featured);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-soft/60 via-background to-background"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,theme(colors.primary/12),transparent_60%)]"
        />

        <div className="mx-auto max-w-7xl px-4 pt-16 pb-14 sm:px-6 lg:px-8 lg:pt-24 lg:pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              {t("hero.badge")}
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t("hero.title1")}
              <br />
              <span className="text-primary">{t("hero.title2")}</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("hero.subtitle")}
            </p>

            {/* Search */}
            <div className="mt-8 rounded-2xl border border-border bg-card p-2 shadow-elevated">
              <div className="grid gap-2 sm:grid-cols-[1.4fr_1fr_auto]">
                <label className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors focus-within:bg-secondary">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    className="border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                    placeholder={t("hero.searchWhat")}
                  />
                </label>
                <label className="flex items-center gap-2 rounded-xl px-3 py-2.5 sm:border-l sm:border-border focus-within:bg-secondary">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    className="border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                    placeholder={t("hero.searchCity")}
                    defaultValue={t("hero.searchCity")}
                  />
                </label>
                <Button asChild size="lg" className="rounded-xl">
                  <Link to="/browse">
                    <Search className="h-4 w-4" />
                    {t("hero.searchBtn")}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Category chips */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {categories.slice(0, 7).map((c) => (
                <Link
                  key={c.slug}
                  to="/browse"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:text-foreground"
                >
                  <c._icon className="h-3.5 w-3.5" />
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-6 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <Categories  />

      {/* FEATURED SERVICES */}
      <Featured featured={featured} />

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("sec.how")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t("sec.howSub")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Search, title: t("how.1.t"), body: t("how.1.b") },
            { icon: MessageCircle, title: t("how.2.t"), body: t("how.2.b") },
            { icon: BadgeCheck, title: t("how.3.t"), body: t("how.3.b") },
          ].map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                Step {i + 1}
              </div>
              <span className="mt-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <step.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-secondary/60 border-y border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("sec.why")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("sec.whySub")}
            </p>

            <div className="mt-8 space-y-5">
              {[
                { icon: ShieldCheck, title: t("why.1.t"), body: t("why.1.b") },
                { icon: Sparkles, title: t("why.2.t"), body: t("why.2.b") },
                { icon: MessageCircle, title: t("why.3.t"), body: t("why.3.b") },
              ].map((f) => (
                <div key={f.title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <div>
                  <div className="flex gap-0.5 text-warning">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">
                    “{t.quote}”
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{t.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="text-xs">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-muted-foreground">
                      {t.role} · {t.city}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground shadow-elevated sm:p-12 lg:p-16">
          <div
            aria-hidden
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/30 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("cta.title")}
              </h2>
              <p className="mt-3 max-w-xl text-primary-foreground/85">
                {t("cta.body")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary" className="rounded-xl">
                  <Link to="/register">
                    {t("nav.becomeProvider")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="rounded-xl text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to="/browse">{t("cta.explore")}</Link>
                </Button>
              </div>
            </div>

            <ul className="grid gap-3 text-sm">
              {[
                "0% fees on your first 10 jobs",
                "Verified badge in 24 hours",
                "Free onboarding & training",
              ].map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-4 py-3 backdrop-blur"
                >
                  <BadgeCheck className="h-5 w-5 shrink-0 text-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}