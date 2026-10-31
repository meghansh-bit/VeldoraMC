import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, UserRound, ChevronRight } from "lucide-react";
import Logo from "./Logo";
import NavButton from "./NavButton";
import { navItems } from "./navItems";
import { useAuth } from "../../context/useAuth";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const inStore = pathname.startsWith("/store") || pathname === "/cart";
  return (
    <header className="vld-site-header">
      <div className="vld-header-inner">
        <Logo />
        <nav className="vld-main-nav" aria-label="Primary navigation">
          {navItems.map((item) => <NavButton key={item.to} {...item} />)}
        </nav>
        <div className="vld-header-actions">
          {inStore && (user ? <div className="vld-store-user"><span className="vld-store-avatar"><UserRound size={15}/></span><span>{user.email}</span><button type="button" onClick={signOut}>Sign out</button></div> : <Link className="vld-store-account" to="/store/account"><UserRound size={16}/> Store login <ChevronRight size={14}/></Link>)}
          {inStore && <Link className="vld-header-cart" to="/cart" aria-label="Open shopping cart"><ShoppingBag size={17}/><span>Cart</span></Link>}
          <button className="vld-menu-toggle" type="button" onClick={() => setOpen(v => !v)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
        </div>
      </div>
      {open && <nav className="vld-mobile-nav" aria-label="Mobile navigation">{navItems.map(item => <NavButton key={item.to} {...item} mobile onNavigate={() => setOpen(false)}/>)}{inStore && <Link className="vld-mobile-store-account" to="/store/account" onClick={() => setOpen(false)}><UserRound size={17}/> {user ? user.email : "Store login"}</Link>}</nav>}
    </header>
  );
}
