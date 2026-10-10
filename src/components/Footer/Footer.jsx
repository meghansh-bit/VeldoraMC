import { Link } from "react-router-dom";
import { Code2, PlayCircle, X as XIcon } from "lucide-react";

function DiscordMark({ size = 18 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.73 5.14A18.4 18.4 0 0 0 15.2 3.75l-.56 1.14a16.9 16.9 0 0 0-5.27 0L8.8 3.75a18.4 18.4 0 0 0-4.53 1.39C1.4 9.38.62 13.52 1.01 17.6a18.5 18.5 0 0 0 5.55 2.8l1.2-1.95a12 12 0 0 1-1.89-.91l.46-.36c3.64 1.69 7.59 1.69 11.19 0l.47.36c-.61.36-1.24.66-1.9.91l1.2 1.95a18.4 18.4 0 0 0 5.55-2.8c.46-4.73-.79-8.83-3.11-12.46ZM8.74 14.9c-1.09 0-1.98-.99-1.98-2.2s.87-2.2 1.98-2.2c1.12 0 2 .99 1.98 2.2 0 1.21-.87 2.2-1.98 2.2Zm6.52 0c-1.09 0-1.98-.99-1.98-2.2s.87-2.2 1.98-2.2c1.12 0 2 .99 1.98 2.2 0 1.21-.86 2.2-1.98 2.2Z"/></svg>; }
import "./Footer.css";

const columns = [
  {
    heading: "Explore",
    links: [
      { label: "News", to: "/news" },
      { label: "Vote", to: "/votes" },
      { label: "Store", to: "/store" },
      { label: "Community", to: "/community" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Staff", to: "/staff" },
      { label: "Support", to: "/support" },
      { label: "Join our Discord", href: "https://discord.gg/NruxFSnrUe", external: true },
      { label: "Terms", to: "/terms" },
      { label: "Privacy", to: "/privacy" },
    ],
  },
];

const socials = [
  { icon: DiscordMark, label: "Discord", href: "https://discord.gg/NruxFSnrUe" },
  { icon: XIcon, label: "X", href: "https://x.com/" },
  { icon: PlayCircle, label: "YouTube", href: "https://youtube.com/" },
  { icon: Code2, label: "GitHub", href: "https://github.com/" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" aria-label="VeldoraMC home" className="site-footer__logo-link"><img src="/veldoramc-logo.svg" alt="VeldoraMC" className="site-footer__logo-image" /></Link>
          <p className="site-footer__tagline">Your next adventure starts here. Join the VeldoraMC community and make your mark.</p>
          <a className="site-footer__discord-cta" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer">
            <DiscordMark size={20} /> Join the Discord
          </a>
          <div className="site-footer__socials">
            {socials.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="site-footer__social">
                <Icon size={16} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.heading} className="site-footer__col">
            <h3>{col.heading}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
                  ) : (
                    <Link to={l.to}>{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="site-footer__bottom">
        <span>&copy; {new Date().getFullYear()} VeldoraMC. All rights reserved.</span>
      </div>
    </footer>
  );
}