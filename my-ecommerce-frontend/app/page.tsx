"use client";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@components/layout/Navbar"; // ✅ Import Navbar
import ProductList from "@components/products/ProductList";  
import ProductForm from "@components/admin/ProductForm";  
import CategoryFilter from "@components/pages/CategoryFilter";
import SearchBar from "@components/pages/SearchBar";  

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
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 6; 

  const isAdmin = true; 

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      console.log(`Fetching from: ${API_URL}?page=${page}&limit=${productsPerPage}`);
  
      const response = await fetch(`${API_URL}?page=${page}&limit=${productsPerPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
  
      const data = await response.json();
      setProducts(data.products || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
    }
  }, []);
  
  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]); 

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === "All" || product.category === selectedCategory)
  );

  const handleCreateOrUpdate = async () => {
    const productData = editProduct || newProduct;
  
    if (
      !productData?.name ||
      !productData?.description ||
      !productData?.price ||
      !productData?.imageUrl
    ) {
      alert("⚠️ All fields are required!");
      return;
    }
  
    const payload = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      imageUrl: productData.imageUrl,
      category: productData.category || "Clothing",
    };
  
    const url = editProduct ? `${API_URL}/${editProduct._id}` : API_URL;
    const method = editProduct ? "PUT" : "POST";
  
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Unknown error");
      }
  
      alert(editProduct ? "✅ Product updated!" : "✅ Product added!");
      setIsFormVisible(false);
      setEditProduct(null);
      await fetchProducts();
    } catch (error: any) {
      console.error("❌ Error handling product:", error);
      alert("❌ Failed to save product: " + error.message);
    }
  };  

  const handleDelete = async (id: string) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert("🗑️ Product deleted successfully!");

        setProducts((prevProducts) => prevProducts.filter((p) => p._id !== id));
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
          onCategoryChange={handleCategoryChange} 
        />
      </div>

      {isAdmin && (
        <button className="addButton" onClick={() => { setEditProduct(null); setIsFormVisible(true); }}>
          ➕ Add Product
        </button>
      )}
      
      <ProductList
        products={filteredProducts} 
        isAdmin={isAdmin} 
        selectedCategory={selectedCategory} 
        onEdit={(product) => { setEditProduct(product); setIsFormVisible(true); }}
        onDelete={handleDelete}
      />

      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage <= 1}>
          ⬅ Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))} disabled={currentPage >= totalPages}>
          Next ➡
        </button>
      </div>

      {isFormVisible && (
        <ProductForm 
          product={editProduct || newProduct} 
          categories={categories} 
          onChange={(e) => {
            if (editProduct) {
              setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
            } else {
              setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
            }
          }} 
          onSave={handleCreateOrUpdate} 
          onCancel={() => setIsFormVisible(false)} 
        />
      )}
    </div>
  );
}
