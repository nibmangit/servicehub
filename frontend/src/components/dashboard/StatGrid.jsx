import { ArrowUpRight } from "lucide-react";

const toneMap = {
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent",
  info: "bg-info/15 text-info",
  warning: "bg-warning/15 text-warning-foreground",
};


export function StatGrid({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${toneMap[s.tone]}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 text-2xl font-bold tracking-tight">{s.value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
          <div className="mt-3 text-[11px] font-medium text-accent">{s.delta}</div>
        </div>
      ))}
    </div>
  );
}