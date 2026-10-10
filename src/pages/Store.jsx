import { useState } from "react";
import { ArrowRight, PackageOpen, Sparkles } from "lucide-react";
import StoreOverview from "../components/store/StoreOverview";
import StoreTabs from "../components/store/StoreTabs";
import { STORE_TABS } from "../components/store/storeTabsConfig";
import RanksTab from "../components/store/tabs/RanksTab";
import CratesTab from "../components/store/tabs/CratesTab";
import CurrencyTab from "../components/store/tabs/CurrencyTab";
import TopDonatorsTab from "../components/store/tabs/TopDonatorsTab";
import { useSeo } from "../hooks/useSeo";

const TAB_COMPONENTS = {
  ranks: RanksTab,
  crates: CratesTab,
  currency: CurrencyTab,
  donators: TopDonatorsTab,
};

const bundleHighlights = [
  { name: "Starter Bundle", description: "A strong start for your next adventure.", price: "₹199", tone: "starter" },
  { name: "Warrior Bundle", description: "More gear, more keys, more ways to win.", price: "₹499", tone: "warrior" },
  { name: "Champion Bundle", description: "A premium upgrade for dedicated players.", price: "₹999", tone: "champion" },
  { name: "Mythic Bundle", description: "The elite VeldoraMC experience.", price: "₹1,799", tone: "mythic" },
];

export default function Store() {
  useSeo({
    title: "Store",
    description: "Explore VeldoraMC bundles, ranks, crate keys, and in-game currency.",
    path: "/store",
  });

  const [activeTab, setActiveTab] = useState(STORE_TABS[0].key);
  const ActiveTabComponent = TAB_COMPONENTS[activeTab];

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <header className="relative mb-8 overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-950/70 via-slate-950 to-fuchsia-950/40 p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />
        <span className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[.2em] text-violet-300"><Sparkles size={15} /> VELDORAMC STORE</span>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">Gear up. <span className="text-violet-300">Stand out.</span></h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Discover exclusive bundles, ranks, crates, and upgrades built for your next adventure.</p>
      </header>

      <section aria-labelledby="store-bundles-heading" className="mb-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold tracking-[.18em] text-violet-300">FEATURED OFFERS</span>
            <h2 id="store-bundles-heading" className="mt-2 text-2xl font-black text-white sm:text-3xl">Bundles</h2>
            <p className="mt-2 text-sm text-slate-400">Pick your upgrade and find the bundle that fits your playstyle.</p>
          </div>
          <a href="/bundles" className="inline-flex items-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-3 text-sm font-bold text-violet-200 transition hover:bg-violet-500/20">View all bundles <ArrowRight size={16} /></a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {bundleHighlights.map((bundle) => (
            <a href="/bundles" key={bundle.name} className="group rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-violet-950/40 p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-400/50 hover:shadow-xl hover:shadow-violet-950/30">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><PackageOpen size={22} /></div>
              <h3 className="text-lg font-extrabold text-white">{bundle.name}</h3>
              <p className="mt-2 min-h-10 text-sm leading-5 text-slate-400">{bundle.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-xl font-black text-violet-200">{bundle.price}</span><span className="text-xs font-bold text-slate-400 group-hover:text-white">Explore <ArrowRight className="ml-1 inline" size={14} /></span></div>
            </a>
          ))}
        </div>
      </section>

      <StoreOverview />
      <StoreTabs active={activeTab} onChange={setActiveTab} />
      <ActiveTabComponent />
    </section>
  );
}