import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import api from '../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

type FetchFeaturedBooks = (sortOrder: string) => Promise<void>;
type FetchBookDetails = (bookId: number) => Promise<void>;

interface AuthContextType {
  user: User | null;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}


interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = Cookies.get('jwt');
      if (!token) {
        setLoggedIn(false);
        setUser(null);
        return;
      }
      try {
        const response = await api.get('auth/current-user');
        if (response.data.status === 'success') {
          setUser(response.data.data.user);
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching current user", error);
        setLoggedIn(false);
        setUser(null);
      }
    };

    checkUserLoggedIn();
  }, []);


  return (
    <AuthContext.Provider value={{
      user, loggedIn, setLoggedIn, setUser,
      }}>
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


