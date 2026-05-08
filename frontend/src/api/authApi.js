import api from './axios';

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    googleLogin: (googleData) => api.post('/auth/google', googleData),
    getProfile: () => api.get('/auth/profile'),
};
