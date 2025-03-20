"use client";

import { AuthProvider } from "@/app/context/AuthContext"; // ✅ Import AuthProvider
import Navbar from "@/app/components/layout/Navbar"; // ✅ Import Navbar

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log("✅ layout.tsx is rendering!"); // Debugging

  return (
    <AuthProvider>
      <Navbar /> 
      {children}
    </AuthProvider>
  );
}
