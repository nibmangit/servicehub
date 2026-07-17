import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Briefcase,
  CheckCircle2,
  MessageCircle,
  Star,
  TrendingUp,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import {
  conversations,
  customerDashboard,
  providerDashboard,
  requests,
  revenueData,
  statusStyles,
} from "../lib/mock-app-data";
import { formatETB } from "../lib/mock-data";
import { StatGrid } from "../components/dashboard/StatGrid";
import { Panel } from "../components/dashboard/Panel";
import { MiniChart } from "../components/dashboard/MiniChart";

export function Dashboard() {
  const c = customerDashboard;
  const p = providerDashboard;
  
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, Selam 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's what's happening today.</p>
        </div>
        <Button asChild>
          <Link to="/browse">Book new service <ArrowRight className="h-4 w-4"/></Link>
        </Button>
      </div>

      <Tabs defaultValue="customer" className="mt-6">
        <TabsList>
          <TabsTrigger value="customer">Customer view</TabsTrigger>
          <TabsTrigger value="provider">Provider view</TabsTrigger>
        </TabsList>

        <TabsContent value="customer" className="mt-6 space-y-6">
          <StatGrid stats={[
            { icon: Briefcase,    label: "Total requests", value: String(c.summary.total_requests),   delta: "+3 this month",  tone: "primary" },
            { icon: TrendingUp,   label: "Active",         value: String(c.summary.active_requests),   delta: "1 in progress",  tone: "info" },
            { icon: CheckCircle2, label: "Completed",      value: String(c.summary.completed_requests), delta: "94% on time",    tone: "accent" },
            { icon: Bell,         label: "Unread alerts",  value: String(c.unread_notifications),       delta: "2 new today",    tone: "warning" },
          ]} />

          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Panel title="Recent requests" action={<Link to="/requests" className="text-sm font-medium text-primary hover:underline">View all</Link>}>
              <div className="divide-y divide-border">
                {requests.slice(0, 4).map((r) => {
                  const s = statusStyles[r.status];
                  return (
                    <Link key={r.id} to="/requests" className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="h-11 w-11 overflow-hidden rounded-lg bg-muted">
                        <img src={r._service._cover} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{r._service.title}</div>
                        <div className="text-xs text-muted-foreground">{r._service._providerName} · {r._scheduledLabel}</div>
                      </div>
                      <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs ${s.className}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{s.label}
                      </span>
                      <div className="text-right text-sm font-semibold">{formatETB(r.agreed_price)}</div>
                    </Link>
                  );
                })}
              </div>
            </Panel>

            <Panel title="Recent messages" action={<Link to="/messages" className="text-sm font-medium text-primary hover:underline">Open inbox</Link>}>
              <div className="divide-y divide-border">
                {conversations.slice(0, 4).map((cv) => (
                  <Link key={cv.id} to="/messages" className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={cv._avatar} alt={cv._name} />
                        <AvatarFallback>{cv._name.slice(0,1)}</AvatarFallback>
                      </Avatar>
                      {cv._online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-sm font-medium">{cv._name}</span>
                        <span className="text-xs text-muted-foreground">{cv._time}</span>
                      </div>
                      <div className="truncate text-xs text-muted-foreground">{cv.last_message?.content}</div>
                    </div>
                    {cv.unread_count > 0 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">{cv.unread_count}</span>
                    )}
                  </Link>
                ))}
              </div>
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="provider" className="mt-6 space-y-6">
          <StatGrid stats={[
            { icon: Briefcase,    label: "Active services",   value: String(p.summary.total_services),     delta: "+1 this week",    tone: "primary" },
            { icon: Bell,         label: "Pending requests",  value: String(p.summary.pending_requests),   delta: "3 need reply",    tone: "warning" },
            { icon: CheckCircle2, label: "Completed jobs",    value: String(p.summary.completed_requests), delta: "+12 this month",  tone: "accent" },
            { icon: Star,         label: "Rating",            value: p.performance.rating.toFixed(1),      delta: `${p.performance.total_reviews} reviews`, tone: "info" },
          ]} />

          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Panel title="Revenue (last 12 months)" action={<span className="text-sm text-muted-foreground">ETB 148,200 total</span>}>
              <MiniChart data={revenueData} />
            </Panel>
            <Panel title="Latest reviews" action={<Link to="/reviews" className="text-sm font-medium text-primary hover:underline">All reviews</Link>}>
              <div className="space-y-4">
                {p.recent_reviews.map((r, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-3.5 w-3.5 text-muted-foreground"/>
                      <span className="text-sm font-medium">{r.request__customer__email}</span>
                      <span className="flex text-warning">
                        {Array.from({length:r.rating}).map((_,j)=><Star key={j} className="h-3.5 w-3.5 fill-warning"/>)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}