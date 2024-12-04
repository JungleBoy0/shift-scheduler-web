import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import bcrypt from "bcryptjs";

type Admin = {
  uuid: string;
  name: string;
  login: string;
  permissions: string;
};

type AuthContextType = {
  admin: Admin | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const stored = localStorage.getItem('admin');
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      localStorage.setItem('admin', JSON.stringify(admin));
    } else {
      localStorage.removeItem('admin');
    }
  }, [admin]);

  const login = async (login: string, password: string) => {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('login', login)
      .single();

    if (error || !data) {
      throw new Error('Invalid credentials');
    }

    // Compare the provided password with the stored hash
    const isValidPassword = await bcrypt.compare(password, data.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    setAdmin({
      uuid: data.uuid,
      name: data.name,
      login: data.login,
      permissions: data.permissions,
    });

    navigate('/');
  };

  const logout = () => {
    setAdmin(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};