import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X, ChevronRight, UserRound, LogOut, Search, LoaderCircle, Gamepad2, Monitor } from "lucide-react";
import Logo from "./Logo";
import NavButton from "./NavButton";
import { navItems } from "./navItems";

const PLAYER_STORAGE_KEY = "veldora_selected_player";

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [lastPath, setLastPath] = useState(location.pathname);
  const [player, setPlayer] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [edition, setEdition] = useState("java");
  const [username, setUsername] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(PLAYER_STORAGE_KEY);
      if (saved) setPlayer(JSON.parse(saved));
    } catch {
      window.localStorage.removeItem(PLAYER_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (location.pathname !== lastPath) {
      setLastPath(location.pathname);
      setOpen(false);
    }
  }, [location.pathname, lastPath]);

  function closeLogin() {
    setLoginOpen(false);
    setError("");
    setPreview(null);
    setUsername("");
  }

  async function searchPlayer(event) {
    event.preventDefault();
    const clean = username.trim();
    if (edition === "java") {
      if (!/^[A-Za-z0-9_]{3,16}$/.test(clean)) {
        setError("Java usernames must be 3–16 letters, numbers or underscores.");
        setPreview(null);
        return;
      }
    } else if (!/^[A-Za-z0-9 ]{1,16}$/.test(clean)) {
      setError("Enter a valid Bedrock gamertag (1–16 letters, numbers or spaces).");
      setPreview(null);
      return;
    }

    setLoading(true);
    setError("");
    setPreview(null);
    try {
      if (edition === "java") {
        const response = await fetch(`/api/minecraft/player?username=${encodeURIComponent(clean)}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Couldn't find that Java Edition profile.");
        if (!data?.id || !data?.name) throw new Error("That username doesn't have a valid Java profile.");
        setPreview({
          id: data.id,
          name: data.name,
          edition: "java",
          avatar: data.avatar,
          body: data.body,
          hasCustomSkin: data.hasCustomSkin,
          verifiedLookup: true
        });
      } else {
        setPreview({
          id: null,
          name: clean,
          edition: "bedrock",
          avatar: "https://mc-heads.net/avatar/Steve/96",
          body: "https://mc-heads.net/body/Steve",
          verifiedLookup: false
        });
      }
    } catch (lookupError) {
      setError(lookupError.message || "Player lookup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function confirmPlayer() {
    if (!preview) return;
    setPlayer(preview);
    window.localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(preview));
    closeLogin();
  }

  function clearPlayer() {
    window.localStorage.removeItem(PLAYER_STORAGE_KEY);
    setPlayer(null);
    setOpen(false);
  }

  function PlayerAccount({ mobile = false }) {
    if (!player) {
      return (
        <button type="button" onClick={() => { setLoginOpen(true); setOpen(false); }}
          className={mobile ? "vbtn vbtn-primary w-full justify-center" : "vnav-login-button group inline-flex h-10 shrink-0 items-center justify-center gap-2.5 rounded-xl px-4 text-[12px] font-extrabold tracking-wide text-white transition-all duration-200"}>
          <span className="flex h-6 w-6 items-center justify-center rounded-lg"><UserRound size={17} /></span>
          <span>Login</span>
          {!mobile && <ChevronRight size={14} className="vnav-login-arrow transition-transform duration-200 group-hover:translate-x-0.5" />}
        </button>
      );
    }
    return (
      <div className={mobile ? "flex items-center gap-3 rounded-lg border border-cyan-300/20 bg-cyan-300/5 p-3" : "flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/5 px-2 py-1.5"}>
        <div title={`${player.name} · ${player.edition === "bedrock" ? "Bedrock" : "Java"}`} className="flex min-w-0 items-center gap-2">
          <img src={player.avatar} alt="" width="36" height="36" className="h-9 w-9 shrink-0 rounded-lg border border-cyan-300/25 bg-black/30 [image-rendering:pixelated]" />
          <span className="min-w-0 text-left">
            <span className="block text-[9px] font-bold tracking-[.16em] text-cyan-200/70">{player.edition === "bedrock" ? "BEDROCK PLAYER" : "JAVA PLAYER"}</span>
            <span className="block max-w-32 truncate text-sm font-bold text-white">{player.name}</span>
          </span>
        </div>
        <button type="button" onClick={() => { setLoginOpen(true); setOpen(false); }} title="Change player" aria-label="Change player" className="rounded-md p-2 text-white/50 hover:bg-white/10 hover:text-white"><Search size={15} /></button>
        <button type="button" onClick={clearPlayer} title="Log out" aria-label="Clear selected player" className="rounded-md p-2 text-white/50 hover:bg-white/10 hover:text-white"><LogOut size={15} /></button>
      </div>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full border-b-3 border-t-3 border-(--color-border) bg-(--color-header) z-1000">
        <div className="flex h-14 w-full items-center justify-between">
          <div className="flex items-stretch">
            <Logo />
            <nav className="hidden items-stretch min-[1080px]:flex" aria-label="Primary">
              {navItems.map((item) => <NavButton key={item.to} {...item} />)}
            </nav>
          </div>
          <div className="hidden shrink-0 items-center gap-2 pr-3 min-[1080px]:flex"><PlayerAccount /></div>
          <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center text-(--color-text) min-[1080px]:hidden"
            onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div className={"grid overflow-hidden transition-all duration-300 min-[1080px]:hidden " + (open ? "grid-rows-[1fr] border-t-2 border-(--color-border) opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="min-h-0">
            <nav className="flex flex-col" aria-label="Primary mobile">
              {navItems.map((item) => <NavButton key={item.to} {...item} mobile onNavigate={() => setOpen(false)} />)}
            </nav>
            <div className="px-4 py-4"><PlayerAccount mobile /></div>
          </div>
        </div>
      </header>

      {loginOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closeLogin(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="player-login-title"
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#10131c] p-5 shadow-2xl shadow-black/60">
            <button type="button" onClick={closeLogin} aria-label="Close login" className="absolute right-4 top-4 rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"><X size={19} /></button>
            
            <div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-bold tracking-[.2em] text-cyan-200/70">PLAYER PROFILE</p><h2 id="player-login-title" className="mt-1 text-xl font-black text-white">WELCOME BACK<span className="text-rose-400">.</span></h2></div><span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold tracking-wider text-white/40">MINECRAFT</span></div>
            <p className="mt-1 text-sm leading-5 text-white/50">Select your edition and enter your in-game name.</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" aria-pressed={edition === "java"} onClick={() => { setEdition("java"); setPreview(null); setError(""); setUsername(""); }}
                className={"group relative flex min-h-[112px] flex-col justify-between overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 " + (edition === "java" ? "border-emerald-300/70 bg-gradient-to-br from-emerald-400/20 to-emerald-900/10 text-white shadow-[0_8px_28px_rgba(16,185,129,.12)]" : "border-white/10 bg-white/[.035] text-white/65 hover:border-emerald-300/35 hover:bg-white/[.06] hover:text-white")}>
                <span className="flex w-full items-center justify-between">
                  <span className={"flex h-10 w-10 items-center justify-center rounded-xl border transition-colors " + (edition === "java" ? "border-emerald-200/30 bg-emerald-300 text-[#07150f]" : "border-white/10 bg-white/[.06] text-white/70 group-hover:border-emerald-300/20")}><Monitor size={20} /></span>
                  <span className={"rounded-full px-2 py-1 text-[9px] font-extrabold tracking-widest " + (edition === "java" ? "bg-emerald-300/15 text-emerald-200" : "bg-white/5 text-white/35")}>{edition === "java" ? "SELECTED" : "JAVA"}</span>
                </span>
                <span><span className="block text-sm font-extrabold tracking-wide">Java Edition</span><span className={"mt-1 block text-[11px] " + (edition === "java" ? "text-emerald-100/65" : "text-white/35")}>PC · Mac · Linux</span></span>
              </button>
              <button type="button" aria-pressed={edition === "bedrock"} onClick={() => { setEdition("bedrock"); setPreview(null); setError(""); setUsername(""); }}
                className={"group relative flex min-h-[112px] flex-col justify-between overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 " + (edition === "bedrock" ? "border-emerald-300/70 bg-gradient-to-br from-emerald-400/20 to-emerald-900/10 text-white shadow-[0_8px_28px_rgba(16,185,129,.12)]" : "border-white/10 bg-white/[.035] text-white/65 hover:border-emerald-300/35 hover:bg-white/[.06] hover:text-white")}>
                <span className="flex w-full items-center justify-between">
                  <span className={"flex h-10 w-10 items-center justify-center rounded-xl border transition-colors " + (edition === "bedrock" ? "border-emerald-200/30 bg-emerald-300 text-[#07150f]" : "border-white/10 bg-white/[.06] text-white/70 group-hover:border-emerald-300/20")}><Gamepad2 size={20} /></span>
                  <span className={"rounded-full px-2 py-1 text-[9px] font-extrabold tracking-widest " + (edition === "bedrock" ? "bg-emerald-300/15 text-emerald-200" : "bg-white/5 text-white/35")}>{edition === "bedrock" ? "SELECTED" : "BEDROCK"}</span>
                </span>
                <span><span className="block text-sm font-extrabold tracking-wide">Bedrock Edition</span><span className={"mt-1 block text-[11px] " + (edition === "bedrock" ? "text-emerald-100/65" : "text-white/35")}>Console · Mobile · Windows</span></span>
              </button>
            </div>

            <form onSubmit={searchPlayer} className="mt-5">
              <label htmlFor="minecraft-username" className="mb-2 block text-xs font-bold tracking-wider text-white/70">{edition === "java" ? "JAVA USERNAME" : "BEDROCK GAMERTAG"}</label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 focus-within:border-cyan-300/50">
                <UserRound size={17} className="text-white/40" />
                <input id="minecraft-username" autoFocus autoComplete="off" maxLength={16} value={username}
                  onChange={(event) => { setUsername(event.target.value); setError(""); setPreview(null); }}
                  placeholder={edition === "java" ? "e.g. Steve" : "e.g. Xbox gamertag"}
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
              </div>
              {error && <p role="alert" className="mt-3 rounded-lg border border-rose-300/20 bg-rose-400/5 p-3 text-xs leading-5 text-rose-200">{error}</p>}
              <button type="submit" disabled={loading || !username.trim()} className="vbtn vbtn-primary mt-3 min-h-12 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? <><LoaderCircle size={17} className="animate-spin" /> SEARCHING...</> : <><Search size={17} /> {edition === "java" ? "FIND JAVA PROFILE" : "USE BEDROCK GAMERTAG"}</>}
              </button>
            </form>

            {preview && (
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/[.035] p-3">
                <div className="flex items-center gap-4">
                  <img src={preview.body} alt={preview.verifiedLookup ? `${preview.name} Minecraft skin preview` : "Generic Minecraft preview; Bedrock skin is not publicly searchable"} className="h-24 w-16 object-contain [image-rendering:pixelated]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold tracking-[.16em] text-emerald-200">{preview.verifiedLookup ? (preview.hasCustomSkin ? "JAVA PROFILE · CUSTOM SKIN" : "JAVA PROFILE · DEFAULT SKIN") : "GAMERTAG SELECTED"}</p>
                    <p className="mt-1 break-all text-xl font-black text-white">{preview.name}</p>
                    <p className="mt-1 text-xs text-white/45">{edition === "java" ? (preview.hasCustomSkin ? "Skin texture detected" : "No custom skin is set on this profile") : "Minecraft Bedrock Edition"}</p>
                  </div>
                  <img src={preview.avatar} alt="" className="h-10 w-10 rounded-lg border border-white/10 [image-rendering:pixelated]" />
                </div>
                <button type="button" onClick={confirmPlayer} className="vbtn vbtn-primary mt-4 min-h-12 w-full justify-center">CONTINUE AS {preview.name.toUpperCase()} <ChevronRight size={17} /></button>
              </div>
            )}

          </section>
        </div>
      )}
    </>
  );
}
