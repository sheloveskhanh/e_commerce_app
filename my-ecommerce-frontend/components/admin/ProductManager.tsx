"use client";
import { useEffect, useState, useCallback } from "react";
import ProductList from "../products/ProductList";
import ProductForm from "./ProductForm";
import AdminControls from "./AdminControls";
import CategoryFilter from "../../pages/CategoryFilter";
import SearchBar from "../../pages/SearchBar";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface ProductManagerProps {
  isAdmin: boolean;
  categories: string[];
}

const ProductManager: React.FC<ProductManagerProps> = ({ isAdmin, categories }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [isAddFormVisible, setIsAddFormVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/products", {
        method: "GET",
        cache: "no-cache",
      });
      const data = await response.json();
      setProducts(data.products || data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleEditClick = (product: Product) => {
    setEditProduct(product);
    setIsAddFormVisible(true);
  };

  const handleAddClick = () => {
    setEditProduct(null);
    setIsAddFormVisible(true);
  };

  const handleCreateOrUpdate = async () => {
    if (!isAdmin) return;

    const payload = editProduct
      ? { ...editProduct }
      : { name: "", description: "", price: 1, imageUrl: "", category: "Clothing" };

    if (!editProduct) delete payload._id; 
    const imageUrlPattern = /^(https?:\/\/.*\.(png|jpg|jpeg|gif|svg|webp|avif)(\?.*)?)$/i;

    if (!payload.imageUrl || !imageUrlPattern.test(payload.imageUrl.trim())) {
      alert("⚠️ Please enter a valid image URL.");
      return;
    }

    const url = editProduct
      ? `http://localhost:5000/products/${editProduct._id}`
      : "http://localhost:5000/products"; 

    const method = editProduct ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await response.json();
        alert(editProduct ? "✅ Product updated!" : "✅ Product added!");

        setIsAddFormVisible(false);
        setEditProduct(null);

        fetchProducts();
      } else {
        const data = await response.json();
        alert(`❌ Failed to save product: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      alert("❌ Something went wrong!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm("⚠️ Are you sure you want to delete this product?")) return;
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("🗑️ Product deleted successfully!");
        await fetchProducts();
      } else {
        const data = await response.json();
        alert(`❌ Failed to delete product: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      alert("❌ Something went wrong!");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || product.category === selectedCategory)
  );

  return (
    <div>
      <AdminControls onAdd={handleAddClick} isAdmin={isAdmin} />

      <div className="searchFilterContainer">
        <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      </div>

      <ProductList
        products={filteredProducts}
        isAdmin={isAdmin}
        selectedCategory={selectedCategory}
        onEdit={handleEditClick}
        onDelete={handleDelete} 
      />

      {isAddFormVisible && (
        <ProductForm
          product={editProduct || { name: "", description: "", price: 1, imageUrl: "", category: "Clothing" }}
          categories={categories}
          onChange={(e) =>
            setEditProduct((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
          onSave={handleCreateOrUpdate}
          onCancel={() => setIsAddFormVisible(false)}
        />
      )}
    </div>
  );
};

export default ProductManager;
