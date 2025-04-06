"use client";

import Image from "next/image";
import { useCart } from "@context/CartContext";
import styles from "@styles/ProductCard.module.css";

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
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isAdmin,
  onEdit,
  onDelete,
  onAddToCart,
}) => {
  const { cart } = useCart();
  const isInCart = cart.some((item) => item.productId === product._id);

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
          {isAdmin ? (
            <div className={styles.adminButtons}>
              <button className={styles.editButton} onClick={() => onEdit(product)}>
                ✏️ Edit
              </button>
              <button className={styles.deleteButton} onClick={() => onDelete(product._id)}>
                🗑️ Delete
              </button>
            </div>
          ) : (
            <div className={styles.addToCartContainer}>
              {isInCart ? (
                <button className={`${styles.addToCartButton} ${styles.inCart}`}>
                  🛒
                </button>
              ) : (
                <button
                  className={styles.addToCartButton}
                  onClick={() => onAddToCart && onAddToCart(product)}
                >
                  🛒
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
