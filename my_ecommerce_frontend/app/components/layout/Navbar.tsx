"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const auth = useAuth(); // Get the entire context first

  if (!auth) {
    return null; // Prevent rendering if auth context is not available
  }

  const { user, logout } = auth; // Destructure only if context exists
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
          <Link href="/login" className="nav-link">Login</Link>
          <Link href="/register" className="nav-link">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
