import type React from "react";
import { createContext, useCallback, useContext, useState, useEffect } from "react";

export enum UserRole {
  owner = "owner",
  buyer = "buyer",
  guest = "guest"
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  role: UserRole;
  setAuth: (user: User, token: string) => void;
  isOwner: boolean;
  isLoggedIn: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.guest);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
    }
  }, []);

  const setAuth = useCallback((user: User, token: string) => {
    setUser(user);
    setRole(user.role);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole(UserRole.guest);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const isOwner = role === UserRole.owner;
  const isLoggedIn = role !== UserRole.guest;

  return (
    <AuthContext.Provider
      value={{ user, role, setAuth, isOwner, isLoggedIn, logout }}
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
