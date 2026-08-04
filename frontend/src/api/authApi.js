import client from './client';

export const authApi = {
    login: async (credentials) => {
        const response = await client.post('auth/login/', credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await client.post('auth/register/', userData);
        return response.data;
    },

    getProfile: async () => {
        const response = await client.get('auth/me/');
        return response.data;
    },
     
};