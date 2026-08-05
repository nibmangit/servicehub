import client from './client';

export const profileApi = {
    getProfile: async () => {
        const response = await client.get('profiles/me/');
        return response.data;
    },
    updateProfile: async (profileData) => {
        const response = await client.patch('profiles/me/', profileData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};