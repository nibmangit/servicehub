import { services } from "./mock-data";

/**
 * Mock UI data. Display helpers are `_`-prefixed.
 */

// ============ Requests ============
export const statusStyles = {
  PENDING:      { label: "Pending",     className: "bg-warning/15 text-warning-foreground border-warning/30", dot: "bg-warning" },
  ACCEPTED:     { label: "Accepted",    className: "bg-info/15 text-info border-info/30",                     dot: "bg-info" },
  IN_PROGRESS:  { label: "In progress", className: "bg-primary-soft text-primary border-primary/30",         dot: "bg-primary" },
  COMPLETED:    { label: "Completed",   className: "bg-accent-soft text-accent border-accent/30",             dot: "bg-accent" },
  CANCELLED:    { label: "Cancelled",   className: "bg-secondary text-muted-foreground border-border",        dot: "bg-muted-foreground" },
  REJECTED:     { label: "Rejected",    className: "bg-destructive/10 text-destructive border-destructive/30", dot: "bg-destructive" },
};

export const requests = [
  {
    id: 1, customer: 4, provider: 1, service: 1,
    description: "Kitchen sink leak, urgent.",
    preferred_date: "2026-06-15T15:00:00Z",
    address: "Bole, Addis Ababa",
    status: "IN_PROGRESS",
    agreed_price: "950.00",
    start_otp: "4812", complete_otp: "9357",
    rejection_reason: null, completed_at: null,
    created_at: "2026-06-09T21:10:00Z", updated_at: "2026-06-09T21:10:00Z",
    _service: services[0], _createdAgo: "2h ago", _scheduledLabel: "Today, 3:00 PM",
  },
  {
    id: 2, customer: 4, provider: 2, service: 2,
    description: "Deep clean 3-bedroom apartment.",
    preferred_date: "2026-06-16T10:00:00Z",
    address: "CMC, Addis Ababa",
    status: "ACCEPTED",
    agreed_price: "1200.00",
    start_otp: "7231", complete_otp: "5049",
    rejection_reason: null, completed_at: null,
    created_at: "2026-06-08T09:20:00Z", updated_at: "2026-06-08T09:20:00Z",
    _service: services[1], _createdAgo: "1d ago", _scheduledLabel: "Tomorrow, 10:00 AM",
  },
  {
    id: 3, customer: 4, provider: 4, service: 4,
    description: "Wedding photography full day.",
    preferred_date: "2026-06-20T08:00:00Z",
    address: "Sheraton Addis",
    status: "PENDING",
    agreed_price: "8500.00",
    start_otp: null, complete_otp: null,
    rejection_reason: null, completed_at: null,
    created_at: "2026-06-09T18:00:00Z", updated_at: "2026-06-09T18:00:00Z",
    _service: services[3], _createdAgo: "3h ago", _scheduledLabel: "Sat, 8:00 AM",
  },
  {
    id: 4, customer: 4, provider: 3, service: 3,
    description: "Grade 11 physics prep.",
    preferred_date: "2026-06-02T14:00:00Z",
    address: "Bahir Dar",
    status: "COMPLETED",
    agreed_price: "400.00",
    start_otp: "1122", complete_otp: "3344",
    rejection_reason: null,
    completed_at: "2026-06-02T15:10:00Z",
    created_at: "2026-06-01T12:00:00Z", updated_at: "2026-06-02T15:10:00Z",
    _service: services[2], _createdAgo: "1w ago", _scheduledLabel: "Last Monday",
  },
  {
    id: 5, customer: 4, provider: 5, service: 5,
    description: "Rescheduled with another driver.",
    preferred_date: "2026-05-26T05:00:00Z",
    address: "Bole airport",
    status: "CANCELLED",
    agreed_price: "950.00",
    start_otp: null, complete_otp: null,
    rejection_reason: null, completed_at: null,
    created_at: "2026-05-24T10:00:00Z", updated_at: "2026-05-25T09:00:00Z",
    _service: services[4], _createdAgo: "2w ago", _scheduledLabel: "—",
  },
];

// ============ Chat ============
const nowIso = new Date().toISOString();

export const conversations = [
  {
    id: 1, request: 1, unread_count: 2, created_at: nowIso,
    last_message: { content: "I'm on the way, ETA 20 minutes.", sender: "dawit@example.com", created_at: nowIso },
    _name: "Dawit Tesfaye", _avatar: "https://i.pravatar.cc/120?u=dawit",
    _online: true, _role: "Plumber", _time: "2m", _typing: true,
    messages: [
      { id: 1, sender: 1, sender_email: "dawit@example.com", content: "Hi! I saw your booking for the kitchen sink.", is_read: true, read_at: nowIso, created_at: nowIso, _from: "them", _time: "10:12" },
      { id: 2, sender: 4, sender_email: "me@example.com",    content: "Yes, water is leaking from under the sink.",   is_read: true, read_at: nowIso, created_at: nowIso, _from: "me",   _time: "10:13" },
      { id: 3, sender: 1, sender_email: "dawit@example.com", content: "Understood. I can be there by 3 PM. Is that ok?", is_read: true, read_at: nowIso, created_at: nowIso, _from: "them", _time: "10:15" },
      { id: 4, sender: 4, sender_email: "me@example.com",    content: "Perfect, thank you!", is_read: true, read_at: nowIso, created_at: nowIso, _from: "me", _time: "10:16" },
      { id: 5, sender: 1, sender_email: "dawit@example.com", content: "I'm on the way, ETA 20 minutes.", is_read: false, read_at: null, created_at: nowIso, _from: "them", _time: "2:41 PM" },
    ],
  },
  {
    id: 2, request: 2, unread_count: 0, created_at: nowIso,
    last_message: { content: "See you tomorrow at 10 AM.", sender: "selam@example.com", created_at: nowIso },
    _name: "Selam Bekele", _avatar: "https://i.pravatar.cc/120?u=selam",
    _online: true, _role: "Cleaner", _time: "1h",
    messages: [
      { id: 1, sender: 2, sender_email: "selam@example.com", content: "Confirmed for tomorrow, 10 AM.", is_read: true, read_at: nowIso, created_at: nowIso, _from: "them", _time: "Yesterday" },
      { id: 2, sender: 4, sender_email: "me@example.com",    content: "Thank you!", is_read: true, read_at: nowIso, created_at: nowIso, _from: "me", _time: "Yesterday" },
      { id: 3, sender: 2, sender_email: "selam@example.com", content: "See you tomorrow at 10 AM.", is_read: true, read_at: nowIso, created_at: nowIso, _from: "them", _time: "1h ago" },
    ],
  },
  {
    id: 3, request: 3, unread_count: 0, created_at: nowIso,
    last_message: { content: "I've sent the package details.", sender: "yonas@example.com", created_at: nowIso },
    _name: "Yonas Alemu", _avatar: "https://i.pravatar.cc/120?u=yonas",
    _online: false, _role: "Photographer", _time: "3h",
    messages: [
      { id: 1, sender: 4, sender_email: "yonas@example.com", content: "I've sent the package details.", is_read: true, read_at: nowIso, created_at: nowIso, _from: "them", _time: "3h ago" },
    ],
  },
  {
    id: 4, request: 4, unread_count: 0, created_at: nowIso,
    last_message: { content: "Great, let's start Monday.", sender: "hanna@example.com", created_at: nowIso },
    _name: "Hanna Girma", _avatar: "https://i.pravatar.cc/120?u=hanna",
    _online: false, _role: "Tutor", _time: "2d",
    messages: [
      { id: 1, sender: 3, sender_email: "hanna@example.com", content: "Great, let's start Monday.", is_read: true, read_at: nowIso, created_at: nowIso, _from: "them", _time: "2d ago" },
    ],
  },
];

// ============ Notifications ============
export const notifications = [
  { id: 1, user: 5, request: 1, notification_type: "REQUEST_ACCEPTED",   title: "Booking accepted",   message: "Dawit Tesfaye accepted your plumbing request.", is_read: false, created_at: nowIso, _time: "5 min ago" },
  { id: 2, user: 5, request: 2, notification_type: "NEW_MESSAGE",        title: "New message",        message: "Selam: See you tomorrow at 10 AM.",            is_read: false, created_at: nowIso, _time: "1 hour ago" },
  { id: 3, user: 5, request: 4, notification_type: "REVIEW_RECEIVED",    title: "Review reminder",    message: "How was your session with Hanna Girma?",       is_read: false, created_at: nowIso, _time: "3 hours ago" },
  { id: 4, user: 5, request: null, notification_type: "SYSTEM",          title: "Verification approved", message: "Your ID has been verified successfully.",    is_read: true,  created_at: nowIso, _time: "Yesterday" },
  { id: 5, user: 5, request: 3, notification_type: "REQUEST_COMPLETED",  title: "Booking completed",  message: "Your photography booking is marked complete.", is_read: true,  created_at: nowIso, _time: "2 days ago" },
  { id: 6, user: 5, request: null, notification_type: "SYSTEM",          title: "Welcome to ServiceHub", message: "Explore verified pros across Ethiopia.",     is_read: true,  created_at: nowIso, _time: "1 week ago" },
];

// ============ Reviews ============
export const reviews = [
  { id: 1, request: 1, rating: 5, comment: "On time and very professional. Fixed the leak within an hour.",
    created_at: nowIso, updated_at: nowIso, _reviewerName: "Mekdes A.", _reviewerAvatar: "https://i.pravatar.cc/80?u=mekdes", _serviceTitle: "Plumbing repair",    _time: "2 weeks ago" },
  { id: 2, request: 2, rating: 5, comment: "Fair pricing, clean workmanship. Will book again.",
    created_at: nowIso, updated_at: nowIso, _reviewerName: "Robel G.",  _reviewerAvatar: "https://i.pravatar.cc/80?u=robel",  _serviceTitle: "Bathroom fitting",   _time: "1 month ago" },
  { id: 3, request: 3, rating: 4, comment: "Great communication throughout. Slight delay but quality work.",
    created_at: nowIso, updated_at: nowIso, _reviewerName: "Feven T.",  _reviewerAvatar: "https://i.pravatar.cc/80?u=feven",  _serviceTitle: "Pipe replacement",   _time: "2 months ago" },
  { id: 4, request: 4, rating: 5, comment: "Highly recommend. Very knowledgeable.",
    created_at: nowIso, updated_at: nowIso, _reviewerName: "Nahom K.",  _reviewerAvatar: "https://i.pravatar.cc/80?u=nahom",  _serviceTitle: "Water heater",       _time: "3 months ago" },
];

// ============ Dashboard ============
export const customerDashboard = {
  summary: { total_requests: 12, active_requests: 3, completed_requests: 8, cancelled_requests: 1 },
  recent_requests: requests.slice(0, 4).map((r) => ({
    id: r.id, service__title: r._service.title,
    provider__user__email: `${r._service._providerName.split(" ")[0].toLowerCase()}@example.com`,
    status: r.status, updated_at: r.updated_at,
  })),
  recent_conversations: conversations.slice(0, 3).map((c) => ({
    id: c.id, request__service__title: c._name, updated_at: c.created_at,
  })),
  unread_notifications: 5, unread_messages: 2,
};

export const providerDashboard = {
  summary: { total_services: 6, total_requests: 34, pending_requests: 9, active_requests: 4, completed_requests: 184, cancelled_requests: 3 },
  performance: { rating: 4.9, total_reviews: 214, avg_rating: 4.9 },
  recent_requests: requests.slice(0, 4).map((r) => ({
    id: r.id, service__title: r._service.title,
    customer__email: "customer@example.com", status: r.status, updated_at: r.updated_at,
  })),
  recent_reviews: reviews.slice(0, 3).map((rv) => ({
    rating: rv.rating, comment: rv.comment,
    request__customer__email: `${rv._reviewerName.split(" ")[0].toLowerCase()}@example.com`,
    created_at: rv.created_at,
  })),
};

export const revenueData = [
  { m: "Jan", v: 12 }, { m: "Feb", v: 18 }, { m: "Mar", v: 22 }, { m: "Apr", v: 19 },
  { m: "May", v: 28 }, { m: "Jun", v: 34 }, { m: "Jul", v: 41 }, { m: "Aug", v: 38 },
  { m: "Sep", v: 46 }, { m: "Oct", v: 52 }, { m: "Nov", v: 48 }, { m: "Dec", v: 61 },
];