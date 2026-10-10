import { NavLink } from "react-router-dom";
import { Home, Newspaper, Trophy, ShieldCheck, ShoppingBag, Headset, ChevronRight } from "lucide-react";

const NAV_ICONS = {
  Home: Home,
  News: Newspaper,
  Leaderboard: Trophy,
  Staff: ShieldCheck,
  Store: ShoppingBag,
  Support: Headset,
};

function NavItemContent({ label, badge, isActive }) {
  const Icon = NAV_ICONS[label];
  return (
    <>
      <span className={"vnav-icon-wrap flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 " + (isActive ? "border-cyan-300/30 bg-cyan-400/15 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.12)]" : "border-white/10 bg-white/[0.035] text-white/60 group-hover:border-cyan-300/20 group-hover:bg-cyan-300/10 group-hover:text-cyan-100")}>
        {Icon && <Icon className="vnav-icon h-[17px] w-[17px]" strokeWidth={1.9} aria-hidden="true" />}
      </span>
      <span className={"vnav-label transition-colors duration-200 " + (isActive ? "is-active text-cyan-100" : "text-white/75 group-hover:text-white")}>{label}</span>
      {badge && <span className="vnav-badge">{badge}</span>}
      <ChevronRight className={"ml-auto h-3.5 w-3.5 transition-all duration-200 " + (isActive ? "translate-x-0 text-cyan-200/70" : "-translate-x-1 text-white/0 group-hover:translate-x-0 group-hover:text-white/40")} aria-hidden="true" />
    </>
  );
}

const DESKTOP_BASE =
  "relative group shrink-0 flex items-center gap-2.5 whitespace-nowrap " +
  "h-14 px-3 text-[13px] font-medium transition-all duration-200 outline-none " +
  "border-b-2 border-transparent box-border " +
  "hover:bg-white/[0.035] focus-visible:ring-2 focus-visible:ring-cyan-300/50 " +
  "[&_.vnav-icon-wrap]:scale-100 hover:[&_.vnav-icon-wrap]:scale-105";

const MOBILE_BASE =
  "vnav-mobile-row group flex w-full items-center gap-3 whitespace-nowrap " +
  "px-4 py-3 text-[14px] transition-all outline-none border-b border-white/[0.045] " +
  "hover:bg-white/[0.035]";

export default function NavButton({ to, label, end, badge, mobile, onNavigate }) {
  if (mobile) {
    return (
      <NavLink onClick={onNavigate} to={to} end={end} className={({ isActive }) => MOBILE_BASE + (isActive ? " bg-cyan-400/[0.07] text-white" : " text-white/80")}>
        {({ isActive }) => <NavItemContent label={label} badge={badge} isActive={isActive} />}
      </NavLink>
    );
  }

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => DESKTOP_BASE + (isActive ? " border-b-cyan-300 bg-cyan-300/[0.055] text-white" : " text-white/80")}
    >
      {({ isActive }) => <NavItemContent label={label} badge={badge} isActive={isActive} />}
    </NavLink>
  );
}
