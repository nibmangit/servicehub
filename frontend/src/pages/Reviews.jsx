import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { reviews } from "../lib/mock-app-data";

export default function ReviewsPage() {
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  const breakdown = [5, 4, 3, 2, 1].map((n) => ({
    n,
    pct: Math.round((reviews.filter((r) => r.rating === n).length / reviews.length) * 100),
  }));

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
      <p className="mt-1 text-sm text-muted-foreground">What customers say about your services.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Rating Summary Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="text-center">
            <div className="text-5xl font-bold tracking-tight">{avg.toFixed(1)}</div>
            <div className="mt-2 flex justify-center gap-0.5 text-warning">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning" />
              ))}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{reviews.length} verified reviews</div>
          </div>
          
          <div className="mt-6 space-y-2">
            {breakdown.map((b) => (
              <div key={b.n} className="flex items-center gap-3 text-xs">
                <span className="w-3 text-muted-foreground">{b.n}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-warning" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="w-8 text-right text-muted-foreground">{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((r) => (
            <article key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <header className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={r._reviewerAvatar} />
                  <AvatarFallback>{r._reviewerName[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{r._reviewerName}</div>
                  <div className="text-xs text-muted-foreground">{r._serviceTitle} · {r._time}</div>
                </div>
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-warning" />
                  ))}
                </div>
              </header>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">"{r.comment}"</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}