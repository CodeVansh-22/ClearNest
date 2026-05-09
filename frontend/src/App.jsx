import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes';
import { useAuthStore } from './hooks/useAuth';
import './index.css';

function App() {
  const { fetchProfile, token, isInitialized, loading } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Prevent UI flickering while restoring session
  if (!isInitialized && loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
