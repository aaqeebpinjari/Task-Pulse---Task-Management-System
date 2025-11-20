import { createContext, type ReactNode, useCallback, useEffect,useMemo, useState,} from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';

// Shape of values available through AuthContext
interface AuthContextValue {
  user: { _id: string; name: string; email: string } | null;
  token: string | null;
  initializing: boolean;
  authLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

// Create the authentication context
export const AuthContext = createContext<AuthContextValue | null>(null);

// Provider wrapper for authentication state + actions
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextValue['user']>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Fetch logged-in user's profile using JWT token
  const fetchProfile = useCallback(async () => {
    if (!token) {
      setInitializing(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setInitializing(false);
    }
  }, [token]);

// Automatically load profile whenever token changes
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

    // Login and save token + user in state
  const login = useCallback(async (payload: { email: string; password: string }) => {
    setAuthLoading(true);
    try {
      const { data } = await api.post('/auth/login', payload);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success('Welcome back!');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to login';
      toast.error(message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, []);

   // Register and auto-login user
  const register = useCallback(async (payload: { name: string; email: string; password: string }) => {
    setAuthLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success('Account created!');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to register';
      toast.error(message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, []);

    // Logout and clear all auth data
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Signed out');
  }, []);

  
  // Memoize context value for performance
  const value = useMemo(
    () => ({ user, token, initializing, authLoading, login, register, logout }),
    [user, token, initializing, authLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

