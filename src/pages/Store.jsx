import { useState } from "react";
import { ArrowRight, PackageOpen, Sparkles, ShieldCheck, Heart, KeyRound, Coins, Crown } from "lucide-react";
import StoreOverview from "../components/store/StoreOverview";
import StoreTabs from "../components/store/StoreTabs";
import { STORE_TABS } from "../components/store/storeTabsConfig";
import RanksTab from "../components/store/tabs/RanksTab";
import CratesTab from "../components/store/tabs/CratesTab";
import CurrencyTab from "../components/store/tabs/CurrencyTab";
import TopDonatorsTab from "../components/store/tabs/TopDonatorsTab";
import { useSeo } from "../hooks/useSeo";
import { formatInrEquivalent } from "../data/store";
import { useCart } from "../context/useCart";
import PixelButton from "../components/ui/PixelButton";
import { CheckCircle2, ShoppingCart } from "lucide-react";

const TAB_COMPONENTS = { ranks: RanksTab, crates: CratesTab, currency: CurrencyTab, donators: TopDonatorsTab };
const bundleHighlights = [
  { name: "Starter", fullName: "Starter Bundle", description: "Kick off your Lifesteal journey.", price: "$2.49", tone: "starter", icon: ShieldCheck, perks: ["Starter rank & kit", "A few crate keys"] },
  { name: "Warrior", fullName: "Warrior Bundle", description: "For players ready to make a name.", price: "$5.99", tone: "warrior", icon: Heart, perks: ["Warrior rank & kit", "Extra progression perks"], featured: true },
  { name: "Champion", fullName: "Champion Bundle", description: "A powerful upgrade for regulars.", price: "$11.99", tone: "champion", icon: KeyRound, perks: ["Champion rank & kit", "More crate keys"] },
  { name: "Mythic", fullName: "Mythic Bundle", description: "The premium Veldora experience.", price: "$21.99", tone: "mythic", icon: Crown, perks: ["Mythic rank & kit", "Premium extras"] },
];

export default function Store() {
  useSeo({ title: "VeldoraMC Store", description: "Explore VeldoraMC Lifesteal ranks, bundles, crate keys, and in-game currency.", path: "/store" });
  const [activeTab, setActiveTab] = useState(STORE_TABS[0].key);
  const [addedBundle, setAddedBundle] = useState(null);
  const { addToCart } = useCart();
  const handleAddBundle = (bundle) => {
    addToCart({ id: `bundle-${bundle.tone}`, category: "rank", name: bundle.fullName, price: bundle.price, tone: "primary", icon: bundle.icon });
    setAddedBundle(bundle.tone);
    window.setTimeout(() => setAddedBundle((current) => current === bundle.tone ? null : current), 1500);
  };
  const ActiveTabComponent = TAB_COMPONENTS[activeTab] || RanksTab;

  return (
    <main className="veldora-store">
      <section className="vstore-hero">
        <div className="vstore-orb vstore-orb-one" /><div className="vstore-orb vstore-orb-two" />
        <div className="vstore-hero-copy">
          <span className="vstore-kicker"><Sparkles size={14}/> OFFICIAL VELDORAMC STORE</span>
          <h1>Make your <span>mark.</span></h1>
          <p>Upgrade your Lifesteal adventure with ranks, bundles, crate keys, and in-game extras.</p>
          <a href="#store-items" className="vstore-primary">Explore the store <ArrowRight size={17}/></a>
          <div className="vstore-trust"><span><ShieldCheck size={15}/> Secure checkout*</span><span><Heart size={15}/> Support the server</span><span><Coins size={15}/> In-game perks</span></div>
        </div>
        <div className="vstore-hero-emblem" aria-hidden="true"><img src="/veldoramc-logo.svg" alt="" /><div className="vstore-emblem-heart">♥</div><span>LIFESTEAL NETWORK</span></div>
      </section>

      <section id="store-items" className="vstore-featured">
        <div className="vstore-section-head"><div><span className="vstore-kicker">PICK YOUR UPGRADE</span><h2>Featured <em>bundles</em></h2><p>Choose a starting point for your next run.</p></div><a href="/bundles" className="vstore-outline">All bundles <ArrowRight size={16}/></a></div>
        <div className="vstore-bundle-grid">
          {bundleHighlights.map(({fullName, name, description, price, tone, icon: Icon, perks, featured}) => (
            <article key={name} className={`vstore-bundle vstore-${tone} ${featured ? "is-featured" : ""}`}>
              {featured && <span className="vstore-popular">PLAYER FAVOURITE</span>}
              <div className="vstore-bundle-icon"><Icon size={26}/></div>
              <span className="vstore-bundle-label">{name.toUpperCase()} TIER</span>
              <h3>{fullName}</h3><p>{description}</p>
              <ul>{perks.map((perk) => <li key={perk}><span>✓</span>{perk}</li>)}</ul>
              <div className="vstore-bundle-bottom"><div className="vstore-bundle-price"><strong>{price}</strong><small>{formatInrEquivalent(price)}</small></div><PixelButton tone="primary" size="sm" className="vstore-bundle-cart" icon={addedBundle === tone ? CheckCircle2 : ShoppingCart} onClick={() => handleAddBundle({fullName, price, tone, icon: Icon})}>{addedBundle === tone ? "Added ✓" : "Add to Cart"}</PixelButton></div>
            </article>
          ))}
        </div>
        <p className="vstore-disclaimer">Bundle details and pricing are displayed as site examples. Confirm the current offer on the bundle page before purchase.</p>
      </section>

      <section className="vstore-catalog">
        <div className="vstore-section-head"><div><span className="vstore-kicker">BROWSE CATEGORIES</span><h2>Find your <em>upgrade</em></h2><p>Jump straight to the items you want to explore.</p></div></div>
        <StoreTabs active={activeTab} onChange={setActiveTab} />
        <div className="vstore-tab-panel"><ActiveTabComponent /></div>
      </section>
      <section className="vstore-support-strip"><div className="vstore-support-icon"><PackageOpen size={23}/></div><div><h2>Every purchase helps VeldoraMC grow.</h2><p>Questions about a rank or bundle? Ask the team before checking out.</p></div><a href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer">Get support <ArrowRight size={16}/></a></section>
      <StoreOverview />
    </main>
  );
}
