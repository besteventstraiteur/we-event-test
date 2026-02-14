// useAuth Hook
// Custom hook for authentication management

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import { API_ENDPOINTS } from '../config/api.config';

// Types
interface User {
  id: string;
  email: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isClient: boolean;
  isProvider: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  role: 'CLIENT' | 'PROVIDER';
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await ApiService.get<{ success: boolean; data: { user: User } }>(
          API_ENDPOINTS.AUTH.ME
        );
        
        if (response.success && response.data.user) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await ApiService.post<{
        success: boolean;
        data: {
          user: User;
          accessToken: string;
          refreshToken: string;
        };
      }>(API_ENDPOINTS.AUTH.LOGIN, { email, password });

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Save tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Set user
        setUser(user);
        
        // Redirect based on role
        if (user.role === 'PROVIDER') {
          navigate('/provider/dashboard');
        } else if (user.role === 'CLIENT') {
          navigate('/client/dashboard');
        } else if (user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      const response = await ApiService.post<{
        success: boolean;
        data: {
          user: User;
          accessToken: string;
          refreshToken: string;
        };
      }>(API_ENDPOINTS.AUTH.REGISTER, data);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Save tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Set user
        setUser(user);
        
        // Redirect based on role
        if (user.role === 'PROVIDER') {
          navigate('/provider/dashboard');
        } else {
          navigate('/client/dashboard');
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  // Logout function
  const logout = () => {
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Clear user
    setUser(null);
    
    // Redirect to login
    navigate('/login');
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await ApiService.put<{
        success: boolean;
        data: { user: User };
      }>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);

      if (response.success && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  };

  // Computed values
  const isAuthenticated = !!user;
  const isClient = user?.role === 'CLIENT';
  const isProvider = user?.role === 'PROVIDER';
  const isAdmin = user?.role === 'ADMIN';

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    isClient,
    isProvider,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export types
export type { User, AuthContextType, RegisterData };
