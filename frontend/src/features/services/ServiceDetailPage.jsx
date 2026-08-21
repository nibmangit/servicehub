import { useParams } from 'react-router-dom';

export default function ServiceDetailPlaceholder() {
  const { id } = useParams();
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-(--color-foreground)">Service #{id}</h1>
      <p className="text-(--color-muted-foreground) mt-1">Full detail page + request flow built next.</p>
    </div>
  );
}