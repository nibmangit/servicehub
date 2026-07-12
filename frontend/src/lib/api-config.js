// Central config for talking to the Django backend.
// Field shapes across mock-data mirror the real endpoints so the wire-up
// (auth, services, requests, reviews, notifications, chat, dashboard) is
// mechanical when it happens.

const RAW = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = (RAW && RAW.trim()) || "http://localhost:8000";

// Convenience: build an API URL.
export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}

// Auth token storage keys (JWT pair from /api/auth/login/).
export const AUTH_KEYS = {
  access: "servicehub.jwt.access",
  refresh: "servicehub.jwt.refresh",
};

// API endpoint paths — keep in sync with backend docs.
export const ENDPOINTS = {
  register: "/api/auth/register/",
  login: "/api/auth/login/",
  refresh: "/api/auth/refresh/",
  me: "/api/profiles/me/",
  becomeProvider: "/api/profiles/become-provider/",
  categories: "/api/categories/",
  services: "/api/services/",
  service: (id) => `/api/services/${id}/`,
  serviceImages: (id) => `/api/services/${id}/images/`,
  serviceImage: (id) => `/api/services/images/${id}/`,
  requests: "/api/requests/",
  request: (id) => `/api/requests/${id}/`,
  reviews: "/api/reviews/",
  notifications: "/api/notifications/",
  notificationRead: (id) => `/api/notifications/${id}/read/`,
  notificationDelete: (id) => `/api/notifications/${id}/delete/`,
  notificationsUnreadCount: "/api/notifications/unread-count/",
  notificationsReadAll: "/api/notifications/read-all/",
  conversations: "/api/chats/conversations/",
  conversation: (id) => `/api/chats/conversations/${id}/`,
  conversationMessages: (id) => `/api/chats/conversations/${id}/messages/`,
  chatUnread: "/api/chats/unread/",
  dashboard: "/api/dashboard/",
};