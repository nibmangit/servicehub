export function buildWsUrl(path, params = {}) {
  const base = import.meta.env.VITE_API_WS_URL;
  if (!base) {
    throw new Error('VITE_API_WS_URL is not set — check your .env file and restart the dev server.');
  }
  const wsBase = base.replace(/^http/, 'ws');

  const url = new URL(path.replace(/^\//, ''), wsBase);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) url.searchParams.set(key, value);
  });

  return url.toString();
}