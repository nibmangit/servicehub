import api from './api';

export const profileApi = {
  getMyProfile: async () => {
    const response = await api.get('profiles/me/');
    return response.data;
  },
  updateMyProfile: async (data) => {
    const response = await api.patch('profiles/me/', data);
    return response.data;
  },
  getSkills: async () => {
    const response = await api.get('profiles/skills/');
    return response.data.results || [];
  },
  getRandomFin: async () => { 
    const response = await api.get('identity/random-test-fin/');
    return response.data;
  },
  verifyFayda: async (finData) => { 
    const response = await api.post('identity/verify-fayda/', finData);
    return response.data;
  },
  getIdentityStatus: async () => {
    const response = await api.get('identity/status/');
    return response.data;
  },
  applyProvider: async (data) => {
    const response = await api.post('profiles/apply-provider/', data);
    return response.data;
  },
  getProviderApplication: async (data) => {
  const response = await api.get('profiles/apply-provider/', data); // Adjust if your endpoint differs
  return response.data;
 },
  updateProviderApplication: async (data) => {
  const response = await api.patch('profiles/apply-provider/', data); // Adjust if your endpoint differs
  return response.data;
 },

 getPublicProviderProfile: async (id) => {
  const response = await api.get(`profiles/providers/${id}/`);
  return response.data;
},
};