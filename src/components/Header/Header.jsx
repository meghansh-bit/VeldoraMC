import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, UserRound, X, Check, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "../../context/useCart";
import "./Header.css";

const PLAYER_KEY = "veldora-store-player";

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [previewName, setPreviewName] = useState("");
  const [confirmedPlayer, setConfirmedPlayer] = useState(null);
  const [previewError, setPreviewError] = useState("");
  const { count } = useCart();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PLAYER_KEY) || "null");
      if (saved?.username) {
        setConfirmedPlayer(saved);
        setUsername(saved.username);
      }
    } catch {}
  }, []);

  function previewPlayer(event) {
    event.preventDefault();
    const clean = username.trim();
    if (!/^[A-Za-z0-9_]{3,16}$/.test(clean)) {
      setPreviewError("Enter a valid Minecraft username (3–16 characters).");
      return;
    }
    setPreviewError("");
    setPreviewName(clean);
  }

  function confirmPlayer() {
    const next = { username: previewName, platform: "java" };
    localStorage.setItem(PLAYER_KEY, JSON.stringify(next));
    setConfirmedPlayer(next);
    setUsername(previewName);
    setLoginOpen(false);
    setPreviewName("");
  }

  function closeLogin() {
    setLoginOpen(false);
    setPreviewName("");
    setPreviewError("");
  }

  return (
    <>
      <header className="vld-site-header vld-store-header">
        <div className="vld-header-inner">
          <Logo />
          <div className="vld-header-actions">
            <button className="vld-store-login" type="button" onClick={() => setLoginOpen(true)}>
              {confirmedPlayer ? (
                <img src={`https://mc-heads.net/avatar/${encodeURIComponent(confirmedPlayer.username)}/32`} alt="" />
              ) : <UserRound size={17} />}
              <span>{confirmedPlayer?.username || "Login"}</span>
            </button>
            <Link className="vld-header-cart" to="/cart" aria-label={`Open shopping cart, ${count} items`}>
              <ShoppingBag size={17} /><span>Cart</span><b>{count}</b>
            </Link>
          </div>
        </div>
      </header>

      {loginOpen && (
        <div className="vld-player-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) closeLogin(); }}>
          <section className="vld-player-dialog" role="dialog" aria-modal="true" aria-labelledby="vld-player-title">
            <button className="vld-player-close" type="button" onClick={closeLogin} aria-label="Close"><X size={19}/></button>
            <span className="vld-player-kicker">MINECRAFT PLAYER</span>
            <h2 id="vld-player-title">Who's <em>playing?</em></h2>
            {!previewName ? (
              <form onSubmit={previewPlayer}>
                <label htmlFor="vld-player-name">Minecraft username</label>
                <input id="vld-player-name" autoFocus autoComplete="off" maxLength={16} value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Java username" />
                {previewError && <p className="vld-player-error">{previewError}</p>}
                <p className="vld-player-help">We'll show the matching Minecraft player head so you can check it before continuing.</p>
                <button className="vld-player-primary" type="submit">Find player <ArrowRight size={16}/></button>
              </form>
            ) : (
              <div className="vld-player-confirm">
                <img className="vld-player-head" src={`https://mc-heads.net/avatar/${encodeURIComponent(previewName)}/96`} alt={`${previewName}'s Minecraft player head`} onError={() => setPreviewError("Couldn't load that player's head. Check the username and try again.")} />
                <strong>{previewName}</strong>
                <p>Is this you?</p>
                {previewError && <p className="vld-player-error">{previewError}</p>}
                <div className="vld-player-choices">
                  <button type="button" className="vld-player-primary" onClick={confirmPlayer}><Check size={16}/> Yes, that's me</button>
                  <button type="button" className="vld-player-secondary" onClick={() => { setPreviewName(""); setPreviewError(""); }}>No, try again</button>
                </div>
              </div>
            )}
            <p className="vld-player-disclaimer">This is a username selection and skin preview, not verified Microsoft/Mojang sign-in. Account ownership verification can be added separately.</p>
          </section>
        </div>
      )}
    </>
  );
}
