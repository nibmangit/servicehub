export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-lg) p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-sm text-(--color-muted-foreground)">{label}</span>
        {Icon && <Icon size={16} className="text-(--color-muted-foreground)" />}
      </div>
      <div className="text-2xl font-bold text-(--color-foreground) mt-2">{value}</div>
    </div>
  );
}