import { Bell, CheckCheck, MessageCircle, Star, ShieldCheck, Calendar, XCircle, KeyRound } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { notifications as seed } from "../lib/mock-app-data";

const iconMap = {
  NEW_MESSAGE: MessageCircle,
  REQUEST_CREATED: Calendar,
  REQUEST_ACCEPTED: Calendar,
  REQUEST_REJECTED: XCircle,
  REQUEST_IN_PROGRESS: KeyRound,
  REQUEST_COMPLETED: Calendar,
  REQUEST_CANCELLED: XCircle,
  REVIEW_RECEIVED: Star,
  SYSTEM: ShieldCheck,
};

const toneMap = {
  NEW_MESSAGE: "bg-info/15 text-info",
  REQUEST_CREATED: "bg-primary-soft text-primary",
  REQUEST_ACCEPTED: "bg-primary-soft text-primary",
  REQUEST_REJECTED: "bg-destructive/15 text-destructive",
  REQUEST_IN_PROGRESS: "bg-warning/15 text-warning-foreground",
  REQUEST_COMPLETED: "bg-accent-soft text-accent",
  REQUEST_CANCELLED: "bg-secondary text-muted-foreground",
  REVIEW_RECEIVED: "bg-warning/15 text-warning-foreground",
  SYSTEM: "bg-accent-soft text-accent",
};

const groups = [
  { label: "Today", filter: (n) => /min|hour/.test(n._time) },
  { label: "Earlier", filter: (n) => !/min|hour/.test(n._time) },
];

export default function Notifications() {
  const [items, setItems] = useState(seed);
  const unread = items.filter((i) => !i.is_read).length;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unread > 0 ? `${unread} unread` : "You're all caught up"}
          </p>
        </div>
        <Button variant="outline" onClick={() => setItems(items.map((i) => ({ ...i, is_read: true })))}>
          <CheckCheck className="h-4 w-4" /> Mark all as read
        </Button>
      </div>

      <div className="mt-6 space-y-8">
        {groups.map((g) => {
          const list = items.filter(g.filter);
          if (!list.length) return null;
          return (
            <section key={g.label}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</h2>
              <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                {list.map((n) => {
                  const Icon = iconMap[n.notification_type];
                  return (
                    <div key={n.id} className={`flex items-start gap-4 p-4 transition-colors hover:bg-secondary/40 ${!n.is_read ? "" : "opacity-70"}`}>
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneMap[n.notification_type]}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{n.title}</p>
                          {!n.is_read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{n._time}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setItems(items.filter((x) => x.id !== n.id))}
                      >
                        Dismiss
                      </Button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
        {items.length === 0 && (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <Bell className="h-8 w-8 text-muted-foreground" />
            <h3 className="mt-3 text-lg font-semibold">No notifications</h3>
            <p className="mt-1 text-sm text-muted-foreground">You'll see updates about your bookings here.</p>
          </div>
        )}
      </div>
    </div>
  );
}