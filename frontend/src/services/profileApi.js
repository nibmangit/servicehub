import api from './api';

export const profileApi = {
  getMyProfile: async () => {
    const response = await api.get('profiles/me/');
    return response.data || response.data.results || [];
  },
  updateMyProfile: async (data) => {
    const response = await api.patch('profiles/me/', data);
    return response.data || response.data.results || [];
  },
  getSkills: async () => {
    const response = await api.get('profiles/skills/');
    return response.data.results || response.data || [];
  },
  getRandomFin: async () => { 
    const response = await api.get('identity/random-test-fin/');
    return response.data || response.data.results || [];
  },
  verifyFayda: async (finData) => { 
    const response = await api.post('identity/verify-fayda/', finData);
    return response.data || response.data.results || [];
  },
  getIdentityStatus: async () => {
    const response = await api.get('identity/status/');
    return response.data || response.data.results || [];
  },
  applyProvider: async (data) => {
    const response = await api.post('profiles/apply-provider/', data);
    return response.data || response.data.results || [];
  },
  getProviderApplication: async (data) => {
  const response = await api.get('profiles/apply-provider/', data); // Adjust if your endpoint differs
  return response.data || response.data.results || [];
 },
  updateProviderApplication: async (data) => {
  const response = await api.patch('profiles/apply-provider/', data); // Adjust if your endpoint differs
  return response.data || response.data.results || [];
 },

 getPublicProviderProfile: async (id) => {
  const response = await api.get(`profiles/providers/${id}/`);
  return response.data || response.data.results || [];
},
};