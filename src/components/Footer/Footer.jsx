import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" aria-label="VeldoraMC home" className="site-footer__logo-link"><img src="/veldoramc-logo.svg" alt="VeldoraMC" className="site-footer__logo-image" /></Link>
          <p className="site-footer__tagline">Every heart has a story. Make yours in VeldoraMC.</p>
          <a className="site-footer__discord-cta" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer"><MessageCircle size={19}/> Join the Discord</a>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} VeldoraMC. All rights reserved.</span>
        <span>Minecraft is a trademark of Mojang Studios. VeldoraMC is not affiliated with Mojang or Microsoft.</span>
      </div>
    </footer>
  );
}
