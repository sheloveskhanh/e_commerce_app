import { useAuth } from "../../../context/AuthContext";
import AdminGuard from "../../auth/AdminGuard";
import ProductManager from "../../admin/ProductManager";

const AdminPage = () => {
  const { user } = useAuth(); // ✅ Use the safe `useAuth()` hook

  if (!user || user.role !== "admin") {
    return <h2>Access Denied</h2>;
  }

  return (
    <AdminGuard>
      <h1>Admin Dashboard</h1>
      <ProductManager isAdmin={true} categories={["Electronics", "Clothing", "Accessories"]} />
    </AdminGuard>
  );
};

export default AdminPage;
