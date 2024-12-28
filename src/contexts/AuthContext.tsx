import { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { JwtResponse } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: JwtResponse | null;
  login: (response: JwtResponse) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<JwtResponse | null>(null);

  const login = (response: JwtResponse) => {
    localStorage.setItem('token', response.token);
    setIsAuthenticated(true);
    setUser(response);
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
