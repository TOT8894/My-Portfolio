import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, setAccessToken, getAccessToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!getAccessToken()) {
        setAccessToken(null);
        setAuthLoading(false);
        return;
      }

      try {
        // Try refreshing token or fetching current user profile
        const refreshRes = await authService.refreshToken();
        if (refreshRes?.data?.accessToken) {
          setAccessToken(refreshRes.data.accessToken);
          const meRes = await authService.getMe();
          setAdminUser(meRes.data.user);
        }
      } catch (err) {
        // Not logged in or expired refresh token
        setAccessToken(null);
        setAdminUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email: email.trim(), password });
    if (res.data.accessToken) {
      setAccessToken(res.data.accessToken);
      setAdminUser(res.data.user);
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout request error:", e);
    } finally {
      setAccessToken(null);
      setAdminUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        authLoading,
        login,
        logout,
        setAdminUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
