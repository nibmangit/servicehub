import React from 'react';

export default function LoadMoreButton({ hasMore, loadingMore, onClick, loadedCount, totalCount }) {
  if (!hasMore) return null;

  return (
    <div className="flex flex-col items-center gap-2 pt-4">
      <button
        onClick={onClick}
        disabled={loadingMore}
        className="px-5 py-2.5 rounded-lg border border-(--color-border) bg-(--color-card) text-sm font-semibold text-(--color-foreground) hover:bg-(--color-muted) disabled:opacity-50 cursor-pointer transition-all"
      >
        {loadingMore ? 'Loading...' : 'Load more'}
      </button>
      {totalCount != null && (
        <span className="text-xs text-(--color-muted-foreground)">
          Showing {loadedCount} of {totalCount}
        </span>
      )}
    </div>
  );
}