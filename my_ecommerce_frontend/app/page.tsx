"use client";
import { useEffect, useState, useCallback } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import CategoryFilter from "./components/CategoryFilter";
import SearchBar from "./components/SearchBar"; 

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

  const imageUrlPattern =
    /^(https?:\/\/.*\.(png|jpg|jpeg|gif|svg|webp|avif)(\?.*)?)$/i;

  const isAdmin = true;

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (editProduct) {
      setEditProduct((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!isAdmin) return;

    const payload = editProduct ? { ...editProduct } : { ...newProduct };
    delete payload._id;

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
        alert(
          editProduct
            ? "✅ Product updated successfully!"
            : "✅ Product added successfully!"
        );
        setIsAddFormVisible(false);
        setEditProduct(null);
        await fetchProducts();
      } else {
        const data = await response.json();
        alert(
          `❌ Failed to ${editProduct ? "update" : "add"} product: ${
            data.message
          }`
        );
      }
    } catch (error) {
      console.error("❌ Error handling product:", error);
      alert("❌ Something went wrong!");
    }
  };

  const handleEditClick = (product: Product) => {
    console.log("Edit button clicked for product:", product);
    setEditProduct(product);
    setIsAddFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm("⚠️ Are you sure you want to delete this product?"))
      return;
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === "All" || product.category === selectedCategory)
  );

  return (
    <div className="container">
      <h1 className="title">Products</h1>
      <div className="searchFilterContainer">
      <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      </div>

      {isAdmin && (
        <button
          className={"add-button"}
          onClick={() => {
            setEditProduct(null);
            setIsAddFormVisible(true);
          }}>
          ➕ Add Product
        </button>
      )}
      
      <ProductList
        products={filteredProducts} 
        isAdmin={isAdmin}
        selectedCategory={selectedCategory}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      {isAddFormVisible && (
        <ProductForm
          product={editProduct || newProduct}
          categories={categories}
          onChange={handleChange}
          onSave={handleCreateOrUpdate}
          onCancel={() => setIsAddFormVisible(false)}
        />
      )}
    </div>
  );
}
