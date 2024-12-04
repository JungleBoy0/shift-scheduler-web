import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Admin = {
  uuid: string;
  name: string;
  login: string;
  permissions: string;
};

type AuthContextType = {
  admin: Admin | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored admin session
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const login = async (login: string, password: string) => {
    const { data, error } = await supabase
      .from('admins')
      .select()
      .eq('login', login)
      .single();

    if (error || !data) {
      throw new Error('Invalid credentials');
    }

    // In a real app, you'd want to hash the password and compare with password_hash
    // For now, we're comparing directly (NOT SECURE - just for demo)
    if (data.password_hash !== password) {
      throw new Error('Invalid credentials');
    }

    const admin = {
      uuid: data.uuid,
      name: data.name,
      login: data.login,
      permissions: data.permissions,
    };

    setAdmin(admin);
    localStorage.setItem('admin', JSON.stringify(admin));
  };

  const logout = async () => {
    setAdmin(null);
    localStorage.removeItem('admin');
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