import api from "./api";

export const notificationApi = {
  getNotifications: async (page = 1) => {
    const response = await api.get(`notifications/?page=${page}`);
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await api.get('notifications/unread-count/');
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.patch(`notifications/${id}/read/`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.post('notifications/read-all/');
    return response.data;
  },
  deleteNotification: async (id) => {
    const response = await api.delete(`notifications/${id}/delete/`);
    return response.data;
  },
};