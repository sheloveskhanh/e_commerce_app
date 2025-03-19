import AdminGuard from "../../components/auth/AdminGuard";

const ManageProducts = () => {
  return (
    <AdminGuard>
      <h1>Manage Products</h1>
      <p>Only admins can access this page.</p>
    </AdminGuard>
  );
};

export default ManageProducts;
