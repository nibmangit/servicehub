const COLORS = {
  pending: 'bg-(--color-warning)/15 text-(--color-warning)',
  approved: 'bg-emerald-500/15 text-emerald-500',
  rejected: 'bg-(--color-destructive)/15 text-(--color-destructive)',
};

export default function AdminStatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${COLORS[status] || 'bg-(--color-muted) text-(--color-muted-foreground)'}`}>
      {status}
    </span>
  );
}