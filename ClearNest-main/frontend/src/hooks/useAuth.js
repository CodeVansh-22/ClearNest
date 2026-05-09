import { create } from 'zustand';
import { authApi } from '../api/authApi';

// NOTE: axios interceptor returns response.data directly (the full JSON body).
// So API calls return: { success, message, data: { token, user } }
// We must destructure from .data nested field.

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,

    login: async (credentials) => {
        set({ loading: true, error: null });
        try {
            // response = { success, message, data: { token, user } }
            const response = await authApi.login(credentials);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            set({ user, token, loading: false });
            return true;
        } catch (err) {
            const msg = err?.message || err || 'Login failed';
            set({ error: msg, loading: false });
            return false;
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            await authApi.register(userData);
            set({ loading: false });
            return true;
        } catch (err) {
            const msg = err?.message || err || 'Registration failed';
            set({ error: msg, loading: false });
            return false;
        }
    },

    googleLogin: async (googleData) => {
        set({ loading: true, error: null });
        try {
            // response = { success, message, data: { token, user } }
            const response = await authApi.googleLogin(googleData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            set({ user, token, loading: false });
            return true;
        } catch (err) {
            const msg = err?.message || err || 'Google sign in failed';
            set({ error: msg, loading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
    },

    fetchProfile: async () => {
        try {
            // response = { success, message, data: { email, role, ... } }
            const response = await authApi.getProfile();
            set({ user: response.data });
        } catch (err) {
            // Profile fetch failed - token is invalid/expired
            localStorage.removeItem('token');
            set({ user: null, token: null });
        }
    }
}));
