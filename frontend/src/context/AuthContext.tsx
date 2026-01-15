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
        // With cookies, we just try to get the profile. 
        // If cookie exists and is valid, this succeeds.
        const profile = await userService.getProfile();
        setUser(profile);
      } catch {
        // If fails (401), we are not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const user = await userService.login(credentials);
    setUser(user);

    // We don't need to manually set token
  };

  const logout = async () => {
    await userService.logout();
    setUser(null);
    // Cookie is cleared by server response
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
