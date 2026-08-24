import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Check, ExternalLink, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationItem({ notification, onMarkAsRead, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleToggleExpand = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);

    // Mark as read when expanded if it wasn't already read
    if (nextState && !notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleViewRequest = (e, requestId) => {
    e.stopPropagation();
    if (requestId) {
      navigate(`/requests/${requestId}`);
    }
  };

  return (
    <div
      onClick={handleToggleExpand}
      className={`rounded-(--radius-lg) bg-(--color-card) border transition-all cursor-pointer overflow-hidden shadow-soft ${
        !notification.is_read 
          ? 'border-l-4 border-l-(--color-primary) border-(--color-border)' 
          : 'border-(--color-border) opacity-9opath'
      }`}
    >
      {/* Main row layout */}
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {!notification.is_read && (
            <span className="h-2.5 w-2.5 rounded-full bg-(--color-primary) shrink-0 animate-pulse" />
          )}
          <div className="min-w-0 flex-1">
            <h3 className={`text-sm truncate ${!notification.is_read ? 'font-bold text-(--color-foreground)' : 'font-medium text-(--color-muted-foreground)'}`}>
              {notification.title}
            </h3>
            {!isExpanded && (
              <p className="text-xs text-(--color-muted-foreground) truncate mt-0.5">
                {notification.message}
              </p>
            )}
          </div>
        </div>

        {/* Right Action Icons & Timestamp */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-(--color-muted-foreground) hidden sm:inline">
            {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {!notification.is_read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                title="Mark as read"
                className="p-1.5 rounded-(--radius-sm) text-(--color-muted-foreground) hover:text-(--color-primary) hover:bg-(--color-muted) transition-colors"
              >
                <Check size={16} />
              </button>
            )}
            <button
              onClick={() => onDelete(notification.id)}
              title="Delete notification"
              className="p-1.5 rounded-(--radius-sm) text-(--color-muted-foreground) hover:text-red-500 hover:bg-(--color-muted) transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="text-(--color-muted-foreground)">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* Expanded Content Section */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-(--color-border) bg-(--color-muted)/20 flex flex-col gap-3 animate-fade-in">
          <p className="text-sm text-(--color-foreground) leading-relaxed">
            {notification.message}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-(--color-muted-foreground)">
              <Calendar size={13} />
              <span>{new Date(notification.created_at).toLocaleString()}</span>
              <span className="uppercase px-2 py-0.5 rounded bg-(--color-muted) text-[10px] font-semibold ml-2">
                {notification.notification_type.replace('_', ' ')}
              </span>
            </div>

            {notification.request && (
              <button
                onClick={(e) => handleViewRequest(e, notification.request)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-(--radius-md) text-xs font-medium bg-(--color-primary) text-(--color-primary-foreground) hover:opacity-95 transition-opacity self-start sm:self-auto shadow-soft"
              >
                View Related Request <ExternalLink size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}