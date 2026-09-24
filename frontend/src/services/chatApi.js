import api from './api';

export const chatApi = {
  getConversations: async () => {
    const response = await api.get('chats/');
    return response.data || response.data.results || [];
  },
 
  getConversation: async (id) => {
    const response = await api.get(`chats/${id}/`);
    return response.data || response.data.results || [];
  },
 
  getMessages: async (conversationId, page = 1) => {
    const response = await api.get(`chats/${conversationId}/messages/`, {
      params: { page },
    });
    return response.data || response.data.results || [];
  },
 
  sendMessage: async (conversationId, content) => {
    const response = await api.post(`chats/${conversationId}/messages/`, { content });
    return response.data || response.data.results || [];
  },
 
  getUnreadCount: async () => {
    const response = await api.get('chats/unread-count/');
    return response.data || response.data.results || [];
  },
};