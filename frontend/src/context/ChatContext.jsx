import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { chatApi } from '../services/chatApi';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await chatApi.getConversations();
      setConversations(data.results || data);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await chatApi.getUnreadCount();
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error('Failed to fetch unread message count', error);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchConversations();
    fetchUnreadCount();
  }, [user, fetchConversations, fetchUnreadCount]);

  const refresh = useCallback(async () => {
    await Promise.all([fetchConversations(), fetchUnreadCount()]);
  }, [fetchConversations, fetchUnreadCount]);

  // Called by ConversationDetailPage when a conversation is opened/read,
  // so the sidebar badge and list update without a full refetch.
  const markConversationRead = useCallback((conversationId) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unread_count: 0 } : c))
    );
    setUnreadCount((prev) => {
      const conv = conversations.find((c) => c.id === conversationId);
      const delta = conv?.unread_count || 0;
      return Math.max(0, prev - delta);
    });
  }, [conversations]);

  return (
    <ChatContext.Provider
      value={{ conversations, unreadCount, loading, refresh, markConversationRead }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);