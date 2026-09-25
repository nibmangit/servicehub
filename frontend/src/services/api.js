import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response, // If the request succeeds, just return it
  async (error) => {
    const originalRequest = error.config;

    // Check if the request was made to an auth endpoint (login, register, or refresh)
    const isAuthEndpoint = 
      originalRequest.url?.includes('auth/login') ||
      originalRequest.url?.includes('auth/register') ||
      originalRequest.url?.includes('auth/refresh');

    // If it's an auth request and fails, pass the error directly to the component (no refresh/redirect)
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we are trying a refresh

      try {
        const refreshToken = localStorage.getItem("refresh_token");
         
        const response = await axios.post(`${BASE_URL}auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
 
        localStorage.setItem("access_token", newAccessToken);

        // Update the header of the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) { 
        console.error("Refresh token expired. Logging out.");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;