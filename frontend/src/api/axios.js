import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send cookies for refresh tokens
});

// Add a request interceptor to include JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // Try refreshing token on 401 (but not on auth endpoints)
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/login') &&
            !originalRequest.url?.includes('/auth/register') &&
            !originalRequest.url?.includes('/auth/google') &&
            !originalRequest.url?.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;
            try {
                const refreshRes = await axios.post(
                    `${API_BASE_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                const newToken = refreshRes.data?.data?.token;
                if (newToken) {
                    localStorage.setItem('token', newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch {
                // Refresh failed — clear auth state
                localStorage.removeItem('token');
            }
        }

        return Promise.reject(error.response?.data || error.message);
    }
);

export default api;
