import React, { createContext, useState, useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Define types for AuthContext
interface AuthState {
  isLoggedIn: boolean;
  user: { email: string; name?: string } | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Dummy user data for demonstration
const DUMMY_USER = {
  email: 'admin@megamart.com',
  password: 'admin123',
  name: 'Test User'
};

// 2. Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create a provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<boolean> => {
    // Dummy login logic
    if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
      setIsLoggedIn(true);
      setUser({ email: DUMMY_USER.email, name: DUMMY_USER.name });
      console.log('Login successful!');
      navigate('/'); // Redirect to home/dashboard on successful login
      return true;
    } else {
      console.log('Login failed: Invalid credentials');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Dummy register logic
    // In a real app, you'd send this to a backend.
    // For this example, we'll just "succeed" and redirect to login.
    console.log(`Registering user: ${name}, ${email}, ${password}`);
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        // Here you would typically make an API call to register the user
        // and handle success/failure from the API response.
        // For now, we'll just simulate success.
        resolve(true);
      }, 500);
    });
  };

  const logout = (): void => {
    setIsLoggedIn(false);
    setUser(null);
    console.log('Logged out');
    navigate('/login'); // Redirect to login page on logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
