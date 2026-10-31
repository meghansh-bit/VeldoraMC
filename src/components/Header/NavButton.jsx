import { NavLink } from "react-router-dom";
import { Home, Newspaper, Gamepad2, ShieldCheck, ShoppingBag, Headset } from "lucide-react";

const ICONS = {
  Home,
  Announcements: Newspaper,
  Gamemodes: Gamepad2,
  Staff: ShieldCheck,
  Store: ShoppingBag,
  Support: Headset,
};

export default function NavButton({ to, label, end, mobile, onNavigate }) {
  const Icon = ICONS[label] || Home;
  return <NavLink to={to} end={end} onClick={onNavigate} className={({isActive}) => "vld-nav-link" + (mobile ? " vld-nav-link-mobile" : "") + (isActive ? " is-active" : "")}>
    <Icon size={mobile ? 17 : 15} strokeWidth={1.9}/><span>{label}</span>
  </NavLink>;
}