import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Sparkles } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import lifestealImage from "../assets/modes/survival.png";

function MinecraftHeart() {
  return (
    <svg className="vh-minecraft-heart" viewBox="0 0 16 15" role="img" aria-label="Minecraft heart" shapeRendering="crispEdges">
      <path fill="#321019" d="M2 1h4v1h4V1h4v1h1v4h-1v2h-1v2h-2v2H9v1H7v-1H5v-2H3V8H2V6H1V2h1z" />
      <path fill="#f52845" d="M2 2h4v2h2V2h4v1h1v3h-1v2h-2v2H8v1H7v-1H5V8H4V6H2z" />
      <path fill="#ff6675" d="M2 2h3v1h1v2H4V4H2z" />
      <path fill="#b90f2b" d="M12 5h1v2h-1v2h-2v2H8v-1h1V9h2V7h1z" />
    </svg>
  );
}

export default function Home() {
  useSeo({ title: "VeldoraMC — Lifesteal", description: "Join VeldoraMC Lifesteal. Fight, build alliances, and make your mark in the world.", path: "/" });
  return (
    <main className="veldora-home">
      <section className="vh-hero">
        <div className="vh-hero-glow" />
        <div className="vh-hero-inner">
          <div className="vh-hero-copy">
            <span className="vh-eyebrow"><span className="vh-live-dot" /> VELDORAMC LIFESTEAL</span>
            <h1>EVERY HEART<br /><span>MATTERS.</span></h1>
            <p>Fight for survival, build your alliances, and protect every heart. One battle can change everything. Are you ready to make your mark?</p>
            <div className="vh-hero-actions">
              <a className="vbtn vbtn-primary" href="#gamemodes"><Heart size={17} fill="currentColor" /> EXPLORE LIFESTEAL <ArrowRight size={15} /></a>
              <a className="vbtn vbtn-glass" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer"><Users size={17} /> JOIN COMMUNITY</a>
            </div>
            <div className="vh-hero-note"><span>LIFESTEAL SMP</span><i /> <span>BUILT FOR THE COMMUNITY</span></div>
          </div>
          <div className="vh-hero-emblem" aria-label="VeldoraMC Lifesteal emblem">
            <div className="vh-emblem-ring"><div className="vh-emblem-heart-wrap"><MinecraftHeart /></div><span>VELDORA</span><small>LIFESTEAL NETWORK</small></div>
            <Sparkles className="vh-spark vh-spark-one" size={22} /><Sparkles className="vh-spark vh-spark-two" size={15} />
          </div>
        </div>
        <a className="vh-scroll" href="#gamemodes">SCROLL TO EXPLORE <span>↓</span></a>
      </section>
      <section id="gamemodes" className="vh-modes-section vh-single-mode-section">
        <div className="vh-section-head"><div><span className="vh-section-kicker">ONE WORLD. EVERY HEART COUNTS.</span><h2>Welcome to <span>Lifesteal.</span></h2></div><p>Survive, team up, and fight your way to the top. Every heart is worth protecting.</p></div>
        <article className="vh-mode-card vh-mode-featured vh-lifesteal-card">
          <div className="vh-mode-art"><img src={lifestealImage} alt="Minecraft Lifesteal survival world" loading="eager" /><div className="vh-mode-art-shade" /><span className="vh-mode-tag">HIGH STAKES SURVIVAL</span><span className="vh-mode-icon"><MinecraftHeart /></span></div>
          <div className="vh-mode-copy"><div className="vh-mode-title-row"><h3>Lifesteal SMP</h3><span className="vh-popular">MAIN GAMEMODE</span></div><p>Fight other players, steal hearts, form alliances, and build your legacy. Every encounter can shift the balance of power — will you rise to the top?</p><a href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer" className="vh-mode-link">JOIN THE ADVENTURE <ArrowRight size={15} /></a></div>
        </article>
      </section>
      <section className="vh-community"><div className="vh-community-icon"><Users size={26} /></div><div><span className="vh-section-kicker">YOUR PEOPLE ARE HERE</span><h2>Make your next story <span>with us.</span></h2><p>Meet other players, find teammates, and keep up with VeldoraMC announcements.</p></div><a className="vbtn vbtn-primary" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer">JOIN DISCORD <ArrowRight size={15} /></a></section>
      <section className="vh-news-teaser"><div><span className="vh-section-kicker">FRESH FROM VELDORA</span><h2>Stay in the loop<span>.</span></h2><p>Check announcements, community events, and server updates.</p></div><Link to="/news" className="vbtn vbtn-glass">LATEST NEWS <ArrowRight size={15} /></Link></section>
    </main>
  );
}