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
  getProviderApplicationStatus: async () => {
    const response = await api.get('profiles/application-status/');
    return response.data;
  }
};