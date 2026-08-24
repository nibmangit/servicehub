import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Wrench, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Code, 
  Home, 
  Palette, 
  BookOpen, 
  Briefcase,
  Users,
  CheckCircle,
  FileText
} from 'lucide-react';

const categories = [
  { name: 'Tech & Development', icon: Code, count: '14+ Services', path: '/services?category=tech' },
  { name: 'Home Maintenance', icon: Home, count: '28+ Services', path: '/services?category=home' },
  { name: 'Design & Creative', icon: Palette, count: '19+ Services', path: '/services?category=design' },
  { name: 'Tutoring & Academic', icon: BookOpen, count: '12+ Services', path: '/services?category=tutoring' },
  { name: 'Professional Consulting', icon: Briefcase, count: '9+ Services', path: '/services?category=consulting' },
];

const featuredServices = [
  {
    id: 1,
    title: 'Full-Stack Web Application Development',
    category: 'Tech & Development',
    price: '2,500 ETB',
    rating: 4.9,
    reviews: 24,
    provider: 'Abebe Kebede',
    badge: 'Top Rated',
  },
  {
    id: 2,
    title: 'Professional Home Electrical & Wiring Repair',
    category: 'Home Maintenance',
    price: '800 ETB',
    rating: 4.8,
    reviews: 19,
    provider: 'Dawit Tadesse',
    badge: 'Verified',
  },
  {
    id: 3,
    title: 'UI/UX Brand Identity & Logo Design',
    category: 'Design & Creative',
    price: '1,500 ETB',
    rating: 5.0,
    reviews: 31,
    provider: 'Mekdes Alemayehu',
    badge: 'Popular',
  },
];

// Custom counting animation hook
function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
}

export default function LandingPage() {
  const expertCount = useCountUp(50, 1500);
  const jobsCount = useCountUp(1200, 2000);
  const requestsCount = useCountUp(3400, 2200);

  return (
    <div className="flex flex-col gap-20 pb-16 animate-fade-in w-full">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 md:pt-16 pb-12 flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-(--color-primary)/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-(--color-accent-soft) text-(--color-accent) text-xs font-semibold tracking-wide uppercase border border-(--color-accent)/20 shadow-soft">
            <span className="w-2 h-2 rounded-full bg-(--color-accent) animate-pulse" />
            Your Trusted Local Marketplace
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-(--color-foreground) leading-[1.1]">
            Find Trusted Local Services or <span className="text-(--color-primary)">Grow Your Business</span>
          </h1>

          <p className="text-base sm:text-lg text-(--color-muted-foreground) max-w-2xl leading-relaxed">
            ServiceHub connects clients with verified local experts. Book reliable professionals for your everyday needs or showcase your skills and expand your clientele effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mt-2">
            <Link
              to="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-(--radius-md) font-medium bg-(--color-primary) text-(--color-primary-foreground) hover:opacity-95 transition-opacity shadow-soft"
            >
              Browse Services <ArrowRight size={18} />
            </Link>
            <Link
              to="/apply-provider"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-(--radius-md) font-medium bg-(--color-card) text-(--color-foreground) hover:bg-(--color-muted) transition-colors border border-(--color-border) shadow-soft"
            >
              Become a Provider
            </Link>
          </div>

          {/* Animated Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 mt-6 border-t border-(--color-border) w-full max-w-3xl text-center">
            <div className="flex flex-col items-center gap-1">
              <p className="text-2xl sm:text-3xl font-bold text-(--color-foreground)">{expertCount}+</p>
              <p className="text-xs sm:text-sm text-(--color-muted-foreground)">Verified Experts</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-2xl sm:text-3xl font-bold text-(--color-foreground)">{jobsCount}+</p>
              <p className="text-xs sm:text-sm text-(--color-muted-foreground)">Jobs Completed</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-2xl sm:text-3xl font-bold text-(--color-foreground)">{requestsCount}+</p>
              <p className="text-xs sm:text-sm text-(--color-muted-foreground)">Requests Handled</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-2xl sm:text-3xl font-bold text-(--color-foreground)">4.9★</p>
              <p className="text-xs sm:text-sm text-(--color-muted-foreground)">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-(--color-foreground)">Explore Top Categories</h2>
            <p className="text-sm text-(--color-muted-foreground)">Find specialized professionals across multiple industries.</p>
          </div>
          <Link to="/services" className="text-sm font-medium text-(--color-primary) hover:underline inline-flex items-center gap-1">
            View all categories <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={cat.path}
                className="group p-5 rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) hover:border-(--color-primary)/50 transition-all duration-200 shadow-soft hover:shadow-elevated flex flex-col gap-3"
              >
                <div className="h-10 w-10 rounded-(--radius-md) bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-(--color-foreground) group-hover:text-(--color-primary) transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-(--color-muted-foreground) mt-0.5">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED SERVICES PREVIEW */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-(--color-foreground)">Featured Services</h2>
            <p className="text-sm text-(--color-muted-foreground)">Hand-picked top quality offerings from our leading providers.</p>
          </div>
          <Link to="/services" className="text-sm font-medium text-(--color-primary) hover:underline inline-flex items-center gap-1">
            Browse marketplace <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <div 
              key={service.id}
              className="rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) overflow-hidden shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-(--color-muted) font-medium text-(--color-muted-foreground)">
                    {service.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-(--color-accent-soft) text-(--color-accent) font-semibold">
                    {service.badge}
                  </span>
                </div>

                <h3 className="font-semibold text-base text-(--color-foreground) leading-snug line-clamp-2">
                  {service.title}
                </h3>

                <p className="text-xs text-(--color-muted-foreground)">
                  By <span className="font-medium text-(--color-foreground)">{service.provider}</span>
                </p>
              </div>

              <div className="px-5 py-4 bg-(--color-muted)/40 border-t border-(--color-border) flex items-center justify-between">
                <div>
                  <span className="text-xs text-(--color-muted-foreground) block">Starting at</span>
                  <span className="text-base font-bold text-(--color-primary)">{service.price}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-(--color-foreground)">
                  <Star size={15} className="fill-amber-400 text-amber-400" />
                  <span>{service.rating}</span>
                  <span className="text-xs text-(--color-muted-foreground) font-normal">({service.reviews})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="rounded-3xl bg-(--color-card) border border-(--color-border) p-8 md:p-12 space-y-8 shadow-soft">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--color-foreground)">How ServiceHub Works</h2>
          <p className="text-sm text-(--color-muted-foreground)">Simple, transparent steps to get your tasks done or manage your services.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <div className="h-12 w-12 rounded-2xl bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-semibold text-base text-(--color-foreground)">Search & Discover</h3>
            <p className="text-sm text-(--color-muted-foreground) leading-relaxed">
              Browse through verified listings across different categories and review ratings from real users.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <div className="h-12 w-12 rounded-2xl bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-semibold text-base text-(--color-foreground)">Connect & Book</h3>
            <p className="text-sm text-(--color-muted-foreground) leading-relaxed">
              Send requests to meet a providers and the real time chat conversation will create exactly after you send a request and then you can talk each other.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <div className="h-12 w-12 rounded-2xl bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-semibold text-base text-(--color-foreground)">Get Results</h3>
            <p className="text-sm text-(--color-muted-foreground) leading-relaxed">
              Track request statuses smoothly through your dashboard and build trusted community feedback.
            </p>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) space-y-3 shadow-soft">
          <div className="h-10 w-10 rounded-(--radius-md) bg-(--color-accent-soft) text-(--color-accent) flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-semibold text-base text-(--color-foreground)">Verified Professionals</h3>
          <p className="text-sm text-(--color-muted-foreground) leading-relaxed">
            Every provider goes through profile verification and transparent reviews to ensure top-tier quality and trust.
          </p>
        </div>

        <div className="p-6 rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) space-y-3 shadow-soft">
          <div className="h-10 w-10 rounded-(--radius-md) bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <h3 className="font-semibold text-base text-(--color-foreground)">Direct Real-Time Chat</h3>
          <p className="text-sm text-(--color-muted-foreground) leading-relaxed">
            Communicate instantly with service providers to negotiate details, pricing, and deadlines without intermediaries.
          </p>
        </div>

        <div className="p-6 rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) space-y-3 shadow-soft">
          <div className="h-10 w-10 rounded-(--radius-md) bg-(--color-warning)/10 text-(--color-warning) flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="font-semibold text-base text-(--color-foreground)">Tailored Local Focus</h3>
          <p className="text-sm text-(--color-muted-foreground) leading-relaxed">
            Built specifically to empower local tech talents, service providers, and everyday clients in your region.
          </p>
        </div>
      </section>

      {/* 6. FINAL CTA BANNER */}
      <section className="rounded-3xl bg-(--color-card) border border-(--color-border) p-8 md:p-12 text-center space-y-6 shadow-elevated relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-(--color-primary)/10 via-transparent to-(--color-accent)/10 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-(--color-foreground)">Ready to Get Started with ServiceHub?</h2>
          <p className="text-sm text-(--color-muted-foreground) leading-relaxed">
            Join our growing community of clients finding quick solutions and providers expanding their business reach today.
          </p>
        </div>
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-(--radius-md) font-medium bg-(--color-primary) text-(--color-primary-foreground) hover:opacity-95 transition-opacity shadow-soft"
          >
            Create Free Account
          </Link>
          <Link
            to="/services"
            className="w-full sm:w-auto px-6 py-3 rounded-(--radius-md) font-medium bg-(--color-secondary) text-(--color-secondary-foreground) hover:bg-(--color-muted) transition-colors border border-(--color-border)"
          >
            Explore Marketplace
          </Link>
        </div>
      </section>

    </div>
  );
}