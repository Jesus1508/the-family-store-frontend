import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "tfs_cart";

const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const sameItem = (a, b) => a.productoId === b.productoId && (a.talla || null) === (b.talla || null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (newItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => sameItem(i, newItem));
      if (existing) {
        return prev.map((i) =>
          sameItem(i, newItem) ? { ...i, cantidad: i.cantidad + newItem.cantidad } : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (productoId, talla) => {
    setItems((prev) => prev.filter((i) => !sameItem(i, { productoId, talla })));
  };

  const updateQuantity = (productoId, talla, cantidad) => {
    setItems((prev) =>
      prev.map((i) => (sameItem(i, { productoId, talla }) ? { ...i, cantidad } : i))
    );
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const count = items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
