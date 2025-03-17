"use client"; // ✅ This ensures Navbar runs on the client

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="navbar">
      <Link href="/" className="nav-link">Home</Link>
      <Link href="/products" className="nav-link">Products</Link>

      {user ? (
        <>
          {user.role === "admin" && <Link href="/admin" className="nav-link">Admin</Link>}
          <button className="nav-button" onClick={() => { logout(); router.push("/"); }}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
