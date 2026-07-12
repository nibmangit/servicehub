import {
  Wrench,
  Sparkles,
  GraduationCap,
  Camera,
  Car,
  Scissors,
  PartyPopper,
  Laptop,
  Home,
  Paintbrush,
  Utensils,
  Truck,
} from "lucide-react";

const now = new Date().toISOString();

// ============ Categories ============
export const categories = [
  { id: 1,  name: "Home Repair",  slug: "home-repair", description: "Repairs, installations, and handyman work.", icon: "wrench", is_active: true, created_at: now, updated_at: now, _icon: Wrench, _count: 342, _tint: "bg-primary-soft text-primary" },
  { id: 2,  name: "Cleaning",     slug: "cleaning",    description: "Home and office cleaning.", icon: "sparkles", is_active: true, created_at: now, updated_at: now, _icon: Sparkles, _count: 218, _tint: "bg-accent-soft text-accent" },
  { id: 3,  name: "Tutoring",     slug: "tutoring",    description: "Academic tutoring and coaching.", icon: "graduation-cap", is_active: true, created_at: now, updated_at: now, _icon: GraduationCap, _count: 189, _tint: "bg-primary-soft text-primary" },
  { id: 4,  name: "Photography",  slug: "photography", description: "Events and portrait photography.", icon: "camera", is_active: true, created_at: now, updated_at: now, _icon: Camera, _count: 127, _tint: "bg-accent-soft text-accent" },
  { id: 5,  name: "Transport",    slug: "transport",   description: "Driver and airport transfers.", icon: "car", is_active: true, created_at: now, updated_at: now, _icon: Car, _count: 96, _tint: "bg-primary-soft text-primary" },
  { id: 6,  name: "Tailoring",    slug: "tailoring",   description: "Custom tailoring and alterations.", icon: "scissors", is_active: true, created_at: now, updated_at: now, _icon: Scissors, _count: 154, _tint: "bg-accent-soft text-accent" },
  { id: 7,  name: "Events",       slug: "events",      description: "Event planning and coordination.", icon: "party-popper", is_active: true, created_at: now, updated_at: now, _icon: PartyPopper, _count: 78, _tint: "bg-primary-soft text-primary" },
  { id: 8,  name: "Tech & IT",    slug: "tech",        description: "IT support and device repair.", icon: "laptop", is_active: true, created_at: now, updated_at: now, _icon: Laptop, _count: 112, _tint: "bg-accent-soft text-accent" },
  { id: 9,  name: "Moving",       slug: "moving",      description: "Local moving and hauling.", icon: "truck", is_active: true, created_at: now, updated_at: now, _icon: Truck, _count: 63, _tint: "bg-primary-soft text-primary" },
  { id: 10, name: "Painting",     slug: "painting",    description: "Interior and exterior painting.", icon: "paintbrush", is_active: true, created_at: now, updated_at: now, _icon: Paintbrush, _count: 84, _tint: "bg-accent-soft text-accent" },
  { id: 11, name: "Catering",     slug: "catering",    description: "Catering and private chefs.", icon: "utensils", is_active: true, created_at: now, updated_at: now, _icon: Utensils, _count: 71, _tint: "bg-primary-soft text-primary" },
  { id: 12, name: "Interior",     slug: "interior",    description: "Interior design and staging.", icon: "home", is_active: true, created_at: now, updated_at: now, _icon: Home, _count: 49, _tint: "bg-accent-soft text-accent" },
];

const img = (seed, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const avatar = (seed) => `https://i.pravatar.cc/120?u=${seed}`;

function makeImages(url) {
  return [{ id: Math.floor(Math.random() * 1e6), image: url, created_at: now }];
}

// ============ Services ============
export const services = [
  {
    id: 1, provider: 1, category: 1,
    title: "Professional home plumbing & pipe repair",
    description:
      "Certified plumber with over 8 years of experience. Same-day repairs for leaks, blockages, water heater installation, and full bathroom fittings across Addis Ababa.",
    price_type: "starting", price: "850.00", duration: "1–3 hours",
    average_rating: 4.9, review_count: 214, is_active: true,
    images: makeImages(img("1585704032915-c3400ca199e7")),
    created_at: now, updated_at: now,
    _categoryName: "Home Repair", _categorySlug: "home-repair",
    _cover: img("1585704032915-c3400ca199e7"),
    _providerName: "Dawit Tesfaye", _providerAvatar: avatar("dawit"),
    _providerVerified: true, _providerJobs: 312,
    _city: "Addis Ababa", _featured: true,
  },
  {
    id: 2, provider: 2, category: 2,
    title: "Deep home cleaning by trained crew",
    description:
      "Full-service deep cleaning for apartments and villas. Two-person crew, eco-friendly supplies, kitchen degrease, bathroom sanitize, window and floor polish included.",
    price_type: "fixed", price: "1200.00", duration: "3–5 hours",
    average_rating: 4.8, review_count: 186, is_active: true,
    images: makeImages(img("1581578731548-c64695cc6952")),
    created_at: now, updated_at: now,
    _categoryName: "Cleaning", _categorySlug: "cleaning",
    _cover: img("1581578731548-c64695cc6952"),
    _providerName: "Selam Bekele", _providerAvatar: avatar("selam"),
    _providerVerified: true, _providerJobs: 248,
    _city: "Addis Ababa", _featured: true,
  },
  {
    id: 3, provider: 3, category: 3,
    title: "Grade 9–12 math & physics tutoring",
    description:
      "AAU Physics graduate offering one-on-one tutoring for national exam preparation. Structured lesson plans, weekly assessments, and parent progress reports.",
    price_type: "hourly", price: "400.00", duration: "1 hour",
    average_rating: 5.0, review_count: 92, is_active: true,
    images: makeImages(img("1503676260728-1c00da094a0b")),
    created_at: now, updated_at: now,
    _categoryName: "Tutoring", _categorySlug: "tutoring",
    _cover: img("1503676260728-1c00da094a0b"),
    _providerName: "Hanna Girma", _providerAvatar: avatar("hanna"),
    _providerVerified: true, _providerJobs: 156,
    _city: "Bahir Dar", _featured: true,
  },
  {
    id: 4, provider: 4, category: 4,
    title: "Wedding & event photography package",
    description:
      "Award-winning wedding photographer. Full-day coverage, two shooters, edited digital gallery within 14 days, and a 40-page premium printed album.",
    price_type: "starting", price: "8500.00", duration: "Full day",
    average_rating: 4.9, review_count: 74, is_active: true,
    images: makeImages(img("1519741497674-611481863552")),
    created_at: now, updated_at: now,
    _categoryName: "Photography", _categorySlug: "photography",
    _cover: img("1519741497674-611481863552"),
    _providerName: "Yonas Alemu", _providerAvatar: avatar("yonas"),
    _providerVerified: true, _providerJobs: 118,
    _city: "Addis Ababa", _featured: true,
  },
  {
    id: 5, provider: 5, category: 5,
    title: "Airport transfer & city driver",
    description:
      "Reliable airport pickup and drop-off, plus hourly city driving. Clean sedan, English-speaking driver, mobile-money accepted.",
    price_type: "fixed", price: "950.00", duration: "As needed",
    average_rating: 4.7, review_count: 302, is_active: true,
    images: makeImages(img("1449965408869-eaa3f722e40d")),
    created_at: now, updated_at: now,
    _categoryName: "Transport", _categorySlug: "transport",
    _cover: img("1449965408869-eaa3f722e40d"),
    _providerName: "Bereket Haile", _providerAvatar: avatar("bereket"),
    _providerVerified: false, _providerJobs: 421,
    _city: "Addis Ababa",
  },
  {
    id: 6, provider: 6, category: 6,
    title: "Custom habesha dress tailoring",
    description:
      "Traditional and modern habesha kemis tailoring with hand-finished tibeb. Home measurements available within Hawassa; fittings included.",
    price_type: "starting", price: "3200.00", duration: "5–7 days",
    average_rating: 4.9, review_count: 138, is_active: true,
    images: makeImages(img("1594938298603-c8148c4dae35")),
    created_at: now, updated_at: now,
    _categoryName: "Tailoring", _categorySlug: "tailoring",
    _cover: img("1594938298603-c8148c4dae35"),
    _providerName: "Meron Tadesse", _providerAvatar: avatar("meron"),
    _providerVerified: true, _providerJobs: 267,
    _city: "Hawassa",
  },
  {
    id: 7, provider: 7, category: 7,
    title: "Birthday & corporate event planning",
    description:
      "End-to-end event planning: venue, décor, catering coordination, MC, and photography. Personalized concept moodboard delivered in 48 hours.",
    price_type: "starting", price: "15000.00", duration: "1–3 weeks",
    average_rating: 4.8, review_count: 41, is_active: true,
    images: makeImages(img("1464366400600-7168b8af9bc3")),
    created_at: now, updated_at: now,
    _categoryName: "Events", _categorySlug: "events",
    _cover: img("1464366400600-7168b8af9bc3"),
    _providerName: "Kalkidan Mulu", _providerAvatar: avatar("kalkidan"),
    _providerVerified: true, _providerJobs: 62,
    _city: "Addis Ababa",
  },
  {
    id: 8, provider: 8, category: 8,
    title: "Laptop & phone repair, on-site",
    description:
      "Screen replacement, battery swap, OS reinstall, and data recovery. On-site diagnostic within Mekelle; 30-day warranty on all parts.",
    price_type: "starting", price: "500.00", duration: "1–2 hours",
    average_rating: 4.8, review_count: 197, is_active: true,
    images: makeImages(img("1517336714731-489689fd1ca8")),
    created_at: now, updated_at: now,
    _categoryName: "Tech & IT", _categorySlug: "tech",
    _cover: img("1517336714731-489689fd1ca8"),
    _providerName: "Abel Kidane", _providerAvatar: avatar("abel"),
    _providerVerified: true, _providerJobs: 289,
    _city: "Mekelle",
  },
];

// ============ Current Profile ============
export const currentProfile = {
  id: 4, email: "developer@example.com",
  full_name: "Selam Bekele", phone: "+251 91 234 5678",
  city: "Addis Ababa", bio: "Homeowner in Bole. I use ServiceHub for cleaning and repairs.",
  avatar: avatar("me"),
  created_at: now, updated_at: now,
};

// ============ Testimonials ============
export const testimonials = [
  { name: "Selam Bekele", role: "Homeowner", city: "Addis Ababa", avatar: avatar("selam-t"), rating: 5,
    quote: "Found a plumber within 20 minutes on a Sunday evening. Clear pricing, verified reviews — it just works." },
  { name: "Dawit Tesfaye", role: "Provider · Home Repair", city: "Addis Ababa", avatar: avatar("dawit-t"), rating: 5,
    quote: "ServiceHub doubled my monthly jobs in three months. The dashboard makes managing requests effortless." },
  { name: "Hanna Girma", role: "Parent & Tutor", city: "Bahir Dar", avatar: avatar("hanna-t"), rating: 5,
    quote: "I use it as a customer for cleaning and as a provider for tutoring. Same clean experience on both sides." },
];

export const stats = [
  { label: "Verified providers", value: "12,400+" },
  { label: "Jobs completed", value: "184,000" },
  { label: "Average rating", value: "4.9" },
  { label: "Cities served", value: "18" },
];

export const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "am", label: "Amharic", native: "አማርኛ" },
  { code: "om", label: "Oromo", native: "Afaan Oromoo" },
  { code: "ti", label: "Tigrinya", native: "ትግርኛ" },
];

// Price formatting helper (ETB).
export function priceNumber(price) {
  if (typeof price === "number") return price;
  const n = parseFloat(price);
  return Number.isFinite(n) ? n : 0;
}

export function formatETB(amount) {
  return `ETB ${priceNumber(amount).toLocaleString("en-US")}`;
}