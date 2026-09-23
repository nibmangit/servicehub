import { useEffect, useState, useCallback } from 'react';

// Fetches page 1 whenever `params` changes.
// - loadMore(): fetches the next page and appends (infinite-scroll style)
// - goToPage(n): fetches a specific page and replaces items (numbered pagination)
// Pass params={null} to skip fetching entirely (e.g. a tab that only applies
// to provider accounts).
export function usePaginatedResource(fetchFn, params) {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const paramsKey = params ? JSON.stringify(params) : null;

  const fetchPage = useCallback(async (pageNum, { append }) => {
    if (!params) return;
    if (append) setLoadingMore(true); else setLoading(true);
    setError('');
    try {
      const data = await fetchFn({ ...params, page: pageNum });
      const results = data.results || data || [];
      setItems((prev) => (append ? [...prev, ...results] : results));
      setCount(data.count ?? results.length);
      setHasMore(Boolean(data.next));
      setPage(pageNum);
    } catch {
      setError('Could not load data.');
    } finally {
      if (append) setLoadingMore(false); else setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    if (!params) {
      setItems([]);
      setCount(0);
      setHasMore(false);
      setLoading(false);
      return;
    }
    fetchPage(1, { append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  const loadMore = useCallback(() => fetchPage(page + 1, { append: true }), [fetchPage, page]);
  const goToPage = useCallback((pageNum) => fetchPage(pageNum, { append: false }), [fetchPage]);

  return { items, count, page, hasMore, loading, loadingMore, error, loadMore, goToPage, setItems, setCount };
}