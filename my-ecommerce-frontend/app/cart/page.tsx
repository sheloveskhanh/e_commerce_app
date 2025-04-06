"use client";

import { useCart } from "@context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    alert("Checkout complete! Total: $" + totalPrice.toFixed(2));
    clearCart();
    router.push("/");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.productId}>
                <img src={item.imageUrl} alt={item.name} width={50} height={50} />
                <strong>{item.name}</strong> - ${item.price} x {item.quantity}
                <button onClick={() => removeFromCart(item.productId)}>Remove</button>
              </li>
            ))}
          </ul>
          <h2>Total: ${totalPrice.toFixed(2)}</h2>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
}
