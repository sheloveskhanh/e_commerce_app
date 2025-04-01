"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../../components/modal/Modal"; 
import Login from "../../components/auth/Login"; 
import Signup from "../../components/auth/Signup"; 
import styles from "@styles/Navbar.module.css";

const Navbar = () => {
  const auth = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  if (!auth) return null;
  const { user, logout } = auth;

  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/products">Products</Link>
          </li>
          {user ? (
            <>
              {user.role === "admin" && (
                <li>
                  <Link href="/admin">Admin</Link>
                </li>
              )}
              <li>
                <button
                  className={styles.navButton}
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button className={styles.navButton} onClick={() => setShowLoginModal(true)}>
                  Login
                </button>
              </li>
              <li>
                <button className={styles.navButton} onClick={() => setShowRegisterModal(true)}>
                  Register
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {showLoginModal && (
        <Modal onClose={() => setShowLoginModal(false)}>
          <Login />
        </Modal>
      )}

      {showRegisterModal && (
        <Modal onClose={() => setShowRegisterModal(false)}>
          <Signup />
        </Modal>
      )}
    </div>
  );
};

export default Navbar;
