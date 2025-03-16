import React, { useState, useEffect } from "react";

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Partial<Product> | null;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const [productData, setProductData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 1,
    imageUrl: "",
    category: "Clothing",
  });


  useEffect(() => {
    if (isOpen) {
      setProductData(product || {
        name: "",
        description: "",
        price: 1,
        imageUrl: "",
        category: "Clothing",
      });
    }
  }, [isOpen, product]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null; 

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{product?._id ? "Edit Product" : "Add Product"}</h2>

        <label>Category:</label>
        <select name="category" value={productData.category || ""} onChange={handleChange}>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Electronics">Electronics</option>
          <option value="Home">Home</option>
          <option value="Others">Others</option>
        </select>

        <label>Product Name:</label>
        <input type="text" name="name" placeholder="Enter product name" value={productData.name || ""} onChange={handleChange} />

        <label>Description:</label>
        <textarea name="description" placeholder="Enter product description" value={productData.description || ""} onChange={handleChange} />

        <label>Price:</label>
        <input type="number" name="price" placeholder="Enter product price" value={productData.price || ""} onChange={handleChange} />

        <label>Image URL:</label>
        <input type="text" name="imageUrl" placeholder="Enter image URL" value={productData.imageUrl || ""} onChange={handleChange} />

        <div className="modal-buttons">
          <button className="save-button" onClick={() => onSave(productData)}>
            💾 {product?._id ? "Update" : "Save"}
          </button>
          <button className="cancel-button" onClick={onClose}>❌ Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
