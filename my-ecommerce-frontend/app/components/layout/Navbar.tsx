"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "@styles/Navbar.module.css"; 

const Navbar = () => {
  const auth = useAuth();

  if (!auth) return null;

  const { user, logout } = auth;
  const router = useRouter();

  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        <ul className={styles.navLinks}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/products">Products</Link></li>

          {user ? (
            <>
              {user.role === "admin" && (
                <li><Link href="/admin">Admin</Link></li>
              )}
              <li>
                <button onClick={() => { logout(); router.push("/"); }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
