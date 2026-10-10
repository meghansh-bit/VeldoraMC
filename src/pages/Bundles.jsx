import { useMemo, useState } from "react";
import { Check, ShieldCheck, ShoppingBag, Zap } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import "./bundles.css";

const bundles = [
  { id: "starter", name: "Starter Bundle", rank: "Scout", price: 199, oldPrice: 299, tag: "START HERE", perks: ["Scout rank", "Starter Lifesteal kit", "3 crate keys"] },
  { id: "warrior", name: "Warrior Bundle", rank: "Warrior", price: 499, oldPrice: 699, tag: "POPULAR", perks: ["Warrior rank", "Warrior kit", "10 crate keys", "Extra homes"] },
  { id: "champion", name: "Champion Bundle", rank: "Champion", price: 999, oldPrice: 1299, tag: "BEST VALUE", perks: ["Champion rank", "Champion kit", "25 crate keys", "Priority queue", "Exclusive cosmetics"] },
  { id: "mythic", name: "Mythic Bundle", rank: "Mythic", price: 1799, oldPrice: 2299, tag: "ELITE", perks: ["Mythic rank", "Mythic kit", "50 crate keys", "Premium cosmetics", "Priority support"] },
];
// Indicative display rates only. Replace with server-side provider rates before accepting payments.
const currencyMeta = {
  INR: { label: "Indian Rupee", symbol: "₹", rate: 1 },
  PKR: { label: "Pakistani Rupee", symbol: "Rs ", rate: 3.35 },
  USD: { label: "US Dollar", symbol: "$", rate: 0.012 },
};
const format = (value, currency) => new Intl.NumberFormat(currency === "USD" ? "en-US" : currency === "PKR" ? "en-PK" : "en-IN", { maximumFractionDigits: currency === "INR" ? 0 : 2 }).format(value);

export default function Bundles() {
  useSeo({ title: "Bundles & Ranks", description: "Explore VeldoraMC Lifesteal bundles and ranks.", path: "/bundles" });
  const [currency, setCurrency] = useState("INR");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");
  const meta = currencyMeta[currency];
  const selectedBundle = useMemo(() => bundles.find((b) => b.id === selected), [selected]);

  async function checkout(event) {
    event.preventDefault();
    if (!selectedBundle) return;
    setStatus("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundleId: selectedBundle.id, currency, minecraftUsername: username.trim(), email: email.trim() }),
      });
      const data = await response.json();
      if (!response.ok || !data.checkoutUrl) throw new Error(data.error || "Payments are not configured yet.");
      window.location.assign(data.checkoutUrl);
    } catch (error) {
      setStatus(error.message || "Checkout is not available yet. Please try again later.");
    }
  }

  return <section className="bundles-page">
    <div className="bundles-hero">
      <span className="bundles-eyebrow"><Zap size={14} /> VELDORAMC · LIFESTEAL STORE</span>
      <h1>Choose your <span>power.</span></h1>
      <p>Rank up, gear up, and make your mark. Bundles are ready to connect to the live store.</p>
      <div className="currency-row"><label htmlFor="bundle-currency">Display currency</label><select id="bundle-currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>{Object.entries(currencyMeta).map(([code, c]) => <option key={code} value={code}>{code} · {c.label}</option>)}</select><small>INR equivalent is shown on every bundle. Display conversions are estimates.</small></div>
    </div>
    <div className="bundle-grid">{bundles.map((bundle) => {
      const display = bundle.price * meta.rate;
      const original = bundle.oldPrice * meta.rate;
      return <article className={`bundle-card ${bundle.id === "warrior" ? "bundle-featured" : ""}`} key={bundle.id}>
        <div className="bundle-tag">{bundle.tag}</div><div className="bundle-rank-icon"><ShieldCheck size={26}/></div>
        <h2>{bundle.name}</h2><p className="bundle-rank">{bundle.rank} rank included</p>
        <div className="bundle-price"><strong>{meta.symbol}{format(display, currency)}</strong><del>{meta.symbol}{format(original, currency)}</del></div>
        <p className="bundle-inr">{currency === "INR" ? "Price shown in INR" : `≈ ₹${format(bundle.price, "INR")} INR`}</p>
        <ul>{bundle.perks.map((perk) => <li key={perk}><Check size={16}/>{perk}</li>)}</ul>
        <button className="bundle-buy" type="button" onClick={() => { setSelected(bundle.id); setStatus(""); document.getElementById("bundle-checkout")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}><ShoppingBag size={16}/> Select bundle</button>
      </article>;
    })}</div>
    <form id="bundle-checkout" className="bundle-checkout" onSubmit={checkout}>
      <div><span className="bundles-eyebrow">SECURE CHECKOUT</span><h2>Ready to choose your bundle?</h2><p>Enter your Minecraft username and receipt email to continue. Any rank delivery must wait until a verified payment webhook confirms your purchase.</p></div>
      <div className="checkout-fields"><label>Minecraft username<input required minLength={3} maxLength={16} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your in-game name" pattern="[A-Za-z0-9_]+" /></label><label>Receipt email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label><label>Selected bundle<select required value={selected} onChange={(e) => setSelected(e.target.value)}><option value="" disabled>Choose a bundle</option>{bundles.map((b) => <option key={b.id} value={b.id}>{b.name} — ₹{format(b.price, "INR")}</option>)}</select></label><button className="bundle-buy" type="submit">Continue to payment <span>→</span></button></div>
      {selectedBundle && <div className="checkout-summary"><span>{selectedBundle.name}</span><strong>₹{format(selectedBundle.price, "INR")} INR equivalent</strong></div>}
      {status && <p className="checkout-status" role="status">{status}</p>}
      <p className="checkout-note"><ShieldCheck size={15}/> Payment is not live until a server-side gateway, verified webhook, receipt email service, and Minecraft rank-delivery command are configured. Never trust a browser-only payment success screen.</p>
    </form>
  </section>;
}
