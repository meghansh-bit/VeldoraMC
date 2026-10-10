import { Coins, ArrowRight, Sparkles, ShieldCheck, Heart } from "lucide-react";
import CurrencyTab from "../components/store/tabs/CurrencyTab";
import { useSeo } from "../hooks/useSeo";

export default function Store() {
  useSeo({
    title: "VeldoraMC Coin Store",
    description: "Browse VeldoraMC in-game coin packs.",
    path: "/store",
  });

  return (
    <main className="veldora-store">
      <section className="vstore-hero">
        <div className="vstore-orb vstore-orb-one" />
        <div className="vstore-orb vstore-orb-two" />
        <div className="vstore-hero-copy">
          <span className="vstore-kicker"><Sparkles size={14} /> OFFICIAL VELDORAMC STORE</span>
          <h1>Get more <span>coins.</span></h1>
          <p>Choose a coin pack to boost your in-game progress.</p>
          <a href="#coin-packs" className="vstore-primary">Browse coin packs <ArrowRight size={17} /></a>
          <div className="vstore-trust">
            <span><ShieldCheck size={15} /> Support the server</span>
            <span><Heart size={15} /> In-game currency</span>
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
            <h2>Choose your <em>coin pack</em></h2>
            <p>Prices are displayed in Indian rupees (INR).</p>
          </div>
        </div>
        <div className="vstore-tab-panel">
          <CurrencyTab />
        </div>
      </section>
    </main>
  );
}
