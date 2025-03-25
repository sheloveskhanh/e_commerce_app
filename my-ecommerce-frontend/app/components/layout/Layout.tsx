"use client";

import { AuthProvider } from "../../context/AuthContext"; 
import Navbar from "../../components/layout/Navbar"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar /> 
      {children}
    </AuthProvider>
  );
}
