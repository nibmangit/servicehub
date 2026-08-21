import api from "./api";

export const reviewsApi = { 
  getServiceReviews: async (serviceId) => {
    const response = await api.get('reviews/', { params: { service: serviceId } });
    return response.data;
  },
};