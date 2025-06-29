import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  phone: string;
  role: 'admin' | 'customer';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, password?: string, isAdmin?: boolean) => Promise<boolean>;
  logout: () => void;
  resetPassword: (phone: string, currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (phone: string, password?: string, isAdmin?: boolean): Promise<boolean> => {
    if (isAdmin) {
      // Updated admin credentials
      const adminCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{"phone":"7815981315","password":"Phk@1234"}');
      
      if (phone === adminCredentials.phone && password === adminCredentials.password) {
        const adminUser: User = {
          id: 'admin-1',
          phone,
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return true;
      }
      return false;
    } else {
      // Customer login - check if phone exists in customers (can have multiple entries with same phone)
      const customers = JSON.parse(localStorage.getItem('customers') || '[]');
      const customerExists = customers.some((c: any) => c.phone === phone);
      
      if (customerExists) {
        const customerUser: User = {
          id: `customer-${phone}`, // Use phone as part of ID for uniqueness
          phone,
          role: 'customer',
          name: customers.find((c: any) => c.phone === phone)?.name
        };
        setUser(customerUser);
        localStorage.setItem('currentUser', JSON.stringify(customerUser));
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const resetPassword = async (phone: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    const adminCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{"phone":"7815981315","password":"Phk@1234"}');
    
    if (phone === adminCredentials.phone && currentPassword === adminCredentials.password) {
      const newCredentials = { phone, password: newPassword };
      localStorage.setItem('adminCredentials', JSON.stringify(newCredentials));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, resetPassword }}>
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