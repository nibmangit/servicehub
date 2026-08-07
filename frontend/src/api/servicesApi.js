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
        const response = await client.post("services/mine/", serviceData);
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


 
    getMyServices: async () => {
        const response = await client.get("services/mine/"); 
        if (response.data && Array.isArray(response.data.results)) {
            return response.data.results;
        }
        return Array.isArray(response.data) ? response.data : [];
    },

    getServiceById: async (serviceId) => {
        const response = await client.get(`services/${serviceId}/`);
        if (response.data && Array.isArray(response.data.results)) {
            return response.data.results[0] || response.data;
        }
        return response.data;
    },
 
    deleteService: async (serviceId) => {
        const response = await client.delete(`services/${serviceId}/`);
        return response.data;
    },

    updateService: async (serviceId, serviceData) => {
        const response = await client.patch(`services/${serviceId}/`, serviceData);
        return response.data;
    },
 
    updateServiceStatus: async (serviceId, isActive) => {
        const response = await client.patch(`services/${serviceId}/`, { is_active: isActive });
        return response.data;
    },

    deleteServiceImage: async (imageId) => {
        const response = await client.delete(`services/images/${imageId}/`);
        return response.data;
    },
};