import React from 'react';
import { CheckCheck } from 'lucide-react';

export default function NotificationHeader({ activeTab, setActiveTab, unreadCount, totalCount, onMarkAllRead }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-(--color-border)">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-(--color-foreground)">Notifications</h1>
        <p className="text-sm text-(--color-muted-foreground)">Stay updated with your service requests and messages.</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Tabs with counts */}
        <div className="flex items-center p-1 bg-(--color-muted)/50 rounded-(--radius-md) border border-(--color-border)">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-(--radius-sm) text-xs font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-(--color-card) text-(--color-foreground) shadow-soft font-semibold'
                : 'text-(--color-muted-foreground) hover:text-(--color-foreground)'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1.5 rounded-(--radius-sm) text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'unread'
                ? 'bg-(--color-card) text-(--color-foreground) shadow-soft font-semibold'
                : 'text-(--color-muted-foreground) hover:text-(--color-foreground)'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-(--color-primary) text-[10px] font-bold text-(--color-primary-foreground)">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-(--radius-md) text-xs font-medium bg-(--color-primary-soft) text-(--color-primary) hover:opacity-90 transition-opacity"
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>
    </div>
  );
}