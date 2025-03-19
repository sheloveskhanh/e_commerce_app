"use client";
import { useEffect, useState, useCallback } from "react";
import ProductList from "@components/ProductList";
import ProductForm from "./components/admin/ProductForm";
import CategoryFilter from "../app/pages/CategoryFilter";
import SearchBar from "..app/pages/SearchBar";
// ✅ Define API Base URL
const API_URL = "http://localhost:5000/products";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

const categories = [
  "All",
  "Clothing", 
  "Accessories",
  "Electronics",
  "Home",
  "Others",
];

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 1,
    imageUrl: "",
    category: "Clothing",
  });

  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [isAddFormVisible, setIsAddFormVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 6; 

  // ✅ Add back the isAdmin constant
  const isAdmin = true; 

  // ✅ Fix: Correct handleCategoryChange function
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      const response = await fetch(`${API_URL}?page=${page}&limit=${productsPerPage}`);

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();

      setProducts(data.products || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleCreateOrUpdate = async () => {
    if (!editProduct && !newProduct) return;

    const payload = editProduct ? { ...editProduct } : { ...newProduct };
    delete payload._id;

    const url = editProduct ? `${API_URL}/${editProduct._id}` : API_URL;
    const method = editProduct ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(editProduct ? "✅ Product updated successfully!" : "✅ Product added successfully!");
        setIsAddFormVisible(false);
        setEditProduct(null);
        await fetchProducts(currentPage);
      } else {
        const data = await response.json();
        alert(`❌ Failed to ${editProduct ? "update" : "add"} product: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Error handling product:", error);
      alert("❌ Something went wrong!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert("🗑️ Product deleted successfully!");
        await fetchProducts(currentPage);
      } else {
        const data = await response.json();
        alert(`❌ Failed to delete product: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      alert("❌ Something went wrong!");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Products</h1>
      <div className="searchFilterContainer">
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange} // ✅ Fixed type issue here
        />
      </div>

      {isAdmin && (
        <button className="addButton" onClick={() => { setEditProduct(null); setIsAddFormVisible(true); }}>
          Add Product
        </button>
      )}
      
      {/* ✅ Fix: Added selectedCategory to ProductList */}
      <ProductList
        products={products}
        isAdmin={isAdmin} // ✅ Fixed error: added isAdmin
        selectedCategory={selectedCategory} // ✅ Fixed error: added selectedCategory
        onEdit={setEditProduct}
        onDelete={handleDelete}
      />

      {/* ✅ Pagination */}
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage <= 1}>
          ⬅ Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))} disabled={currentPage >= totalPages}>
          Next ➡
        </button>
      </div>

      {isAddFormVisible && (
        <ProductForm product={editProduct || newProduct} categories={categories} onChange={handleCreateOrUpdate} onSave={handleCreateOrUpdate} onCancel={() => setIsAddFormVisible(false)} />
      )}
    </div>
  );
}
