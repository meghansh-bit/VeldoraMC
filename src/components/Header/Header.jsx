import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, UserRound, LogIn } from "lucide-react";
import Logo from "./Logo";
import NavButton from "./NavButton";
import NetworkStatus from "../NetworkStatus";
import { navItems } from "./navItems";
import { useAuth } from "../../context/useAuth";
import { supabase } from "../../lib/supabase";

function MinecraftMark(){return <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#62b34b" d="M2 5.2 12 1l10 4.2-10 4.2z"/><path fill="#3d8d3d" d="M2 5.2v13.5L12 23V9.4z"/><path fill="#75c653" d="M22 5.2v13.5L12 23V9.4z"/><path fill="#9be36d" d="m5.2 6.5 6.8-2.8 6.8 2.8-6.8 2.8z"/></svg>}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const inStore = pathname.startsWith("/store") || pathname === "/cart";

  async function signInWithMicrosoft() {
    setAuthError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        scopes: "openid profile email",
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setAuthError("Microsoft sign-in needs the Azure provider enabled in Supabase Auth.");
      setAuthLoading(false);
    }
  }

  return (
    <header className="vld-site-header">
      <div className="vld-header-inner">
        <Logo />
        <nav className="vld-main-nav" aria-label="Primary navigation">
          {navItems.map((item) => <NavButton key={item.to} {...item} />)}
        </nav>
        <div className="vld-header-actions">
          <NetworkStatus />
          {user ? (
            <Link className="vld-microsoft-cta is-authenticated" to="/store/account"><UserRound size={15}/> Account</Link>
          ) : (
            <button className="vld-microsoft-cta" type="button" onClick={signInWithMicrosoft} disabled={authLoading}>
              <MinecraftMark/>
              {authLoading ? "Connecting…" : "Continue with Microsoft"}
            </button>
          )}
          {inStore && <Link className="vld-header-cart" to="/cart" aria-label="Open shopping cart"><ShoppingBag size={17}/><span>Cart</span></Link>}
          <button className="vld-menu-toggle" type="button" onClick={() => setOpen(v => !v)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
        </div>
      </div>
      {authError && <div className="vld-auth-error" role="status">{authError}</div>}
      {open && <nav className="vld-mobile-nav" aria-label="Mobile navigation">
        {navItems.map(item => <NavButton key={item.to} {...item} mobile onNavigate={() => setOpen(false)}/>)}
        <NetworkStatus />
        {!user && <button className="vld-microsoft-cta" type="button" onClick={signInWithMicrosoft} disabled={authLoading}><MinecraftMark/>{authLoading ? "Connecting…" : "Continue with Microsoft"}</button>}
      </nav>}
    </header>
  );
}
