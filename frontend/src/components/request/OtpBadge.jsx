import { KeyRound } from "lucide-react";


export function OtpBadge({ label, code, muted }) {
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