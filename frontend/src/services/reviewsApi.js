import api from "./api";

export const reviewsApi = { 
  getServiceReviews: async (serviceId) => {
    const response = await api.get('reviews/', { params: { service: serviceId } });
    return response.data;
  },

  createReview: async (payload) => {
    const response = await api.post('reviews/', payload);
    return response.data;
  },
};