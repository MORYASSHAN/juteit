import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { UserRole } from "../backend.d";

interface AuthContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isOwner: boolean;
  isLoggedIn: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(UserRole.guest);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
  }, []);

  const logout = useCallback(() => {
    setRoleState(UserRole.guest);
  }, []);

  const isOwner = role === UserRole.admin;
  const isLoggedIn = role !== UserRole.guest;

  return (
    <AuthContext.Provider
      value={{ role, setRole, isOwner, isLoggedIn, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
