import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Get user error:', error.message);
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.name || '',
          email: data.user.email || '',
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    getUser();
  }, []);

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        alert(error.message);
        console.error('Register error:', error.message);
        return false;
      }

      if (!data.user) {
        alert('Registration failed. Please try again.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      alert('Unexpected registration error');
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error || !data.user) {
        alert(error?.message || 'Login failed');
        console.error('Login error:', error?.message);
        return false;
      }

      setUser({
        id: data.user.id,
        name: data.user.user_metadata?.name || '',
        email: data.user.email || '',
      });

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      alert('Unexpected login error');
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};