import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [badgeRefreshTrigger, setBadgeRefreshTrigger] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const savedToken = localStorage.getItem('token');
    console.log('Checking auth, token:', savedToken ? 'exists' : 'missing');
    
    if (savedToken) {
      setToken(savedToken);
      try {
        const response = await authAPI.getProfile();
        console.log('Profile fetched successfully:', response.data.user);
        setUser(response.data.user);
      } catch (error) {
        console.error('Auth check failed:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const updateUserPoints = (totalPoints, level) => {
    setUser(prev => ({
      ...prev,
      gamification: {
        ...prev.gamification,
        totalPoints,
        level
      }
    }));
  };

  // NEW: Trigger badge refresh across all components
  const triggerBadgeRefresh = () => {
    setBadgeRefreshTrigger(prev => prev + 1);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        updateUserPoints,
        badgeRefreshTrigger,
        triggerBadgeRefresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};