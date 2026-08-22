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


  getMyServices: async () => {
    const response = await api.get('services/mine/');
    return response.data;
  },

  createService: async (data) => {
    const response = await api.post('services/mine/', data);
    return response.data;
  },

  updateService: async (id, data) => {
    const response = await api.patch(`services/${id}/`, data);
    return response.data;
  },

  deleteService: async (id) => {
    await api.delete(`services/${id}/`);
  },


  uploadServiceImage: async (serviceId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`services/${serviceId}/images/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteServiceImage: async (imageId) => {
    await api.delete(`services/images/${imageId}/`);
  },
  
};