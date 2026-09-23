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

  const markConversationRead = useCallback((conversationId) => {
  setConversations((prev) => {
    const conv = prev.find((c) => c.id === conversationId);
    const delta = conv?.unread_count || 0;
    if (delta > 0) {
      setUnreadCount((count) => Math.max(0, count - delta));
    }
    return prev.map((c) => (c.id === conversationId ? { ...c, unread_count: 0 } : c));
  });
}, []);

const bumpConversation = useCallback((conversationId, lastMessage) => {
  setConversations((prev) => {
    const idx = prev.findIndex((c) => c.id === conversationId);
    if (idx === -1) return prev; // not in the list yet — next refresh() will pick it up
    const updated = { ...prev[idx], last_message: lastMessage };
    const rest = prev.filter((c) => c.id !== conversationId);
    return [updated, ...rest];
  });
}, []);
  

  return (
    <ChatContext.Provider
      value={{ conversations, unreadCount, loading, refresh, markConversationRead, bumpConversation }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);