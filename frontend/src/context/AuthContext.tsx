import { createContext, useState, useEffect, type ReactNode } from "react";
import type { User, LoginCredentials } from "../types";
import { userService } from "../services/userService";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {

        const profile = await userService.getProfile();
        setUser(profile);
      } catch {

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    await userService.login(credentials);
    const user = await userService.getProfile();
    setUser(user);
  };

  const logout = async () => {
    await userService.logout();
    setUser(null);

  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
