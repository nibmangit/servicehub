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

    getSkills: async () => {
    const response = await client.get("profiles/skills/"); 
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    } 
    return Array.isArray(response.data) ? response.data : [];
  },

  // Submit the provider application
  submitApplication: async (applicationData) => {
    const response = await client.post("profiles/apply-provider/", applicationData);
    return response.data;
  },
};