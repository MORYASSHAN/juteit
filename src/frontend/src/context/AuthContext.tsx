import type React from "react";
<<<<<<< HEAD
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
=======
import { createContext, useCallback, useContext, useState } from "react";
import { UserRole } from "../backend.d";

interface AuthContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
  isOwner: boolean;
  isLoggedIn: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
<<<<<<< HEAD
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
=======
  const [role, setRoleState] = useState<UserRole>(UserRole.guest);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
  }, []);

  const logout = useCallback(() => {
    setRoleState(UserRole.guest);
  }, []);

  const isOwner = role === UserRole.admin;
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
  const isLoggedIn = role !== UserRole.guest;

  return (
    <AuthContext.Provider
<<<<<<< HEAD
      value={{ user, role, setAuth, isOwner, isLoggedIn, logout }}
=======
      value={{ role, setRole, isOwner, isLoggedIn, logout }}
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
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
