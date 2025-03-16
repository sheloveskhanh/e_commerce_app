import ProductCard from "./ProductCard";
import styles from "../styles/ProductList.module.css";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface ProductListProps {
  products: Product[];
  isAdmin: boolean;
  selectedCategory: string;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, isAdmin, selectedCategory, onEdit, onDelete }) => {
  return (
    <div className={styles.productGrid}>
      {products.filter(product => selectedCategory === "All" || product.category === selectedCategory)
        .map(product => (
          <ProductCard key={product._id} product={product} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
        ))}
    </div>
  );
};

export default ProductList;