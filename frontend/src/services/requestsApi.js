import api from "./api";

export const requestsApi = {
  // POST /api/requests/  { service, description, preferred_date, address }
  createRequest: async (payload) => {
    const response = await api.post('requests/', payload);
    return response.data;
  },

  // GET /api/requests/  (both roles, backend filters by user automatically)
  getRequests: async () => {
    const response = await api.get('requests/');
    return response.data;
  },

  // GET /api/requests/:id/
  getRequest: async (id) => {
    const response = await api.get(`requests/${id}/`);
    return response.data;
  },

  // PATCH /api/requests/:id/status/  { status, otp_code?, rejection_reason? }
  updateStatus: async (id, payload) => {
    const response = await api.patch(`requests/${id}/status/`, payload);
    return response.data;
  },
};