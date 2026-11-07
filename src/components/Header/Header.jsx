import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, UserRound, X, ArrowRight, Mail, LogOut, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "../../context/useCart";
import { useAuth } from "../../context/useAuth";
import "./Header.css";

const PLAYER_KEY = "veldora-store-player";

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [confirmedPlayer, setConfirmedPlayer] = useState(null);
  const [signingOut, setSigningOut] = useState(false);
  const { count } = useCart();
  const { user, signOut } = useAuth();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PLAYER_KEY) || "null");
      if (saved?.username) setConfirmedPlayer(saved);
    } catch {}
    const updatePlayer = (event) => setConfirmedPlayer(event.detail || null);
    window.addEventListener("veldora-player-updated", updatePlayer);
    return () => window.removeEventListener("veldora-player-updated", updatePlayer);
  }, []);

  function openPlayerIdentification() {
    setLoginOpen(false);
    window.dispatchEvent(new CustomEvent("veldora-open-player-identification"));
  }

  async function handleLogout() {
    setSigningOut(true);
    try {
      if (user) await signOut();
      if (confirmedPlayer) {
        localStorage.removeItem(PLAYER_KEY);
        setConfirmedPlayer(null);
        window.dispatchEvent(new CustomEvent("veldora-player-updated", { detail: null }));
      }
      setAccountMenuOpen(false);
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setSigningOut(false);
    }
  }

  const displayName = user?.email || confirmedPlayer?.username;

  return (
    <>
      <header className="vld-site-header vld-store-header">
        <div className="vld-header-inner">
          <Logo />
          <div className="vld-header-actions">
            {displayName ? (
              <div className="vld-account-menu-wrap">
                <button className="vld-store-login" type="button" aria-expanded={accountMenuOpen} onClick={() => setAccountMenuOpen(value => !value)}>
                  {user ? <Mail size={17}/> : <img src={`https://mc-heads.net/avatar/${encodeURIComponent(confirmedPlayer.username)}/32`} alt="" />}
                  <span>{displayName}</span><ChevronDown size={14}/>
                </button>
                {accountMenuOpen && (
                  <div className="vld-account-dropdown">
                    <span className="vld-account-dropdown-label">SIGNED IN AS</span>
                    <strong>{displayName}</strong>
                    <button type="button" onClick={handleLogout} disabled={signingOut}><LogOut size={15}/>{signingOut ? "Signing out…" : "Log out"}</button>
                  </div>
                )}
              </div>
            ) : (
              <button className="vld-store-login" type="button" onClick={() => setLoginOpen(true)}>
                <UserRound size={17}/><span>Login</span>
              </button>
            )}
            <Link className="vld-header-cart" to="/cart" aria-label={`Open shopping cart, ${count} items`}>
              <ShoppingBag size={17}/><span>Cart</span><b>{count}</b>
            </Link>
          </div>
        </div>
      </header>

      {loginOpen && (
        <div className="vld-player-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setLoginOpen(false); }}>
          <section className="vld-player-dialog" role="dialog" aria-modal="true" aria-labelledby="vld-player-title">
            <button className="vld-player-close" type="button" onClick={() => setLoginOpen(false)} aria-label="Close"><X size={19}/></button>
            <span className="vld-player-kicker">WELCOME TO VELDORAMC</span>
            <h2 id="vld-player-title">Choose how to <em>login.</em></h2>
            <div className="vld-login-methods">
              <button type="button" onClick={openPlayerIdentification}><UserRound size={19}/><span><strong>Continue with Minecraft</strong><small>Use your in-game username</small></span><ArrowRight size={17}/></button>
              <Link to="/store/account" onClick={() => setLoginOpen(false)}><Mail size={19}/><span><strong>Continue with Email</strong><small>Sign in with your email and password</small></span><ArrowRight size={17}/></Link>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
