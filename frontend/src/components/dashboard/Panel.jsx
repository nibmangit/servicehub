export function Panel({ title, action, children }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}