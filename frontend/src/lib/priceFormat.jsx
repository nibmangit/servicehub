export function formatPrice(service) {
  if (service.price_type === 'negotiable' || !service.price) {
    return 'Negotiable';
  }
  const amount = Number(service.price).toLocaleString();
  return service.price_type === 'hourly' ? `${amount} ETB / hr` : `${amount} ETB`;
}