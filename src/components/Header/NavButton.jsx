import { NavLink } from "react-router-dom";
import newsIcon from "../../assets/reasons/events.png";
import leaderboardIcon from "../../assets/votes/crown.png";
import staffIcon from "../../assets/reasons/moderation.png";
import storeIcon from "../../assets/votes/key.png";
import supportIcon from "../../assets/reasons/community.png";
import homeIcon from "../../assets/modes/survival.png";

const NAV_ICONS = {
  Home: homeIcon,
  News: newsIcon,
  Leaderboard: leaderboardIcon,
  Staff: staffIcon,
  Store: storeIcon,
  Support: supportIcon,
};

function NavItemContent({ label, badge, isActive }) {
  const icon = NAV_ICONS[label];
  return (
    <>
      <span className="vnav-icon-wrap">
        {icon && <img className="vnav-icon" src={icon} alt="" />}
      </span>
      <span className={"vnav-label " + (isActive ? "is-active" : "")}>{label}</span>
      {badge && <span className="vnav-badge">{badge}</span>}
      <span className="vnav-chevron" aria-hidden="true">›</span>
    </>
  );
}

const DESKTOP_BASE =
  "relative shrink-0 flex items-center justify-center whitespace-nowrap " +
  "h-14 px-[18px] text-[14px] transition-transform active:translate-y-px outline-none " +
  "box-border border-[6px] border-solid border-transparent [image-rendering:pixelated] " +
  "[border-image-repeat:stretch] [border-image-width:21px] [border-image-slice:20_fill] " +
  "[border-image-source:var(--btn-bg-default)] hover:[border-image-source:var(--btn-bg-default-hover)] " +
  "focus-visible:[border-image-source:var(--btn-bg-primary-focus)]";

const MOBILE_BASE =
  "vnav-mobile-row group flex w-full items-center gap-3 whitespace-nowrap " +
  "px-4 py-3.5 text-[15px] transition-all outline-none";

export default function NavButton({ to, label, end, badge, mobile, onNavigate }) {
  if (mobile) {
    return (
      <NavLink onClick={onNavigate} to={to} end={end} className={MOBILE_BASE}>
        {({ isActive }) => <NavItemContent label={label} badge={badge} isActive={isActive} />}
      </NavLink>
    );
  }

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        DESKTOP_BASE +
        " group " +
        (isActive
          ? "[border-image-source:var(--btn-bg-primary-active)] hover:[border-image-source:var(--btn-bg-primary-active)]"
          : "")
      }
    >
      {({ isActive }) => <NavItemContent label={label} badge={badge} isActive={isActive} />}
    </NavLink>
  );
}
