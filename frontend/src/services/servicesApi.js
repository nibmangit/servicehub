import api from "./api";

export const servicesApi = {
  // filters: { category, price_type, min_price, max_price, search, ordering, page }
  getServices: async (filters = {}) => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params[key] = value;
      }
    });
    const response = await api.get('services/', { params });
    return response.data;
  },

  getService: async (id) => {
    const response = await api.get(`services/${id}/`);
    return response.data;
  },
  
};