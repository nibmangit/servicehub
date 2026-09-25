# ServiceHub

A local services marketplace connecting customers with verified providers — booking, real-time chat, notifications, reviews, identity verification, and a full admin back office.

**Stack:** Django REST Framework + Django Channels (backend) · React + Vite (frontend) · PostgreSQL · Redis · Cloudinary

If you find this project useful or interesting, consider giving it a ⭐ — it helps others discover it and is genuinely appreciated. Forks, shares, and issues/PRs are all welcome.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Core Flows](#core-flows)
- [Real-Time System](#real-time-system)
- [Admin Panel](#admin-panel)
- [Known Limitations](#known-limitations)
- [Contributing](#contributing) 

---

## Overview

ServiceHub lets customers browse and book local services (home repair, tutoring, design, tech, etc.) from verified providers. Providers apply, get identity-verified, list services, and manage incoming bookings. Every booking has a dedicated real-time chat thread, live notifications, and an OTP-based start/completion flow to prevent disputes.

## Features

**Customers**
- Browse/search/filter services by category, price, location
- Book a service, track request status (Pending → Accepted → In Progress → Completed)
- Real-time chat with the provider once a request exists
- Leave a review after completion
- Live notifications (toast + persistent feed)

**Providers**
- Apply to become a provider (requires identity verification first)
- List/manage services with images
- Accept/reject/manage incoming requests
- OTP-verified start/completion of jobs (prevents fraudulent status changes)
- Ratings and completed-job count auto-tracked

**Platform-wide**
- Real-time chat: live messages, typing indicators, bidirectional online presence, instant read receipts
- Real-time notifications via WebSocket, deduplicated against active chat sessions
- Identity verification (simulated Fayda national ID integration)
- Full admin back office: user management (ban/promote), provider application review, service/review moderation, category & skill CRUD, platform stats

## Architecture

### Backend apps

| App | Responsibility |
|---|---|
| `accounts` | Custom email-based `User` model, JWT auth (register/login/refresh) |
| `profiles` | `UserProfile`, `ProviderProfile`, `Skill`, `ProviderApplication` + approval workflow |
| `categories` | Service categories (public read, admin-managed) |
| `services` | `Service` listings + images, provider-scoped and public views |
| `requests` | `ServiceRequest` — the booking lifecycle, OTP generation, status-transition rules |
| `reviews` | `Review` — one per completed request, drives rating aggregation via signals |
| `notifications` | Persistent notification feed + WebSocket push |
| `chats` | `Conversation`/`Message`, WebSocket consumer (messages, typing, presence, read receipts) |
| `dashboard` | Aggregated per-user dashboard stats (cached) |
| `identity` | Simulated national ID verification (`FakeFaydaCitizen`, `IdentityVerification`) |
| `adminpanel` | Staff-only REST API powering the admin frontend |

### Key architectural decisions

- **Fat services, thin views.** Business logic (status transitions, application approval, review creation, notification dispatch) lives in each app's `services.py`, not in views or serializers.
- **Signals handle derived data.** `Service.average_rating`/`review_count` and `ProviderProfile.rating`/`total_reviews`/`completed_jobs` are kept in sync automatically — `average_rating` via a `Review` post_save/post_delete signal, `completed_jobs` via an atomic `F()` increment on the `COMPLETED` transition in `ServiceRequestService`.
- **Redis powers three things:** the Channels layer (WebSocket pub/sub), a short-TTL cache (dashboard stats, admin platform stats), and ephemeral presence tracking (`PresenceService`, `ActiveChatService`).
- **`ActiveChatService`** tracks which conversation a user currently has open, so a `NEW_MESSAGE` notification is suppressed if the recipient is already looking at that chat.

### Frontend structure

```
src/
  components/    shared UI (common/, admin/, chats/, notifications/)
  context/       AuthContext, ChatContext, NotificationContext, ThemeContext
  features/      route-level pages, grouped by domain (services/, requests/, chats/,
                 notifications/, admin/, profile/, reviews/, auth/)
  lib/           axios instance, WebSocket URL builder, shared hooks (usePaginatedResource)
  routes/        ProtectedRoute, RoleRoute, AdminRoute, RootRedirect
  services/      one file per API domain (chatApi, requestsApi, adminApi, ...)
```

**Shared patterns worth knowing:**
- `usePaginatedResource(fetchFn, params)` — the one hook every paginated list uses. Supports `loadMore()` (infinite-scroll append) and `goToPage(n)` (numbered replace); exposes raw `setItems`/`setCount` for callers needing live updates (e.g. notifications prepending from a WebSocket).
- `AdminModal` — generic modal shell for every admin detail/edit view; `DeleteConfirmModal` for destructive actions specifically.
- `buildWsUrl(path, params)` — single place that turns `VITE_API_WS_URL` into a `ws://`/`wss://` URL, so scheme handling isn't duplicated per WebSocket consumer.

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # fill in the values below
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Requires a running **PostgreSQL** instance and a running **Redis** instance (`redis-server`). The dev server runs on Daphne/ASGI (via Channels), so `runserver` serves both HTTP and WebSocket traffic on the same port.

Quick Redis sanity check: `redis-cli ping` should return `PONG` before starting Django.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env            # fill in the values below
npm run dev
```

## Environment Variables

**Backend `.env`**
```
SECRET_KEY=
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_URL=postgres://user:password@localhost:5432/servicehub
REDIS_URL=redis://127.0.0.1:6379

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Frontend `.env`**
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/
VITE_API_WS_URL=http://127.0.0.1:8000/
```
(`VITE_API_WS_URL` is deliberately `http://`, not `ws://` — `buildWsUrl` converts the scheme at runtime, so this correctly becomes `wss://` under HTTPS in production with no separate config.)

## Project Structure

```
servicehub/
  backend/
    accounts/  profiles/  categories/  services/  requests/
    reviews/   notifications/  chats/  dashboard/  identity/
    adminpanel/
    config/            settings, root urls, asgi/wsgi
  frontend/
    src/
      components/  context/  features/  lib/  routes/  services/
```

## Core Flows

**Booking lifecycle** (`ServiceRequest.status`):
```
PENDING → ACCEPTED → IN_PROGRESS → COMPLETED
   ↓          ↓
REJECTED   (customer can CANCEL from PENDING or ACCEPTED)
```
Transitions are enforced server-side in `ServiceRequestService.change_status` — not by the frontend. Starting and completing a job both require an OTP the provider must collect from the customer in person, generated automatically when the request is created.

**Becoming a provider:**
```
Identity verification (VERIFIED) → Provider application (PENDING)
  → Admin approves → ProviderProfile created, User.is_provider = True
```
A user cannot apply to be a provider without a verified identity first (enforced in `profiles/services.py`).

**Review lifecycle:** a review can only be created by the request's customer, only after the request reaches `COMPLETED`, and only once per request (`OneToOneField`). Creating or deleting a review immediately recalculates the service's and provider's aggregate rating via signal.

## Real-Time System

Two independent WebSocket consumers, both authenticated via a `token` query param:

- **`/ws/notifications/`** — one persistent connection per session. Pushes new notifications; frontend shows a toast and updates the unread badge everywhere in the app (not just the notifications page).
- **`/ws/chats/<conversation_id>/`** — one connection per open conversation. Handles message send/receive, typing indicators, online presence (bidirectional — each side is told the other's current status on connect, not just future changes), and read receipts (marked instantly if the recipient's socket is open, not just on reconnect).

Both use exponential-backoff-free 3-second reconnect on unexpected disconnect, and a clean-close code (1000) to distinguish "user navigated away" from "connection dropped."

## Admin Panel

Gated by `IsAdminStaff` (checks `request.user.is_staff`) on every endpoint under `/api/admin/`. Frontend gate is `AdminRoute`, checking `user.is_staff` on the same `AuthContext` every other role check uses — no separate login system, since there's only one `User` model and one login endpoint.

| Module | Capability |
|---|---|
| Overview | Platform-wide aggregate stats (cached 60s) |
| Provider Applications | List/filter by status, approve, reject with reason |
| Users | Search/filter, ban/unban, grant/revoke staff (superuser-only) |
| Categories & Skills | Full CRUD |
| Services | Moderate any provider's listing — force deactivate or delete |
| Requests | Read-only, for dispute visibility |
| Reviews | Moderate/delete (triggers the same rating-recalculation signal as a normal delete) |
| Identity Verifications | Read-only compliance view |

Self-protection rules live in `AdminUserService.update_user_flags`: an admin can't modify their own flags, can't touch a superuser's account unless they are one, and only a superuser can grant/revoke staff access.

## Known Limitations
- **Service page "Chat" button** (`ServiceDetailPage`) does not yet route anywhere real — there's currently no code path that creates a `Conversation` before a request exists, so this needs a decision (create on request `ACCEPTED`, or lazily on first message) before it's wired up.
- **Landing page stats are hardcoded** — `LandingPage.jsx`'s animated counters (`expertCount`, `jobsCount`, etc.) are static placeholder numbers, not yet wired to a real public stats endpoint (the admin stats endpoint exists but is staff-only; a public equivalent hasn't been built).

## Contributing

Issues and pull requests are welcome. If you're planning a larger change, opening an issue first to discuss it is appreciated — it avoids duplicated effort and makes sure the approach fits the existing architecture (fat services / thin views, signals for derived data, one shared pagination hook on the frontend, etc.).

1. Fork the repo and create a branch off `main`
2. Follow the existing patterns in the app you're touching — see [Architecture](#architecture) for the conventions each layer follows
3. Test both the affected API endpoints and their frontend consumers before opening a PR
4. Open a PR with a clear description of what changed and why
