"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface User {
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log("✅ AuthProvider is rendering!"); // Debugging

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("🔍 Checking stored user..."); // Debugging

    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      console.log("🔍 Retrieved user from localStorage:", storedUser); // Debugging

      if (storedUser) {
        setUser(JSON.parse(storedUser));
        console.log("✅ User set in state:", JSON.parse(storedUser)); // Debugging
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login: () => {}, logout: () => {} }}>
      {children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log("🛠 useAuth Debug - Context Value:", context); // Debugging

  if (!context) {
    console.error("❌ ERROR: useAuth() is being used outside AuthProvider!");
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
