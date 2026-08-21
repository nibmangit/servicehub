export default function EmptyState({ message }) {
  return (
    <div className="py-10 text-center text-sm text-(--color-muted-foreground)">
      {message}
    </div>
  );
}