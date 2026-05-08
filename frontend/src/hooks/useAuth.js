import { create } from 'zustand';
import { authApi } from '../api/authApi';

/**
 * Senior-level Auth Store with persistent session hydration and standardized data mapping.
 */
export const useAuthStore = create((set, get) => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: true, // Start with loading true for hydration
    error: null,
    isInitialized: false,

    setLoading: (status) => set({ loading: status }),

    /**
     * Authenticate user and initialize session
     */
    login: async (credentials) => {
        set({ loading: true, error: null });
        try {
            const response = await authApi.login(credentials);
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            set({ user, token, loading: false, isInitialized: true });
            return true;
        } catch (err) {
            const msg = err?.errors?.length > 0 ? err.errors[0] : (err?.message || 'Invalid credentials');
            set({ error: msg, loading: false });
            return false;
        }
    },

    /**
     * Restore session from token on mount/refresh
     */
    fetchProfile: async () => {
        const token = get().token;
        if (!token) {
            set({ loading: false, isInitialized: true });
            return;
        }

        try {
            set({ loading: true });
            const response = await authApi.getProfile();
            // Standardize field mapping for the frontend
            const userData = response.data;
            set({ user: userData, loading: false, isInitialized: true });
        } catch (err) {
            console.error("Session restoration failed:", err);
            get().logout();
            set({ loading: false, isInitialized: true });
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            await authApi.register(userData);
            set({ loading: false });
            return true;
        } catch (err) {
            const msg = err?.errors?.length > 0 ? err.errors[0] : (err?.message || 'Registration failed');
            set({ error: msg, loading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isInitialized: true });
    }
}));
