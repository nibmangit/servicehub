import React, { useState } from 'react';
import { Inbox } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationHeader from '../../components/notifications/NotificationHeader';
import NotificationItem from '../../components/notifications/NotificationItem';

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  console.log(notifications)
  
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.is_read;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 mx-auto w-full pb-16 animate-fade-in">
      {/* Reusable Header with Tabs */}
      <NotificationHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
        totalCount={notifications.length}
        onMarkAllRead={markAllAsRead}
      />

      {/* Notifications Feed */}
      <div className="flex flex-col gap-3">
        {loading && notifications.length === 0 ? (
          <div className="p-12 text-center text-sm text-(--color-muted-foreground)">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center rounded-(--radius-lg) bg-(--color-card) border border-(--color-border) gap-2">
            <Inbox size={40} className="text-(--color-muted-foreground)/40" />
            <p className="text-base font-semibold text-(--color-foreground)">No notifications found</p>
            <p className="text-xs text-(--color-muted-foreground)">
              {activeTab === 'unread' ? "You have no unread notifications." : "You're all caught up!"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))
        )}
      </div>
    </div>
  );
}