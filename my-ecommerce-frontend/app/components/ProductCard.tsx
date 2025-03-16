import Image from "next/image";
import styles from "../styles/ProductCard.module.css";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isAdmin, onEdit, onDelete }) => {
  return (
    <div className={styles.productCard}>
      <div className={styles.productImageWrapper}>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400} 
          height={400}
          quality={100} 
          className={styles.productImage}
          style={{ objectFit: "cover", borderRadius: "10px" }}
          priority
        />
      </div>
      <div className={styles.productInfo}>
        <div className={styles.productLeft}>
          <h2 className={styles.productName}>{product.name}</h2>
          <p className={styles.productDescription}>{product.description}</p>
        </div>
        <div className={styles.productRight}>
          <p className={styles.productPrice}>${product.price}</p>
          {isAdmin && (
            <div className={styles.adminButtons}>
              <button className={styles.editButton} onClick={() => onEdit(product)}>✏️ Edit</button>
              <button className={styles.deleteButton} onClick={() => onDelete(product._id)}>🗑️ Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
