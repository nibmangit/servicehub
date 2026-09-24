import api from './api';

export const adminApi = {
  // Stats
  getStats: async () => {
    const response = await api.get('admin/stats/');
    return response.data;
  },

  // Users
  getUsers: async (params = {}) => {
    const response = await api.get('admin/users/', { params });
    return response.data;
  },
  getUser: async (id) => {
    const response = await api.get(`admin/users/${id}/`);
    return response.data;
  },
  updateUserFlags: async (id, flags) => {
    const response = await api.patch(`admin/users/${id}/flags/`, flags);
    return response.data;
  },

  // Provider applications
  getApplications: async (params = {}) => {
    const response = await api.get('admin/provider-applications/', { params });
    return response.data;
  },
  getApplication: async (id) => {
    const response = await api.get(`admin/provider-applications/${id}/`);
    return response.data;
  },
  approveApplication: async (id) => {
    const response = await api.post(`admin/provider-applications/${id}/approve/`);
    return response.data;
  },
  rejectApplication: async (id, reason) => {
    const response = await api.post(`admin/provider-applications/${id}/reject/`, { reason });
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('admin/categories/');
    return response.data;
  },
  createCategory: async (payload) => {
    const response = await api.post('admin/categories/', payload);
    return response.data;
  },
  updateCategory: async (id, payload) => {
    const response = await api.patch(`admin/categories/${id}/`, payload);
    return response.data;
  },
  deleteCategory: async (id) => {
    await api.delete(`admin/categories/${id}/`);
  },

  // Skills
  getSkills: async () => {
    const response = await api.get('admin/skills/');
    return response.data;
  },
  createSkill: async (payload) => {
    const response = await api.post('admin/skills/', payload);
    return response.data;
  },
  updateSkill: async (id, payload) => {
    const response = await api.patch(`admin/skills/${id}/`, payload);
    return response.data;
  },
  deleteSkill: async (id) => {
    await api.delete(`admin/skills/${id}/`);
  },

  // Services
  getServices: async (params = {}) => {
    const response = await api.get('admin/services/', { params });
    return response.data;
  },
  updateService: async (id, payload) => {
    const response = await api.patch(`admin/services/${id}/`, payload);
    return response.data;
  },
  deleteService: async (id) => {
    await api.delete(`admin/services/${id}/`);
  },

  // Requests
  getRequests: async (params = {}) => {
    const response = await api.get('admin/requests/', { params });
    return response.data;
  },
  getRequest: async (id) => {
    const response = await api.get(`admin/requests/${id}/`);
    return response.data;
  },

  // Reviews
  getReviews: async (params = {}) => {
    const response = await api.get('admin/reviews/', { params });
    return response.data;
  },
  deleteReview: async (id) => {
    await api.delete(`admin/reviews/${id}/`);
  },

  // Identity verifications
  getIdentityVerifications: async (params = {}) => {
    const response = await api.get('admin/identity-verifications/', { params });
    return response.data;
  },
};