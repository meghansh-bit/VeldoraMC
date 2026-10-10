import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserRound, Swords, HeartPulse, Clock3, Crown, Coins, Gamepad2, Monitor, Smartphone, ArrowRight, Medal } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import { avatarUrl } from "../data/votes";

const PROFILE_STATS = [
  { label: "KILLS", detail: "Confirmed player eliminations", icon: Swords, accent: "text-rose-300", glow: "from-rose-400/15" },
  { label: "DEATHS", detail: "Times fallen in battle", icon: HeartPulse, accent: "text-orange-200", glow: "from-orange-300/15" },
  { label: "PLAYTIME", detail: "Time spent in the realm", icon: Clock3, accent: "text-cyan-200", glow: "from-cyan-400/15" },
  { label: "RANK & VELORA", detail: "Rank and in-game currency", icon: Crown, accent: "text-amber-200", glow: "from-amber-300/15" },
];

export default function PlayerProfiles() {
  const [query, setQuery] = useState("");
  const [searchedPlayer, setSearchedPlayer] = useState("");
  const [error, setError] = useState("");
  useSeo({ title: "Player Profiles", description: "Search VeldoraMC player profiles, kills, deaths, playtime, rank, Velora, and Java or Bedrock edition.", path: "/profiles" });

  function handleSearch(event) {
    event.preventDefault();
    const username = query.trim().replace(/^@/, "");
    if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) {
      setSearchedPlayer("");
      setError("Enter a Minecraft username between 3 and 16 characters.");
      return;
    }
    setSearchedPlayer(username);
    setError("");
  }

  return <main className="portal-page">
    <div className="portal-glow"/>
    <div className="portal-inner">
      <div className="section-kicker">01 / PLAYER DIRECTORY</div>
      <div className="portal-heading">
        <div className="portal-icon"><UserRound size={29}/></div>
        <h1>PLAYER PROFILES<span>.</span><br/><span>KNOW THE LEGENDS.</span></h1>
      </div>
      <p className="portal-intro">Look up a player and explore their VeldoraMC stats, rank, Velora, and edition.</p>

      <div className="coming-banner"><span className="live-dot"/><div><b>PLAYER STATS INTEGRATION PENDING</b><small>Search and profile layout are ready. Verified stats will appear after the Minecraft server API is connected.</small></div></div>

      <form onSubmit={handleSearch} className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#11131c] px-4 focus-within:border-cyan-300/50">
          <Search size={19} className="shrink-0 text-white/40"/>
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search Minecraft username..." aria-label="Minecraft username" className="h-14 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"/>
        </label>
        <button type="submit" className="vbtn vbtn-primary min-h-14 justify-center"><Search size={17}/> SEARCH PLAYER</button>
      </form>
      {error && <p role="alert" className="mt-3 rounded-lg border border-rose-300/20 bg-rose-400/5 p-3 text-sm text-rose-200">{error}</p>}

      {searchedPlayer ? <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="relative overflow-hidden rounded-xl border border-white/10 bg-[#11131c] p-5 sm:col-span-2 sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-400/15 via-transparent to-violet-400/10"/>
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
            <img src={avatarUrl(searchedPlayer, 96)} alt="" className="h-20 w-20 rounded-xl border border-white/10 bg-black/30 [image-rendering:pixelated]" onError={event => { event.currentTarget.style.visibility = "hidden"; }}/>
            <div className="min-w-0 flex-1"><div className="text-[10px] font-bold tracking-[.2em] text-cyan-200/70">PLAYER PROFILE</div><h2 className="mt-1 break-all text-2xl font-extrabold text-white">{searchedPlayer}</h2><p className="mt-2 text-xs text-white/45">Profile preview · not yet verified by the server</p></div>
            <span className="w-fit rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[10px] font-bold tracking-wider text-white/55">STATS COMING SOON</span>
          </div>
        </article>
        {PROFILE_STATS.map(({label,detail,icon:Icon,accent,glow},index) => <article key={label} className="relative overflow-hidden rounded-xl border border-white/10 bg-[#11131c] p-5 sm:p-6"><div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glow} to-transparent opacity-80`}/><div className="relative"><div className="flex items-start justify-between gap-3"><div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/20 ${accent}`}><Icon size={23}/></div><span className="text-[10px] font-bold tracking-[.2em] text-white/35">STAT 0{index+1}</span></div><h3 className={`mt-5 text-lg font-extrabold tracking-wide ${accent}`}>{label}</h3><p className="mt-1 text-xs leading-5 text-white/45">{detail}</p><div className="mt-5 flex min-h-20 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/20 px-4 py-4 text-center"><Medal size={20} className="mb-2 text-white/25"/><p className="text-xs font-bold tracking-wider text-white/50">—</p><p className="mt-1 text-[11px] text-white/35">Waiting for live stats</p></div></div></article>)}
        <article className="relative overflow-hidden rounded-xl border border-white/10 bg-[#11131c] p-5 sm:col-span-2 sm:p-6"><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-extrabold tracking-wider text-white">PLAYING EDITION</h3><p className="mt-1 text-xs text-white/45">Java or Bedrock</p></div><Gamepad2 size={22} className="text-cyan-200"/></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-4"><Monitor size={22} className="text-cyan-200"/><div><p className="text-sm font-bold text-white">Java Edition</p><p className="mt-1 text-xs text-white/40">Not connected</p></div></div><div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-4"><Smartphone size={22} className="text-violet-200"/><div><p className="text-sm font-bold text-white">Bedrock Edition</p><p className="mt-1 text-xs text-white/40">Not connected</p></div></div></div></article>
      </section> : <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PROFILE_STATS.map(({label,detail,icon:Icon,accent,glow},index) => <article key={label} className="relative overflow-hidden rounded-xl border border-white/10 bg-[#11131c] p-5 sm:p-6"><div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glow} to-transparent opacity-80`}/><div className="relative"><div className="flex items-start justify-between gap-3"><div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/20 ${accent}`}><Icon size={23}/></div><span className="text-[10px] font-bold tracking-[.2em] text-white/35">CATEGORY 0{index+1}</span></div><h2 className={`mt-5 text-lg font-extrabold tracking-wide ${accent}`}>{label}</h2><p className="mt-1 text-sm font-semibold text-white/80">{detail}</p><div className="mt-5 flex min-h-20 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/20 px-4 py-4 text-center"><Medal size={20} className="mb-2 text-white/25"/><p className="text-xs font-bold tracking-wider text-white/50">PLAYER DATA PREVIEW</p><p className="mt-1 text-[11px] text-white/35">Search a username to view this section</p></div></div></article>)}
      </div>}

      <div className="portal-bottom"><div><h2>MAKE YOUR NAME LEGENDARY.</h2><p>Join the realm and earn your place in VeldoraMC history.</p></div><Link className="vbtn vbtn-primary" to="/">BACK TO HOME <ArrowRight size={16}/></Link></div>
    </div>
  </main>;
}
