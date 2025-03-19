import { useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../../../context/AuthContext";

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user } = useContext(AuthContext) || {}; 
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.replace("/"); 
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return null; 
  }

  return <>{children}</>;
};

export default AdminGuard;
