import { KeyRound } from 'lucide-react';

export default function OtpChip({ code, label }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-lg border border-(--color-border) bg-(--color-card) px-4 py-3">
      <KeyRound size={18} className="text-(--color-primary) shrink-0" />
      <div>
        <p className="text-xs text-(--color-muted-foreground)">{label}</p>
        <p className="font-mono text-2xl font-semibold tracking-[0.3em] text-(--color-foreground)">{code}</p>
      </div>
    </div>
  );
}