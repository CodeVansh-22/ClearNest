import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes';
import { useAuthStore } from './hooks/useAuth';
import './index.css';

function App() {
  const { fetchProfile, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token, fetchProfile]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
