import { Coins, ArrowRight, Sparkles, ShieldCheck, Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/useCart";
import CurrencyTab from "../components/store/tabs/CurrencyTab";
import { useSeo } from "../hooks/useSeo";
import { Link } from "react-router-dom";
import { UserRound, ShoppingCart } from "lucide-react";

export default function Store() {
  const [managedItems, setManagedItems] = useState([]);
  const { addToCart, count } = useCart();
  useEffect(() => { let alive = true; supabase.from("store_items").select("id,name,category,description,image_url,price").eq("active", true).order("created_at", { ascending: false }).then(({ data }) => { if (alive && data) setManagedItems(data); }); return () => { alive = false; }; }, []);
  useSeo({
    title: "VeldoraMC Velora Store",
    description: "Get Velora currency packs for VeldoraMC.",
    path: "/store",
  });

  return (
    <main className="veldora-store">
      <section className="vstore-hero">
        <div className="vstore-orb vstore-orb-one" />
        <div className="vstore-orb vstore-orb-two" />
        <div className="vstore-hero-copy">
          <span className="vstore-kicker"><Sparkles size={14} /> OFFICIAL VELDORAMC STORE</span>
          <h1>Get more <span>Velora.</span></h1>
          <p>Choose a Velora pack to boost your in-game progress.</p>
          <div className="vstore-hero-actions"><a href="#coin-packs" className="vstore-primary">Browse Velora packs <ArrowRight size={17} /></a><Link to="/store/account" className="vstore-account-cta"><UserRound size={16}/> Store account</Link><Link to="/cart" className="vstore-account-cta"><ShoppingCart size={16}/> Cart ({count})</Link></div>
          <div className="vstore-trust">
            <span><ShieldCheck size={15} /> Support the server</span>
            <span><Heart size={15} /> Velora currency</span>
          </div>
        </div>
        <div className="vstore-hero-emblem" aria-hidden="true">
          <img src="/veldoramc-logo.svg" alt="" />
          <div className="vstore-emblem-heart"><Coins size={24} /></div>
          <span>COIN PACKS</span>
        </div>
      </section>

      <section id="coin-packs" className="vstore-catalog">
        <div className="vstore-section-head">
          <div>
            <span className="vstore-kicker">IN-GAME CURRENCY</span>
            <h2>Choose your <em>Velora pack</em></h2>
            <p>Prices are displayed in Indian rupees (INR).</p>
          </div>
        </div>
        <div className="vstore-tab-panel">
          <CurrencyTab />
        </div>
      </section>
      {managedItems.length > 0 && <section className="vstore-catalog" style={{paddingTop:28}}><div className="vstore-section-head"><div><span className="vstore-kicker">MORE FROM VELDORAMC</span><h2>Store <em>items</em></h2><p>Items and prices managed by the server team.</p></div></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{managedItems.map(item=><article key={item.id} className="store-product-card" style={{padding:18,borderRadius:14}}><img src={item.image_url||"/veldoramc-logo.svg"} alt="" style={{width:"100%",height:150,objectFit:"contain",marginBottom:12}} onError={e=>e.currentTarget.src="/veldoramc-logo.svg"}/><p style={{fontSize:10,opacity:.7,textTransform:"uppercase",letterSpacing:".12em"}}>{item.category}</p><h3 style={{fontWeight:800,fontSize:16,margin:"6px 0"}}>{item.name}</h3><p style={{fontSize:12,lineHeight:1.7,opacity:.75,minHeight:38}}>{item.description}</p><p style={{fontSize:20,fontWeight:900,margin:"12px 0"}}>₹{Number(item.price).toLocaleString("en-IN")}</p><button className="vstore-primary" onClick={()=>addToCart({id:"managed-"+item.id,category:item.category.toLowerCase(),name:item.name,price:"₹"+Number(item.price).toLocaleString("en-IN"),image:item.image_url||"/veldoramc-logo.svg"})}><ShoppingBag size={15}/> Add to cart</button></article>)}</div></section>}
    </main>
  );
}
