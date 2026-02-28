import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

export interface CartContextItem {
<<<<<<< HEAD
  productId: string;
=======
  productId: bigint;
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface CartContextValue {
  items: CartContextItem[];
  addItem: (item: CartContextItem) => void;
<<<<<<< HEAD
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
=======
  removeItem: (productId: bigint) => void;
  updateQuantity: (productId: bigint, quantity: number) => void;
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
  clearCart: () => void;
  totalCount: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartContextItem[]>([]);

  const addItem = useCallback((newItem: CartContextItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === newItem.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i,
        );
      }
      return [...prev, newItem];
    });
  }, []);

<<<<<<< HEAD
  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
=======
  const removeItem = useCallback((productId: bigint) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: bigint, quantity: number) => {
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
