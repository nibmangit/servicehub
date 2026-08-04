import axios from 'axios';

// 1 create the axios instance
const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {  
        "Content-Type": "application/json"
    }
})

// 2 intercept the request and add the token
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default client;