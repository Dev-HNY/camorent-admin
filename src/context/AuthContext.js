import React, { createContext, useState, useContext, useEffect } from 'react';
import { adminLogin, adminLogout, getCurrentUser, isLoggedIn } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Error checking auth status
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone_number, password) => {
    try {
      const result = await adminLogin(phone_number, password);

      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      // Login error
      const errorMessage = error.message || error.toString() || 'An unexpected error occurred';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await adminLogout();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      // Logout error
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
