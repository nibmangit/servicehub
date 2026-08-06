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

    // Fetch existing provider application (useful for checking status & pre-filling on rejection)
    getApplication: async () => {
        const response = await client.get("profiles/apply-provider/");
        return response.data;
    },

    // Update/Resubmit a rejected provider application
    updateApplication: async (applicationData) => {
        const response = await client.patch("profiles/apply-provider/", applicationData);
        return response.data;
    },
};