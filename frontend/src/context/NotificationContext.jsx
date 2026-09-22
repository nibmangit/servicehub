import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { notificationApi } from '../services/notificationApi';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

const NOTIFICATION_ICONS = {
  REQUEST_CREATED: '📥',
  REQUEST_ACCEPTED: '✅',
  REQUEST_REJECTED: '❌',
  REQUEST_CANCELLED: '🚫',
  REQUEST_STARTED: '🚀',
  REQUEST_COMPLETED: '🎉',
  NEW_REVIEW: '⭐',
  NEW_MESSAGE: '💬',
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token || !user) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationApi.getNotifications();
        setNotifications(data.results || data);
        const countData = await notificationApi.getUnreadCount();
        setUnreadCount(countData.unread_count);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    let cancelled = false;

    const connect = () => {
      if (cancelled) return;
      const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const wsUrl = `${wsScheme}://127.0.0.1:8000/ws/notifications/?token=${token}`;
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        const newNotif = parsed.data;

        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);

        toast.custom((t) => (
          <div
            onClick={() => {
              markAsRead(newNotif.id);
              if (newNotif.request_id) navigate(`/requests/${newNotif.request_id}`);
              toast.dismiss(t.id);
            }}
            className="cursor-pointer bg-(--color-card) border border-(--color-border) rounded-(--radius-lg) shadow-lg p-4 flex items-start gap-3 w-80 hover:border-(--color-primary)/50 transition-colors"
          >
            <span className="text-lg shrink-0">{NOTIFICATION_ICONS[newNotif.notification_type] || '🔔'}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-(--color-foreground)">{newNotif.title}</p>
              <p className="text-sm text-(--color-muted-foreground) truncate">{newNotif.message}</p>
            </div>
          </div>
        ), { duration: 5000 });
      };

      socket.onclose = (e) => {
        if (cancelled || e.code === 1000) return;
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      socket.onerror = () => socket.close();
    };

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimeoutRef.current);
      socketRef.current?.close(1000);
    };
  }, [user]);

  const refresh = async () => {
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data.results || data);
      const countData = await notificationApi.getUnreadCount();
      setUnreadCount(countData.unread_count);
    } catch (error) {
      console.error('Failed to refresh notifications', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const notif = notifications.find((n) => n.id === id);
      await notificationApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (notif && !notif.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, refresh }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);