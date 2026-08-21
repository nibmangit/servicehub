const STATUS_STYLES = {
  PENDING: 'bg-(--color-warning)/15 text-(--color-warning)',
  ACCEPTED: 'bg-(--color-info)/15 text-(--color-info)',
  IN_PROGRESS: 'bg-(--color-primary-soft) text-(--color-primary)',
  COMPLETED: 'bg-(--color-success)/15 text-(--color-success)',
  CANCELLED: 'bg-(--color-muted) text-(--color-muted-foreground)',
  REJECTED: 'bg-(--color-destructive)/15 text-(--color-destructive)',
};

const STATUS_LABELS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-(--color-muted) text-(--color-muted-foreground)';
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-(--radius-md) text-xs font-medium whitespace-nowrap ${style}`}>
      {label}
    </span>
  );
}