import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface CartContextItem {
  productId: string;
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
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalAmount: number;
}

const CART_KEY = "juteit_cart";
const CART_EXPIRY_DAYS = 30;

function loadCart(): CartContextItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const { items, savedAt } = JSON.parse(raw);
    const ageMs = Date.now() - new Date(savedAt).getTime();
    if (ageMs > CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(CART_KEY);
      return [];
    }
    return items ?? [];
  } catch {
    return [];
  }
}

function saveCart(items: CartContextItem[]) {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify({ items, savedAt: new Date().toISOString() })
  );
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartContextItem[]>(loadCart);

  // Persist whenever items change
  useEffect(() => {
    saveCart(items);
  }, [items]);

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

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
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
    localStorage.removeItem(CART_KEY);
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
