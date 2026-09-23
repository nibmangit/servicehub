import api from './api';

export const chatApi = {
  getConversations: async () => {
    const response = await api.get('chats/');
    return response.data;
  },
 
  getConversation: async (id) => {
    const response = await api.get(`chats/${id}/`);
    return response.data;
  },
 
  getMessages: async (conversationId, page = 1) => {
    const response = await api.get(`chats/${conversationId}/messages/`, {
      params: { page },
    });
    return response.data;
  },
 
  sendMessage: async (conversationId, content) => {
    const response = await api.post(`chats/${conversationId}/messages/`, { content });
    return response.data;
  },
 
  getUnreadCount: async () => {
    const response = await api.get('chats/unread-count/');
    return response.data;
  },
};