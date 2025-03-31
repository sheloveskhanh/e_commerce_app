import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // <-- Change getAnalytics to getAuth

const firebaseConfig = {
  apiKey: "AIzaSyAB5nlUOktnaGVQxDit2y0ZLBkq8Rm0ykc",
  authDomain: "e-commerce-47cf9.firebaseapp.com",
  projectId: "e-commerce-47cf9",
  storageBucket: "e-commerce-47cf9.firebasestorage.app",
  messagingSenderId: "926350729646",
  appId: "1:926350729646:web:a8781069aa4f2e3c28283f",
  measurementId: "G-Y6FENPGNFM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

