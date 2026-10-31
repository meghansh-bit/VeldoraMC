import { Coins, ArrowRight, Sparkles, ShieldCheck, Heart, ShoppingBag, PackageCheck, Zap, ShoppingCart, Gem, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/useCart";
import CurrencyTab from "../components/store/tabs/CurrencyTab";
import { useSeo } from "../hooks/useSeo";

export default function Store() {
  const [managedItems, setManagedItems] = useState([]);
  const { addToCart, count } = useCart();
  useEffect(() => {
    let alive = true;
    supabase.from("store_items").select("id,name,category,description,image_url,price").eq("active", true).order("created_at", { ascending: false })
      .then(({ data }) => { if (alive && data) setManagedItems(data); });
    return () => { alive = false; };
  }, []);
  useSeo({ title: "VeldoraMC Store — Velora & Ranks", description: "Explore official VeldoraMC store items and Velora currency packs.", path: "/store" });

  return <main className="veldora-store vstore-redesign">
    <section className="vstore-hero">
      <div className="vstore-orb vstore-orb-one" /><div className="vstore-orb vstore-orb-two" />
      <div className="vstore-hero-copy">
        <span className="vstore-kicker"><Sparkles size={14}/> THE OFFICIAL VELDORAMC STORE</span>
        <h1>Make your<br/><span>next move count.</span></h1>
        <p>Discover Velora packs and server exclusives. Every purchase helps support the world we build together.</p>
        <div className="vstore-hero-actions">
          <a href="#coin-packs" className="vstore-primary">Explore the store <ArrowRight size={17}/></a>
          <Link to="/cart" className="vstore-account-cta"><ShoppingCart size={16}/> Cart ({count})</Link>
        </div>
        <div className="vstore-trust"><span><ShieldCheck size={15}/> Official server store</span><span><Heart size={15}/> Supports VeldoraMC</span><span><BadgeCheck size={15}/> INR pricing</span></div>
      </div>
      <div className="vstore-hero-emblem" aria-hidden="true"><div className="vstore-emblem-frame"><img src="/veldoramc-logo.svg" alt=""/><span><Coins size={23}/> VELORA</span></div><i className="vstore-emblem-orbit orbit-a"/><i className="vstore-emblem-orbit orbit-b"/></div>
    </section>

    <section className="vstore-benefit-strip">
      <div><PackageCheck/><span><b>Instant cart access</b><small>Keep your selected items together</small></span></div>
      <div><ShieldCheck/><span><b>Official VeldoraMC store</b><small>Items managed by the server team</small></span></div>
      <div><Zap/><span><b>Built for your journey</b><small>Choose the extras that suit your play</small></span></div>
    </section>

    <section id="coin-packs" className="vstore-catalog">
      <div className="vstore-section-head"><div><span className="vstore-kicker">CURRENCY COLLECTION</span><h2>Choose your <em>Velora.</em></h2><p>Pick a pack to add it to your cart. Prices are shown in Indian rupees (INR).</p></div><span className="vstore-count-pill"><Gem size={14}/> VELORA PACKS</span></div>
      <div className="vstore-tab-panel"><CurrencyTab/></div>
    </section>

    {managedItems.length > 0 && <section className="vstore-catalog vstore-managed">
      <div className="vstore-section-head"><div><span className="vstore-kicker">SERVER EXCLUSIVES</span><h2>More from <em>Veldora.</em></h2><p>Official items and offers managed by the server team.</p></div></div>
      <div className="vstore-managed-grid">{managedItems.map(item=><article key={item.id} className="store-product-card vstore-managed-card">
        <div className="vstore-managed-image"><img src={item.image_url||"/veldoramc-logo.svg"} alt={item.name} onError={e=>{e.currentTarget.src="/veldoramc-logo.svg";}}/><span>{item.category || "EXCLUSIVE"}</span></div>
        <div className="vstore-managed-copy"><h3>{item.name}</h3><p>{item.description}</p><div className="vstore-managed-buy"><strong>₹{Number(item.price).toLocaleString("en-IN")}</strong><button className="vstore-primary" onClick={()=>addToCart({id:"managed-"+item.id,category:String(item.category||"item").toLowerCase(),name:item.name,price:"₹"+Number(item.price).toLocaleString("en-IN"),image:item.image_url||"/veldoramc-logo.svg"})}><ShoppingBag size={15}/> Add to cart</button></div></div>
      </article>)}</div>
    </section>}

    <section className="vstore-help"><div className="vstore-help-icon"><ShieldCheck size={24}/></div><div><span className="vstore-kicker">NEED A HAND?</span><h2>We’ve got your back.</h2><p>Questions about an order or an item? Reach out through the support page and the team can help.</p></div><Link to="/support" className="vstore-account-cta">Visit support <ArrowRight size={15}/></Link></section>
    <footer className="vstore-footnote">VELDORAMC STORE <span>•</span> ALL PRICES IN INR <span>•</span> THANK YOU FOR SUPPORTING THE SERVER</footer>
  </main>;
}