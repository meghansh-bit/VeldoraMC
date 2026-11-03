import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { CartContext } from "./cart-context";
import { parsePrice } from "./cart-utils";

const STORAGE_KEY = "veldoramc-cart-v1";
const SINGLE_PURCHASE_CATEGORIES = new Set(["rank", "bundle"]);

function readSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter(item =>
      item && typeof item.id === "string" &&
      typeof item.name === "string" &&
      Number.isFinite(Number(item.price)) &&
      Number(item.price) > 0 &&
      Number.isInteger(item.qty) && item.qty > 0 &&
      ["rank", "bundle", "crate", "currency"].includes(item.category)
    ).map(item => ({ ...item, price: Number(item.price), qty: SINGLE_PURCHASE_CATEGORIES.has(item.category) ? 1 : item.qty }));
  } catch { return []; }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readSavedCart);
  const itemsRef = useRef(items);
  const [cartNotice, setCartNotice] = useState("");

  const commit = useCallback((next) => {
    itemsRef.current = next;
    setItems(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const addToCart = useCallback((item) => {
    if (!item || !item.id || !item.name || !Number.isFinite(parsePrice(item.price)) || parsePrice(item.price) <= 0) {
      setCartNotice("This item is not available to purchase yet.");
      return false;
    }
    const current = itemsRef.current;
    const isSingle = SINGLE_PURCHASE_CATEGORIES.has(item.category);
    if (isSingle && current.some(i => SINGLE_PURCHASE_CATEGORIES.has(i.category) && i.id !== item.id)) {
      setCartNotice("Only one rank or bundle per cart. Remove your current rank or bundle before adding another.");
      return false;
    }
    if (isSingle && current.some(i => i.id === item.id)) {
      setCartNotice("You can only add one rank or bundle to your cart.");
      return false;
    }
    const existing = current.find(i => i.id === item.id);
    if (existing) {
      commit(current.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      setCartNotice("");
      return true;
    }
    commit([...current, { ...item, price: parsePrice(item.price), qty: 1 }]);
    setCartNotice("");
    return true;
  }, [commit]);

  const removeFromCart = useCallback((id) => {
    commit(itemsRef.current.filter(i => i.id !== id));
    setCartNotice("");
  }, [commit]);

  const updateQty = useCallback((id, qty) => {
    const current = itemsRef.current;
    const target = current.find(i => i.id === id);
    if (target && SINGLE_PURCHASE_CATEGORIES.has(target.category) && qty > 1) {
      setCartNotice("You can only add one rank or bundle to your cart.");
      return false;
    }
    if (qty <= 0) {
      commit(current.filter(i => i.id !== id));
      setCartNotice("");
      return true;
    }
    commit(current.map(i => i.id === id ? { ...i, qty: Math.floor(qty) } : i));
    setCartNotice("");
    return true;
  }, [commit]);

  const clearCart = useCallback(() => { commit([]); setCartNotice(""); }, [commit]);
  const dismissCartNotice = useCallback(() => setCartNotice(""), []);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + parsePrice(i.price) * i.qty, 0), [items]);
  const value = useMemo(() => ({ items, addToCart, removeFromCart, updateQty, clearCart, count, subtotal, cartNotice, dismissCartNotice }), [items, addToCart, removeFromCart, updateQty, clearCart, count, subtotal, cartNotice, dismissCartNotice]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {cartNotice && (
        <div role="alert" className="fixed bottom-5 left-4 right-4 z-[200] mx-auto flex max-w-lg items-start gap-3 rounded-xl border border-red-400/40 bg-[#1a1013] p-4 text-sm text-white shadow-2xl">
          <span className="flex-1 leading-6">{cartNotice}</span>
          <button type="button" aria-label="Dismiss message" onClick={dismissCartNotice} className="rounded-md p-1 text-white/70 hover:bg-white/10"><X size={18} /></button>
        </div>
      )}
    </CartContext.Provider>
  );
}
