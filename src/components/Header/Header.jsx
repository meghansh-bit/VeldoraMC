import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight, UserRound, LogOut } from "lucide-react";
import Logo from "./Logo";
import NavButton from "./NavButton";
import { navItems } from "./navItems";
import PixelButton from "../ui/PixelButton";
import { supabase } from "../../lib/supabase";

function MicrosoftMark({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path fill="#f25022" d="M1 1h10v10H1z"/><path fill="#7fba00" d="M13 1h10v10H13z"/><path fill="#00a4ef" d="M1 13h10v10H1z"/><path fill="#ffb900" d="M13 13h10v10H13z"/></svg>;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [lastPath, setLastPath] = useState(location.pathname);
  const [sessionUser, setSessionUser] = useState(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setSessionUser(data.session?.user || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user || null);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  const playerName = sessionUser
    ? (sessionUser.user_metadata?.minecraft_username || sessionUser.user_metadata?.gamertag || sessionUser.user_metadata?.username || "Player")
    : null;
  async function signOut() {
    await supabase.auth.signOut();
    setOpen(false);
  }

  function PlayerAccount({ mobile = false }) {
    if (!sessionUser) return mobile ? (
      <Link to="/login" onClick={() => setOpen(false)} className="vbtn vbtn-primary w-full justify-center"><MicrosoftMark size={18}/> Login</Link>
    ) : (
      <Link
        to="/login"
        className="vnav-login-button group inline-flex h-10 shrink-0 items-center justify-center gap-2.5 rounded-xl px-4 text-[12px] font-extrabold tracking-wide text-white transition-all duration-200"
      >
        <span className="vnav-login-icon flex h-6 w-6 items-center justify-center rounded-lg"><MicrosoftMark size={15} /></span>
        <span>Login</span>
        <ChevronRight size={14} className="vnav-login-arrow transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    );
    return (
      <div className={mobile ? "flex items-center gap-3 rounded-lg border border-cyan-300/20 bg-cyan-300/5 p-3" : "flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/5 px-3 py-2"}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
          <img
            src={`https://mc-heads.net/avatar/${encodeURIComponent(sessionUser.user_metadata?.minecraft_username || sessionUser.user_metadata?.gamertag || sessionUser.user_metadata?.username || "Steve")}/36`}
            alt={`${playerName} Minecraft skin head`}
            width="36"
            height="36"
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
          <UserRound size={18} className="hidden" />
        </span>
        <span className="min-w-0 flex-1"><span className="block text-[9px] font-bold tracking-[.16em] text-cyan-200/70">IN-GAME PLAYER</span><span className="block max-w-40 truncate text-sm font-bold text-white">{playerName}</span></span>
        <button type="button" onClick={signOut} title="Sign out" aria-label="Sign out" className="rounded-md p-2 text-white/50 hover:bg-white/10 hover:text-white"><LogOut size={16}/></button>
      </div>
    );
  }

  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    setOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 w-full border-b-3 border-t-3 border-(--color-border) bg-(--color-header) z-1000">
      <div className="flex h-14 w-full items-center justify-between">
        <div className="flex items-stretch">
          <Logo />
          <nav className="hidden items-stretch min-[1080px]:flex" aria-label="Primary">
            {navItems.map((item) => <NavButton key={item.to} {...item} />)}
          </nav>
        </div>

        <div className="hidden shrink-0 items-center gap-2 pr-3 min-[1080px]:flex">
          <PlayerAccount />
        </div>

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center text-(--color-text) min-[1080px]:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={"grid overflow-hidden transition-all duration-300 min-[1080px]:hidden " + (open ? "grid-rows-[1fr] border-t-2 border-(--color-border) opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="min-h-0">
          <nav className="flex flex-col" aria-label="Primary mobile">
            {navItems.map((item) => (
              <NavButton key={item.to} {...item} mobile onNavigate={() => setOpen(false)} />
            ))}
          </nav>
          <div className="px-4 py-4">
            <PlayerAccount mobile />
          </div>
        </div>
      </div>
    </header>
  );
}
