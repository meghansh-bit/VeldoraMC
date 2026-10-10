import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserRound, Swords, HeartPulse, Clock3, Crown, Coins, Gamepad2, Monitor, Smartphone, ArrowRight, ShieldCheck } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import { avatarUrl } from "../data/votes";

const STATS = [
  { label: "KILLS", value: "—", icon: Swords, tone: "text-rose-300" },
  { label: "DEATHS", value: "—", icon: HeartPulse, tone: "text-orange-200" },
  { label: "PLAYTIME", value: "—", icon: Clock3, tone: "text-cyan-200" },
  { label: "RANK", value: "—", icon: Crown, tone: "text-violet-200" },
  { label: "VELORA", value: "—", icon: Coins, tone: "text-amber-200" },
];

export default function PlayerProfiles() {
  const [query, setQuery] = useState("");
  const [searchedPlayer, setSearchedPlayer] = useState("");
  const [searched, setSearched] = useState(false);
  useSeo({ title: "Player Profiles", description: "Search VeldoraMC player profiles and view kills, deaths, playtime, rank, Velora, and Java or Bedrock platform.", path: "/profiles" });

  function handleSearch(event) {
    event.preventDefault();
    const username = query.trim().replace(/^@/, "");
    if (!username || !/^[A-Za-z0-9_]{3,16}$/.test(username)) {
      setSearchedPlayer("");
      setSearched(true);
      return;
    }
    setSearchedPlayer(username);
    setSearched(true);
  }

  return <main className="portal-page">
    <div className="portal-glow"/>
    <div className="portal-inner">
      <div className="section-kicker">01 / PLAYER DIRECTORY</div>
      <div className="portal-heading">
        <div className="portal-icon"><UserRound size={29}/></div>
        <h1>PLAYER PROFILES<span>.</span><br/><span>YOUR LEGACY.</span></h1>
      </div>
      <p className="portal-intro">Search a Minecraft username to explore a player's VeldoraMC identity, stats, rank, and platform.</p>

      <form onSubmit={handleSearch} className="mt-8 flex w-full max-w-3xl flex-col gap-3 sm:flex-row">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#11131c] px-4 focus-within:border-cyan-300/50">
          <Search size={19} className="shrink-0 text-white/40"/>
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Enter Minecraft username..." aria-label="Minecraft username" className="h-14 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"/>
        </label>
        <button type="submit" className="vbtn vbtn-primary min-h-14 justify-center"><Search size={17}/> SEARCH PLAYER</button>
      </form>
      <p className="mt-3 text-[11px] text-white/40">Use a Java or Bedrock player name (3–16 letters, numbers, or underscores).</p>

      {searched && !searchedPlayer && <p role="alert" className="mt-5 rounded-lg border border-rose-300/20 bg-rose-400/5 p-4 text-sm text-rose-200">Enter a valid Minecraft username to search.</p>}

      {searchedPlayer && <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#10121a]">
        <div className="flex flex-col gap-5 border-b border-white/10 bg-gradient-to-r from-cyan-300/[.09] via-transparent to-violet-400/[.08] p-5 sm:flex-row sm:items-center sm:p-7">
          <img src={avatarUrl(searchedPlayer, 96)} alt="" className="h-20 w-20 rounded-xl border border-white/10 bg-black/30 [image-rendering:pixelated]" onError={event => { event.currentTarget.style.visibility = "hidden"; }}/>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold tracking-[.2em] text-cyan-200/70">PLAYER PROFILE</div>
            <h2 className="mt-1 break-all text-2xl font-extrabold text-white">{searchedPlayer}</h2>
            <p className="mt-2 text-xs text-white/45">Stats will appear when live server data is connected.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[10px] font-bold tracking-wider text-white/60"><ShieldCheck size={14}/> UNVERIFIED PROFILE</span>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-6 lg:grid-cols-5">
          {STATS.map(({label,value,icon:Icon,tone}) => <div key={label} className="rounded-xl border border-white/[.07] bg-white/[.025] p-4">
            <Icon size={19} className={tone}/>
            <div className="mt-4 text-xl font-extrabold text-white">{value}</div>
            <div className="mt-1 text-[10px] font-bold tracking-[.14em] text-white/40">{label}</div>
          </div>)}
        </div>
        <div className="grid gap-3 border-t border-white/10 p-4 sm:grid-cols-2 sm:p-6">
          <div className="flex items-center gap-3 rounded-xl border border-white/[.07] p-4"><Monitor size={21} className="text-cyan-200"/><div><div className="text-sm font-bold text-white">Java Edition</div><div className="mt-1 text-xs text-white/40">Platform status unavailable</div></div></div>
          <div className="flex items-center gap-3 rounded-xl border border-white/[.07] p-4"><Smartphone size={21} className="text-violet-200"/><div><div className="text-sm font-bold text-white">Bedrock Edition</div><div className="mt-1 text-xs text-white/40">Platform status unavailable</div></div></div>
        </div>
        <div className="border-t border-white/10 bg-black/10 px-5 py-4 text-xs leading-5 text-white/40">This is a profile preview only. The name is not yet verified against VeldoraMC, and the stats and edition require a live server/plugin API before they can be displayed accurately.</div>
      </section>}

      {!searchedPlayer && <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[["PLAYER STATS","Kills, deaths, and total playtime.",Swords],["RANK & VELORA","Showcase rank and Velora balance.",Coins],["JAVA OR BEDROCK","Identify the edition used to join.",Gamepad2]].map(([title,description,Icon]) => <article key={title} className="rounded-xl border border-white/10 bg-[#11131c] p-5"><Icon size={22} className="text-cyan-200"/><h2 className="mt-4 text-sm font-extrabold tracking-wider text-white">{title}</h2><p className="mt-2 text-xs leading-5 text-white/45">{description}</p></article>)}
      </div>}

      <div className="portal-bottom"><div><h2>READY TO MAKE YOUR MARK?</h2><p>Join VeldoraMC and start building your legacy.</p></div><Link className="vbtn vbtn-primary" to="/">BACK TO HOME <ArrowRight size={16}/></Link></div>
    </div>
  </main>;
}
