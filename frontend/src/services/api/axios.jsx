import axios from "axios";

import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    removeTokens,
} from "../../utils/token";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refresh = getRefreshToken();

                const response = await axios.post(
                    "http://127.0.0.1:8000/api/auth/refresh/",
                    {
                        refresh,
                    }
                );

                const access = response.data.access;

                setTokens(access, refresh);

                originalRequest.headers.Authorization =
                    `Bearer ${access}`;

                return api(originalRequest);

            } catch (err) {
                removeTokens();

                window.location.href = "/auth/login";

                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;