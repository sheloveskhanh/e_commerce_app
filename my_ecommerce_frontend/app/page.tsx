"use client";
import { useEffect, useState } from "react";
import ProductList from "@/app/components/products/ProductList";
import ProductForm from "@/app/components/admin/ProductForm";
import CategoryFilter from "@/app/pages/CategoryFilter";
import SearchBar from "@/app/pages/SearchBar";

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

  // ✅ Check user role safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userRole = localStorage.getItem("role");
      setIsAdmin(userRole === "admin");
    }
  }, []);

  // ✅ Fetch products based on category selection
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

  return (
    <div className="container">
      <h1 className="title">Products</h1>

      <div className="searchFilterContainer">
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(event) => setSelectedCategory(event.target.value)} // ✅ Fixed event handling
        />
      </div>

      <ProductList products={products} isAdmin={isAdmin} selectedCategory={selectedCategory} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
}
