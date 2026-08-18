import api from './api';

export const accountApi = {
    login: async (credentials) =>{
        const response = await api.post('auth/login/', credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('auth/register/', userData);
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('profiles/me/');
        return response.data;
    }
}