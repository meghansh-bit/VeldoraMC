import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, ShieldCheck, Zap } from "lucide-react";
import { useCart } from "../context/useCart";
import { parsePrice } from "../context/cart-utils";
import { useSeo } from "../hooks/useSeo";
import "./storefront.css";
import "./cart.css";

const formatINR = (amount) => "₹" + Math.round(amount).toLocaleString("en-IN");

function CartLine({ item }) {
  const { updateQty, removeFromCart } = useCart();
  const category = item.category === "crate" ? "CRATE KEY" : item.category === "bundle" ? "DEAL BUNDLE" : item.category === "currency" ? "VELORA" : "RANK";
  return <article className="sf-cart-line">
    <div className="sf-cart-item-icon">{item.image ? <img src={item.image} alt="" /> : <ShoppingBag size={22}/>}</div>
    <div className="sf-cart-item-info"><span>{category}</span><strong>{item.name}</strong><small>{formatINR(parsePrice(item.price))} each</small></div>
    <div className="sf-cart-controls">
      <button aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQty(item.id,item.qty-1)}><Minus size={14}/></button>
      <b>{item.qty}</b>
      <button aria-label={`Increase ${item.name} quantity`} onClick={() => updateQty(item.id,item.qty+1)}><Plus size={14}/></button>
    </div>
    <strong className="sf-cart-line-total">{formatINR(parsePrice(item.price)*item.qty)}</strong>
    <button className="sf-cart-remove" aria-label={`Remove ${item.name}`} onClick={() => removeFromCart(item.id)}><Trash2 size={16}/></button>
  </article>;
}

export default function Cart() {
  useSeo({ title:"Your Cart", path:"/cart", noindex:true });
  const { items, count, subtotal, clearCart } = useCart();
  return <main className="sf-cart-page">
    <div className="sf-cart-top"><Link to="/"><ArrowLeft size={16}/> BACK TO STORE</Link><span>VELDORAMC / CART</span></div>
    <header className="sf-cart-heading"><span className="sf-section-kicker">YOUR LOADOUT</span><h1>THE <em>CART.</em></h1><p>Review your selected upgrades before checkout.</p></header>
    {items.length === 0 ? <section className="sf-cart-empty"><ShoppingBag size={38}/><h2>Your cart is empty.</h2><p>Find your next upgrade in the VeldoraMC store.</p><Link to="/" className="sf-btn sf-btn-main">Explore the store <Zap size={16}/></Link></section> :
      <div className="sf-cart-layout"><section className="sf-cart-items"><div className="sf-cart-items-head"><strong>SELECTED ITEMS <span>({count})</span></strong><button type="button" onClick={clearCart} className="sf-cart-clear">CLEAR CART</button></div>{items.map(item=><CartLine key={item.id} item={item}/>)}</section>
      <aside className="sf-cart-summary"><span className="sf-section-kicker">ORDER SUMMARY</span><h2>Ready to <em>power up?</em></h2><div className="sf-cart-summary-row"><span>Items</span><b>{count}</b></div><div className="sf-cart-summary-row"><span>Subtotal</span><b>{formatINR(subtotal)}</b></div><div className="sf-cart-total"><span>TOTAL</span><strong>{formatINR(subtotal)}</strong></div><button type="button" className="sf-btn sf-btn-main sf-cart-checkout" disabled>CHECKOUT <Zap size={16}/></button><p className="sf-cart-unavailable"><ShieldCheck size={14}/> Secure checkout is being connected. No payment will be taken yet.</p></aside></div>}
  </main>;
}
