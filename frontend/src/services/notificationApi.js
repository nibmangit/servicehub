import api from "./api";

export const notificationApi = {
  getNotifications: async (params = {}) => {
    const response = await api.get('notifications/', { params });
    return response.data || response.data.results || [];
  },
  getUnreadCount: async () => {
    const response = await api.get('notifications/unread-count/');
    return response.data || response.data.results || [];
  },
  markAsRead: async (id) => {
    const response = await api.patch(`notifications/${id}/read/`);
    return response.data || response.data.results || [];
  },
  markAllAsRead: async () => {
    const response = await api.post('notifications/read-all/');
    return response.data || response.data.results || [];
  },
  deleteNotification: async (id) => {
    const response = await api.delete(`notifications/${id}/delete/`);
    return response.data || response.data.results || [];
  },
};