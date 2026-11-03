import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Check, ChevronDown, CircleUserRound, Copy, Crown, Gem, KeyRound, LockKeyhole, Package, Plus, Shield, ShoppingBag, Sparkles, Sword, X, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { fetchRanks, fetchCrateKeys } from "../data/store";
import { useSeo } from "../hooks/useSeo";
import "./storefront.css";

const categories = [
  { id: "ranks", label: "Ranks", icon: Crown, hint: "Permanent perks & status" },
  { id: "keys", label: "Crate Keys", icon: KeyRound, hint: "Unlock in-game rewards" },
  { id: "bundles", label: "Deal Bundles", icon: Package, hint: "Ranks, money & bonus rewards" },
];
const priceNumber = (value) => Number(String(value).replace(/[^0-9.]/g, "")) || 0;
const money = (value) => "₹" + Math.round(priceNumber(value)).toLocaleString("en-IN");

function ProductCard({ item, category, featured, onAdd, added }) {
  const Icon = category === "ranks" ? Crown : category === "keys" ? KeyRound : Package;
  const description = item.perks?.slice(0, 3).join(" · ") || item.contents?.slice(0, 3).join(" · ") || item.amount || item.description || "A VeldoraMC store exclusive.";
  return <article className={`sf-product ${featured ? "sf-featured" : ""}`}>
    <div className="sf-product-top"><span className="sf-product-type">{category === "keys" ? "CRATE KEY" : category === "bundles" ? "DEAL BUNDLE" : category.toUpperCase()}</span>{featured && <span className="sf-popular"><Sparkles size={12}/> POPULAR</span>}</div>
    <div className={`sf-product-art sf-art-${category}`}><span className="sf-art-glow"/><Icon size={48} strokeWidth={1.25}/></div>
    <div className="sf-product-info"><h3>{item.name}</h3><p>{description}</p>
      {item.amount && <div className="sf-product-amount">{item.amount}</div>}
      {item.bonus && <span className="sf-bonus">{item.bonus}</span>}{item.trialDays && <div className="sf-hero-trial"><strong>{item.trialDays}-DAY FREE HERO TRIAL</strong><p>Join VeldoraMC and type <code>/freerank</code> in chat to claim your Hero rank trial. Available once per Minecraft account.</p></div>}
      <div className="sf-product-buy"><strong>{item.price ? money(item.price) : "Price soon"}</strong><button type="button" onClick={onAdd} disabled={!item.price}><ShoppingBag size={15}/>{added ? "Added" : item.price ? "Add to cart" : "Coming soon"}</button></div>
    </div>
  </article>;
}

export default function Store() {
  const [active, setActive] = useState("ranks");
  const [products, setProducts] = useState({ ranks: [], keys: [], bundles: [\n    { key: "starter-bundle", name: "Starter Bundle", price: "", perks: ["Hero rank", "In-game money bonus", "Bonus crate keys"], description: "Everything you need to get started on VeldoraMC.", featured: true },\n    { key: "elite-bundle", name: "Elite Bundle", price: "", perks: ["Elite rank", "In-game money bonus", "Bonus crate keys"], description: "A step up for players building their Lifesteal journey." },\n    { key: "titan-bundle", name: "Titan Bundle", price: "", perks: ["Titan rank", "In-game money bonus", "Bonus crate keys"], description: "More perks and rewards for committed players." },\n    { key: "bolt-bundle", name: "Bolt Bundle", price: "", perks: ["Bolt rank", "In-game money bonus", "Bonus crate keys"], description: "A premium bundle for players ready to rise." },\n    { key: "primal-bundle", name: "Primal Bundle", price: "", perks: ["Primal rank", "In-game money bonus", "Bonus crate keys"], description: "The top-tier VeldoraMC bundle." },\n  ] });
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState("");
  const [playerOpen, setPlayerOpen] = useState(false);
  const [platform, setPlatform] = useState("java");
  const [username, setUsername] = useState("");
  const [ipCopied, setIpCopied] = useState(false);
  const { addToCart, count } = useCart();

  useSeo({ title: "VeldoraMC Store — Ranks, Keys & Bundles", description: "Shop official VeldoraMC ranks, crate keys and deal bundles.", path: "/" });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("veldora-store-player") || "null");
      if (saved?.username && (saved.platform === "java" || saved.platform === "bedrock")) { setUsername(saved.username); setPlatform(saved.platform); }
    } catch {}
    const openIdentification = () => setPlayerOpen(true);
    window.addEventListener("veldora-open-player-identification", openIdentification);
    let live = true;
    Promise.all([fetchRanks(), fetchCrateKeys(), fetchCurrencyPacks()]).then(([ranks, keys, currency]) => {
      if (live) setProducts({ ranks: ranks || [], keys: keys || [], currency: currency || [] });
    }).finally(() => { if (live) setLoading(false); });
    return () => { live = false; window.removeEventListener("veldora-open-player-identification", openIdentification); };
  }, []);

  const visible = useMemo(() => products[active] || [], [products, active]);
  function choosePlayer(event) {
    event.preventDefault();
    const clean = username.trim();
    if (!/^[A-Za-z0-9_]{3,16}$/.test(clean)) return;
    const next = { username: clean, platform };
    localStorage.setItem("veldora-store-player", JSON.stringify(next));
    setPlayerOpen(false);
    window.dispatchEvent(new CustomEvent("veldora-player-updated", { detail: next }));
  }
  function add(item, category) {
    const id = `${category}-${item.key}`;
    const ok = addToCart({ id, category: category === "keys" ? "crate" : category === "ranks" ? "rank" : "bundle", name: item.name, price: item.price });
    if (ok) { setAdded(id); window.setTimeout(() => setAdded(""), 1300); }
  }

  return <main className="sf-store">
    <section className="sf-hero">
      <div className="sf-hero-noise"/><div className="sf-hero-inner">
        <div className="sf-eyebrow"><span className="sf-live-dot"/> THE OFFICIAL VELDORAMC STORE</div>
        <h1>GEAR UP.<br/><span>RISE ABOVE.</span></h1>
        <p>Everything you need to make your mark. Unlock exclusive ranks, open crate rewards and grab a bundle packed with rewards.</p>
        <div className="sf-hero-actions"><a href="#catalog" className="sf-btn sf-btn-main">Explore the store <ArrowRight size={16}/></a></div>
        <div className="sf-hero-community">
          <button type="button" className="sf-server-ip" onClick={() => { navigator.clipboard?.writeText("veldoramc.mc-dns.net").then(() => { setIpCopied(true); window.setTimeout(() => setIpCopied(false), 1600); }).catch(() => {}); }}>
            <span className="sf-ip-label"><span className="sf-live-dot"/> SERVER IP</span>
            <strong>veldoramc.mc-dns.net</strong>
            <span className="sf-ip-copy">{ipCopied ? <Check size={14}/> : <Copy size={14}/>} {ipCopied ? "COPIED" : "COPY IP"}</span>
          </button>
          <a href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer" className="sf-discord-hero" aria-label="Join VeldoraMC Discord">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.7 5.2a18.4 18.4 0 0 0-4.5-1.4l-.6 1.2a16.8 16.8 0 0 0-5.2 0l-.6-1.2a18.4 18.4 0 0 0-4.5 1.4C1.5 9.4.7 13.5 1.1 17.6a18.2 18.2 0 0 0 5.5 2.8l1.2-2a11.8 11.8 0 0 1-1.9-.9l.5-.4a13 13 0 0 0 11.2 0l.5.4a11.8 11.8 0 0 1-1.9.9l1.2 2a18.2 18.2 0 0 0 5.5-2.8c.5-4.8-.8-8.9-3.2-12.4ZM8.7 14.8c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Zm6.6 0c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Z"/></svg>
            <span><b>JOIN DISCORD</b><small>Meet the community</small></span><ArrowRight size={16}/>
          </a>
        </div>
        <div className="sf-hero-meta"><span><Shield size={14}/> OFFICIAL STORE</span><i/> <span><LockKeyhole size={14}/> SECURE CHECKOUT COMING SOON</span><i/> <span>INR PRICING</span></div>
      </div>
      <div className="sf-motion-swords" aria-hidden="true"><span><Sword size={92}/></span><span><Sword size={70}/></span><span><Sword size={54}/></span><span><Sword size={82}/></span></div><div className="sf-hero-visual"><div className="sf-hero-ring sf-ring-one"/><div className="sf-hero-ring sf-ring-two"/><div className="sf-hero-cube"><img src="/veldoramc-logo.svg" alt="VeldoraMC"/><span>VELDORA<span>MC</span></span></div><div className="sf-float-tag sf-tag-one"><Crown size={15}/> RANK UP</div><div className="sf-float-tag sf-tag-two"><KeyRound size={15}/> UNLOCK REWARDS</div></div>
    </section>

    <section className="sf-catalog" id="catalog">
      <div className="sf-heading"><div><span className="sf-section-kicker">THE VELDORAMC COLLECTION</span><h2>Find your <em>upgrade.</em></h2><p>Choose a category and find the right addition to your adventure.</p></div><Link to="/cart" className="sf-cart-link"><ShoppingBag size={17}/> Cart <b>{count}</b></Link></div>
      <div className="sf-categories">{categories.map(({id,label,icon:Icon,hint})=><button key={id} className={active===id?"active":""} onClick={()=>setActive(id)}><Icon size={19}/><span><b>{label}</b><small>{hint}</small></span><ChevronDown size={14}/></button>)}</div>
      {active === "extras" ? <div className="sf-empty"><Sparkles size={27}/><h3>More exclusives are on the way.</h3><p>Cosmetics, bundles and special offers will appear here as they are added to the store.</p></div> :
      loading ? <div className="sf-empty">Loading store catalogue…</div> :
      <div className="sf-products">{visible.map((item,index)=><ProductCard key={item.key} item={item} category={active} featured={item.featured || (active==="ranks" && index===1)} added={added===`${active}-${item.key}`} onAdd={()=>add(item,active)}/>)}</div>}
      {active === "ranks" && <p className="sf-note">Rank perks and availability are subject to the server's final configuration. Only one rank can be added to a cart at a time.</p>}
    </section>

    <section className="sf-bottom-banner"><div><span className="sf-section-kicker">NEED HELP WITH YOUR ORDER?</span><h2>We've got your <em>back.</em></h2><p>Talk to the VeldoraMC team on Discord if you need help choosing an item.</p></div><a href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer" className="sf-btn sf-btn-main">Get support <ArrowRight size={16}/></a></section>
    <footer className="sf-footer"><img src="/veldoramc-logo.svg" alt="VeldoraMC"/><span>VELDORAMC STORE · ALL PRICES IN INR</span><Link to="/cart">VIEW CART ({count})</Link></footer>

    {playerOpen && <div className="sf-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setPlayerOpen(false);}}><section className="sf-player-modal" role="dialog" aria-modal="true" aria-labelledby="sf-player-title"><button className="sf-modal-close" onClick={()=>setPlayerOpen(false)} aria-label="Close"><X size={18}/></button><span className="sf-section-kicker">PLAYER IDENTIFICATION</span><h2 id="sf-player-title">Who are we <em>shopping for?</em></h2><p>Choose your edition and enter your in-game username before adding items.</p><div className="sf-platforms"><button type="button" className={platform==="java"?"selected":""} onClick={()=>setPlatform("java")}><span>☕</span><b>Java Edition</b><small>PC / Mac</small></button><button type="button" className={platform==="bedrock"?"selected":""} onClick={()=>setPlatform("bedrock")}><span>◆</span><b>Bedrock Edition</b><small>Mobile / Console / Windows</small></button></div><form onSubmit={choosePlayer}><label htmlFor="sf-username">Minecraft username</label><input id="sf-username" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter your username" minLength={3} maxLength={16} pattern="[A-Za-z0-9_]+" required autoComplete="off"/><small>3–16 letters, numbers or underscores. This identifies the recipient; it does not sign you into a Microsoft or Mojang account.</small><button className="sf-btn sf-btn-main" type="submit">Continue as {platform==="java"?"Java":"Bedrock"} player <ArrowRight size={16}/></button></form></section></div>}
  </main>;
}
