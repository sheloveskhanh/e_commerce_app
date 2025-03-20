import styles from "@styles/ProductForm.module.css";

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface ProductFormProps {
  product: Partial<Product>;
  categories: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, categories, onChange, onSave, onCancel }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{product._id ? "Edit Product" : "Add Product"}</h2>
        <label>Category:</label>
        <select name="category" value={product.category || ""} onChange={onChange}>
          {categories.slice(1).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <label>Product Name:</label>
        <input type="text" name="name" placeholder="Enter product name" value={product.name || ""} onChange={onChange} />
        <label>Description:</label>
        <textarea name="description" placeholder="Enter product description" value={product.description || ""} onChange={onChange} style={{ resize: "vertical" }} />
        <label>Price:</label>
        <input type="number" name="price" placeholder="Enter product price" value={product.price || ""} onChange={onChange} />
        <label>Image URL:</label>
        <input type="text" name="imageUrl" placeholder="Enter image URL" value={product.imageUrl || ""} onChange={onChange} />
        <div className={styles.modalButtons}>
          <button className={styles.saveButton} onClick={onSave}>💾 {product._id ? "Update" : "Save"}</button>
          <button className={styles.cancelButton} onClick={onCancel}>❌ Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
