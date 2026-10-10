import { useState, useMemo, useCallback, useRef } from "react";
import { CartContext } from "./cart-context";
import { parsePrice } from "./cart-utils";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const itemsRef = useRef([]);
  const [cartNotice, setCartNotice] = useState("");
  const commit = useCallback((next) => { itemsRef.current = next; setItems(next); }, []);

  const addToCart = useCallback((item) => {
    const current = itemsRef.current;
    if (item.category === "rank" && current.some((i) => i.category === "rank")) {
      setCartNotice("One rank per cart. Remove your current rank or bundle before adding another.");
      return false;
    }
    const existing = current.find((i) => i.id === item.id);
    if (existing) {
      if (existing.category === "rank") {
        setCartNotice("Rank quantity is limited to 1. You can only have one rank or bundle in your cart.");
        return false;
      }
      commit(current.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      return true;
    }
    commit([...current, { ...item, qty: 1 }]);
    setCartNotice("");
    return true;
  }, [commit]);

  const removeFromCart = useCallback((id) => {
    commit(itemsRef.current.filter((i) => i.id !== id));
    setCartNotice("");
  }, [commit]);

  const updateQty = useCallback((id, qty) => {
    const current = itemsRef.current;
    const target = current.find((i) => i.id === id);
    if (target?.category === "rank" && qty > 1) {
      setCartNotice("Rank quantity is limited to 1. You can only have one rank or bundle in your cart.");
      return false;
    }
    if (qty <= 0) {
      commit(current.filter((i) => i.id !== id));
      setCartNotice("");
      return true;
    }
    commit(current.map((i) => i.id === id ? { ...i, qty } : i));
    return true;
  }, [commit]);

  const clearCart = useCallback(() => { commit([]); setCartNotice(""); }, [commit]);
  const dismissCartNotice = useCallback(() => setCartNotice(""), []);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + parsePrice(i.price) * i.qty, 0), [items]);
  const value = useMemo(() => ({ items, addToCart, removeFromCart, updateQty, clearCart, count, subtotal, cartNotice, dismissCartNotice }), [items, addToCart, removeFromCart, updateQty, clearCart, count, subtotal, cartNotice, dismissCartNotice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}