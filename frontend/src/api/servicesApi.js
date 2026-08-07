import client from './client';

export const servicesApi = { 
    getCategories: async () => {
        const response = await client.get("categories/");
        if (response.data && Array.isArray(response.data.results)) {
            return response.data.results;
        }
        return Array.isArray(response.data) ? response.data : [];
    },

    // Create a new service (Step 1)
    createService: async (serviceData) => {
        const response = await client.post("services/", serviceData);
        return response.data;
    },

    // Upload an image to a specific service (Step 2)
    uploadServiceImage: async (serviceId, imageFile, isPrimary = false) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("is_primary", isPrimary);

        const response = await client.post(`services/${serviceId}/images/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};