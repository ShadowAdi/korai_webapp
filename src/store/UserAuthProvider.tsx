"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { User } from "@/types/Types";

type UserContextType = {
  user: User | null;
  logout: () => void;
  getToken: () => string | null;
  setToken: (token: string) => void;
  globalLoading: boolean;
  setGlobalLoading: (val: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [globalLoading, setGlobalLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const setToken = (token: string) => {
    localStorage.setItem("token", token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const fetchUser = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setGlobalLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/getUserByToken", {
        method: "GET",
        headers: { token },
      });
      const user = await res.json();
      if (user) {
        setUser(user);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout();
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        logout,
        getToken,
        setToken,
        globalLoading,
        setGlobalLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
