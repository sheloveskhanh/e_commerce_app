"use client";
import { useEffect, useState } from "react";
import ProductList from "@/components/products/ProductList";
import ProductForm from "@/components/admin/ProductForm";
import CategoryFilter from "@/pages/CategoryFilter";
import SearchBar from "@/pages/SearchBar";


const API_URL = "http://localhost:5000/products";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

const categories = ["All", "Clothing", "Accessories", "Electronics", "Home", "Others"];

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      console.log("🔍 Checking stored user:", storedUser); // Debugging
  
      if (storedUser) {
        const userData = JSON.parse(storedUser); // ✅ Parse the user object
        console.log("✅ Parsed User Data:", userData); // Debugging
        setIsAdmin(userData.role === "admin"); // ✅ Correctly check role inside user
      }
    }
  }, []);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}?category=${selectedCategory}`);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleAddProduct = () => {
    setCurrentProduct({}); 
    setIsFormOpen(true);
  };

  const handleSaveProduct = () => {
    console.log("Product saved:", currentProduct);
    setIsFormOpen(false);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="container">
      <h1 className="title">Products</h1>

      <div className="searchFilterContainer">
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(event) => setSelectedCategory(event.target.value)}
        />
      </div>

      {isAdmin && (
        <button className="addButton" onClick={handleAddProduct}>
          Add Product
        </button>
      )}

      <ProductList 
        products={products} 
        isAdmin={isAdmin} 
        selectedCategory={selectedCategory} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />

      {isFormOpen && (
        <ProductForm 
          product={currentProduct} 
          categories={categories} 
          onChange={(e) => setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value })} 
          onSave={handleSaveProduct} 
          onCancel={handleCancel} 
        />
      )}
    </div>
  );
}
