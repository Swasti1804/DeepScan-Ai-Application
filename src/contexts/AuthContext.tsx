import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, googleAuth } from '../services/authService';
import { jwtDecode } from 'jwt-decode'; 

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          // Optionally validate token with backend here
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleAuthSuccess = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setError(null);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user: userData, token } = await loginUser(email, password);
      handleAuthSuccess(userData, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user: userData, token } = await registerUser(email, password, name);
      handleAuthSuccess(userData, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (credential: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Decode to get basic user info immediately
      const decoded: { email: string; name: string; picture?: string } = jwt_decode(credential);
      
      // Verify with backend
      const { user: userData, token } = await googleAuth(credential);
      
      // Merge with potentially more complete backend data
      const completeUserData = {
        ...userData,
        avatar: decoded.picture || userData.avatar
      };
      
      handleAuthSuccess(completeUserData, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        login, 
        register, 
        logout, 
        googleLogin,
        clearError 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};