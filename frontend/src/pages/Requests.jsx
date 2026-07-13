import { Link } from "react-router-dom";
import { Calendar, KeyRound, MapPin, MessageCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { OtpModal } from "../components/OtpModal";
import { requests, statusStyles } from "../lib/mock-app-data";
import { formatETB } from "../lib/mock-data";

export default function Requests() {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [otp, setOtp] = useState(null);
  const [asProvider, setAsProvider] = useState(false);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (tab !== "all" && r.status !== tab) return false;
      if (q && !r._service.title.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [tab, q]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your bookings from request to review.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={asProvider ? "outline" : "default"} size="sm" onClick={() => setAsProvider(false)}>Customer view</Button>
          <Button variant={asProvider ? "default" : "outline"} size="sm" onClick={() => setAsProvider(true)}>Provider view</Button>
          <Button asChild variant="outline"><Link to="/browse">Book another service</Link></Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Tabs value={tab} onValueChange={(v) => setTab(v)} className="min-w-0 overflow-x-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="PENDING">Pending</TabsTrigger>
            <TabsTrigger value="ACCEPTED">Accepted</TabsTrigger>
            <TabsTrigger value="IN_PROGRESS">In progress</TabsTrigger>
            <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
            <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-soft sm:max-w-xs">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search requests…" className="border-0 p-0 shadow-none focus-visible:ring-0"/>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 grid place-items-center rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No requests here</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">When you book a service, it will appear here.</p>
          <Button asChild className="mt-5"><Link to="/browse">Browse services</Link></Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {filtered.map((r) => {
            const s = statusStyles[r.status];
            return (
              <article key={r.id} className="grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft sm:grid-cols-[80px_1fr_auto] sm:items-center">
                <div className="h-20 w-20 overflow-hidden rounded-xl bg-muted">
                  <img src={r._service._cover} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs ${s.className}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{s.label}
                    </span>
                    <span className="text-xs text-muted-foreground">Booked {r._createdAgo}</span>
                    <span className="text-xs text-muted-foreground">· #{r.id}</span>
                  </div>
                  <h3 className="mt-2 font-semibold">{r._service.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Avatar className="h-5 w-5"><AvatarImage src={r._service._providerAvatar}/><AvatarFallback>{r._service._providerName.slice(0,1)}</AvatarFallback></Avatar>
                      {r._service._providerName}
                    </span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{r._scheduledLabel}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{r.address}</span>
                  </div>
                  {r.rejection_reason && (
                    <p className="mt-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                      Rejected: {r.rejection_reason}
                    </p>
                  )}
                  {!asProvider && r.start_otp && (r.status === "ACCEPTED" || r.status === "IN_PROGRESS") && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      <OtpBadge label="Start code" code={r.start_otp} />
                      {r.complete_otp && <OtpBadge label="Complete code" code={r.complete_otp} muted={r.status !== "IN_PROGRESS"} />}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 sm:items-end">
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatETB(r.agreed_price)}</div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button asChild size="sm" variant="outline"><Link to="/messages"><MessageCircle className="h-4 w-4" />Chat</Link></Button>
                    {asProvider ? (
                      <ProviderActions request={r} onOtp={(a) => setOtp({ action: a, id: r.id })} />
                    ) : (
                      <Button size="sm">Track</Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {otp && (
        <OtpModal
          action={otp.action}
          open={!!otp}
          onOpenChange={(v) => !v && setOtp(null)}
        />
      )}
    </div>
  );
}

function OtpBadge({ label, code, muted }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${
      muted ? "border-border bg-secondary/40 text-muted-foreground" : "border-primary/30 bg-primary-soft text-primary"
    }`}>
      <KeyRound className="h-3.5 w-3.5" />
      <span className="font-medium">{label}</span>
      <span className="font-mono text-sm tracking-[0.3em]">{code}</span>
    </div>
  );
}

function ProviderActions({ request, onOtp }) {
  switch (request.status) {
    case "PENDING":
      return (
        <>
          <Button size="sm" variant="outline">Reject</Button>
          <Button size="sm">Accept</Button>
        </>
      );
    case "ACCEPTED":
      return <Button size="sm" onClick={() => onOtp("start")}><KeyRound className="h-4 w-4" />Start job</Button>;
    case "IN_PROGRESS":
      return <Button size="sm" onClick={() => onOtp("complete")}><KeyRound className="h-4 w-4" />Mark complete</Button>;
    default:
      return null;
  }
}