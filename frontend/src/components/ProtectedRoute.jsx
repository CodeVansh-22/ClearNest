import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';

const ProtectedRoute = () => {
    const { token } = useAuthStore();
    
    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
