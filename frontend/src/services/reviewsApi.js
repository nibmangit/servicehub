import api from "./api";

export const reviewsApi = {  
  getReviews: async (filters = {}) => {
    const response = await api.get('reviews/', { params: filters });
    return response.data;
  },

  getReview: async (id) => {
    const response = await api.get(`reviews/${id}/`);
    return response.data;
  },

  createReview: async (payload) => {
    const response = await api.post('reviews/', payload);
    return response.data;
  },
};