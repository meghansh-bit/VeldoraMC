import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, UserRound, X, ArrowRight, Mail } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "../../context/useCart";
import "./Header.css";

const PLAYER_KEY = "veldora-store-player";

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMethod, setLoginMethod] = useState("choose");
  const [confirmedPlayer, setConfirmedPlayer] = useState(null);
  const { count } = useCart();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PLAYER_KEY) || "null");
      if (saved?.username) setConfirmedPlayer(saved);
    } catch {}
    const updatePlayer = (event) => setConfirmedPlayer(event.detail || null);
    window.addEventListener("veldora-player-updated", updatePlayer);
    return () => window.removeEventListener("veldora-player-updated", updatePlayer);
  }, []);

  function closeLogin() {
    setLoginOpen(false);
    setLoginMethod("choose");
  }

  function openPlayerIdentification() {
    closeLogin();
    window.dispatchEvent(new CustomEvent("veldora-open-player-identification"));
  }

  return (
    <>
      <header className="vld-site-header vld-store-header">
        <div className="vld-header-inner">
          <Logo />
          <div className="vld-header-actions">
            <button className="vld-store-login" type="button" onClick={() => { setLoginMethod("choose"); setLoginOpen(true); }}>
              {confirmedPlayer ? <img src={`https://mc-heads.net/avatar/${encodeURIComponent(confirmedPlayer.username)}/32`} alt="" /> : <UserRound size={17} />}
              <span>{confirmedPlayer?.username || "Login"}</span>
            </button>
            <Link className="vld-header-cart" to="/cart" aria-label={`Open shopping cart, ${count} items`}>
              <ShoppingBag size={17}/><span>Cart</span><b>{count}</b>
            </Link>
          </div>
        </div>
      </header>

      {loginOpen && (
        <div className="vld-player-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) closeLogin(); }}>
          <section className="vld-player-dialog" role="dialog" aria-modal="true" aria-labelledby="vld-player-title">
            <button className="vld-player-close" type="button" onClick={closeLogin} aria-label="Close"><X size={19}/></button>
            <span className="vld-player-kicker">WELCOME TO VELDORAMC</span>
            <h2 id="vld-player-title">Choose how to <em>login.</em></h2>
            <div className="vld-login-methods">
              <button type="button" onClick={openPlayerIdentification}><UserRound size={19}/><span><strong>Continue with Minecraft</strong><small>Use your in-game username</small></span><ArrowRight size={17}/></button>
              <Link to="/store/account" onClick={closeLogin}><Mail size={19}/><span><strong>Continue with Email</strong><small>Sign in with your email and password</small></span><ArrowRight size={17}/></Link>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
