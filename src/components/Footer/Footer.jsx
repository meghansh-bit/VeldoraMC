import { Link } from "react-router-dom";
import { Code2, MessageCircle, PlayCircle, X as XIcon } from "lucide-react";
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
  { icon: MessageCircle, label: "Discord", href: "https://discord.gg/NruxFSnrUe" },
  { icon: XIcon, label: "X", href: "https://x.com/" },
  { icon: PlayCircle, label: "YouTube", href: "https://youtube.com/" },
  { icon: Code2, label: "GitHub", href: "https://github.com/" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__logo">VELDORA <span>MC</span></span>
          <p className="site-footer__tagline">Your next adventure starts here. Join the VeldoraMC community and make your mark.</p>
          <a className="site-footer__discord-cta" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer">
            <MessageCircle size={16} /> Join the Discord
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