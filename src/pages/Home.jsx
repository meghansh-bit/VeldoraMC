import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, Check, Copy, Crown, Heart, Shield, Swords, Users, Zap, Gamepad2, MessageCircle, Sparkles } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import lifestealImage from "../assets/hero/rear.png";

const SERVER_IP = "veldoramc.mc-dns.net";
const DISCORD_URL = "https://discord.gg/NruxFSnrUe";

function HeartMark({ className = "" }) {
  return <svg className={className} viewBox="0 0 16 15" role="img" aria-label="Veldora heart emblem" shapeRendering="crispEdges">
    <path fill="#310813" d="M1 2h2V1h4v1h2V1h4v1h2v5h-1v2h-2v2H9v2H7v-1H5v-2H3V8H2V6H1z"/>
    <path fill="#f32645" d="M2 2h4v2h2V2h4v1h1v4h-1v2h-2v2H8v1H7v-1H5V9H4V7H3V5H2z"/>
    <path fill="#ff8791" d="M2 2h3v1h1v2H4V4H2z"/>
  </svg>;
}

function DiscordIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.73 5.14A18.4 18.4 0 0 0 15.2 3.75l-.56 1.14a16.9 16.9 0 0 0-5.27 0L8.8 3.75a18.4 18.4 0 0 0-4.53 1.39C1.4 9.38.62 13.52 1.01 17.6a18.5 18.5 0 0 0 5.55 2.8l1.2-1.95a12 12 0 0 1-1.89-.91l.46-.36c3.64 1.69 7.59 1.69 11.19 0l.47.36c-.61.36-1.24.66-1.9.91l1.2 1.95a18.4 18.4 0 0 0 5.55-2.8c.46-4.73-.79-8.83-3.11-12.46ZM8.74 14.9c-1.09 0-1.98-.99-1.98-2.2s.87-2.2 1.98-2.2c1.12 0 2 .99 1.98 2.2 0 1.21-.87 2.2-1.98 2.2Zm6.52 0c-1.09 0-1.98-.99-1.98-2.2s.87-2.2 1.98-2.2c1.12 0 2 .99 1.98 2.2 0 1.21-.86 2.2-1.98 2.2Z"/></svg>;
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  useSeo({ title: "VeldoraMC — Enter the Lifesteal Realm", description: "Enter VeldoraMC, a Minecraft Lifesteal realm. Build your base, forge alliances, and fight for every heart. Join the community.", path: "/", image: "https://veldoramc.vercel.app/og-image.png" });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight * 1.2);
        document.documentElement.style.setProperty("--vld-scroll", y + "px");
        frame = 0;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      if (frame) window.cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty("--vld-scroll");
    };
  }, []);

  async function copyIp() {
    try {
      await navigator.clipboard.writeText(SERVER_IP);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { setCopied(false); }
  }

  return <main className="vld-home" id="top">
    <section className="vld-hero" aria-labelledby="vld-hero-title">
      <div className="vld-scene" aria-hidden="true">
        <div className="vld-scene-image" style={{ backgroundImage: "url(" + lifestealImage + ")" }} />
        <div className="vld-scene-shade" /><div className="vld-scene-glow vld-glow-one" /><div className="vld-scene-glow vld-glow-two" /><div className="vld-scene-grid" /><div className="vld-scene-grain" />
      </div>
      <div className="vld-hero-content">
        <a className="vld-brand" href="#top" aria-label="VeldoraMC home"><span className="vld-brand-mark"><HeartMark /></span><span className="vld-brand-name">VELDORA<span>MC</span></span></a>
        <div className="vld-kicker"><i /> THE LIFESTEAL REALM <b>·</b> MINECRAFT</div>
        <h1 id="vld-hero-title">EVERY HEART<br/><span>HAS A PRICE.</span></h1>
        <p className="vld-hero-copy">Build your sanctuary. Choose your allies. Defend what matters. In VeldoraMC, every heart tells a story — and yours is waiting to be written.</p>
        <div className="vld-hero-actions"><a className="vld-button vld-button-primary" href="#join">Enter the realm <ArrowRight size={17}/></a><a className="vld-button vld-button-glass" href={DISCORD_URL} target="_blank" rel="noreferrer"><DiscordIcon/> Join Discord</a></div>
        <div className="vld-hero-meta"><span><Heart size={13}/> LIFESTEAL SURVIVAL</span><i/><span><Gamepad2 size={14}/> MINECRAFT SERVER</span><i/><span>JAVA EDITION</span></div>
      </div>
      <a className="vld-scroll-cue" href="#realm"><span>DISCOVER THE REALM</span><ArrowDown size={15}/></a><div className="vld-hero-index">01 <span>/</span> 04</div>
    </section>

    <section className="vld-intro vld-section" id="realm">
      <div className="vld-intro-art" aria-hidden="true"><div className="vld-art-ring vld-ring-a"/><div className="vld-art-ring vld-ring-b"/><div className="vld-art-heart"><HeartMark/></div><span className="vld-art-caption">ONE HEART. ONE LIFE. ONE LEGACY.</span></div>
      <div className="vld-intro-copy"><div className="vld-overline">WELCOME TO VELDORAMC <span>— 001</span></div><h2>A realm where<br/><em>every heart counts.</em></h2><p>VeldoraMC is a Lifesteal survival world built around high-stakes encounters, clever bases, shifting alliances, and the stories players create together.</p><p>Grow stronger, protect your hearts, and make your name mean something.</p><a className="vld-text-link" href="#how-it-works">Discover how it works <ArrowRight size={16}/></a></div>
    </section>

    <section className="vld-world vld-section" id="how-it-works">
      <div className="vld-section-heading"><div><div className="vld-overline">THE WORLD IS YOURS <span>— 002</span></div><h2>Make every<br/><em>move matter.</em></h2></div><p>Survival is only the beginning. Your decisions shape the alliances you make, the territory you claim, and the legacy you leave behind.</p></div>
      <div className="vld-feature-grid">
        <article className="vld-feature vld-feature-large"><div className="vld-feature-top"><span>01 / SURVIVE</span><Heart size={21}/></div><div className="vld-feature-bottom"><h3>Protect your hearts.</h3><p>Every encounter matters. Stay prepared, stay alert, and never take your last heart for granted.</p></div><div className="vld-feature-watermark">♥</div></article>
        <article className="vld-feature"><div className="vld-feature-top"><span>02 / BUILD</span><Shield size={21}/></div><div className="vld-feature-bottom"><h3>Build your stronghold.</h3><p>Create a base worth defending and a home worth returning to.</p></div><div className="vld-feature-watermark">⌂</div></article>
        <article className="vld-feature"><div className="vld-feature-top"><span>03 / CONQUER</span><Swords size={21}/></div><div className="vld-feature-bottom"><h3>Choose your battles.</h3><p>Make alliances, face rivals, and fight for your place in the realm.</p></div><div className="vld-feature-watermark">⚔</div></article>
      </div>
    </section>

    <section className="vld-about vld-section" id="about"><div className="vld-about-panel"><div className="vld-about-image" style={{ backgroundImage: "url(" + lifestealImage + ")" }} aria-hidden="true"/><div className="vld-about-copy"><div className="vld-overline">MORE THAN A SERVER <span>— 003</span></div><h2>Find your people.<br/><em>Write your story.</em></h2><p>From unexpected friendships to unforgettable rivalries, the best parts of a multiplayer world happen together. Meet other players, find a team, and help shape the VeldoraMC community.</p><div className="vld-about-points"><span><Users size={17}/> Community-led</span><span><Zap size={17}/> Always evolving</span><span><Crown size={17}/> Your legacy</span></div></div></div></section>

    <section className="vld-join vld-section" id="join"><div className="vld-join-orbit" aria-hidden="true"><div/><div/><div/></div><div className="vld-overline">YOUR NEXT CHAPTER STARTS HERE <span>— 004</span></div><h2>Claim your<br/><em>place in the realm.</em></h2><p>Copy the server address, launch Minecraft Java Edition, and join the adventure.</p><div className="vld-ip-card"><div className="vld-ip-label"><span className="vld-live-dot"/> SERVER ADDRESS</div><code>{SERVER_IP}</code><button type="button" onClick={copyIp} className="vld-copy-button" aria-label="Copy server address">{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "COPIED" : "COPY IP"}</button></div><div className="vld-join-actions"><a className="vld-button vld-button-primary" href={DISCORD_URL} target="_blank" rel="noreferrer"><DiscordIcon/> Join the community <ArrowRight size={16}/></a><a className="vld-button vld-button-glass" href="#top"><Sparkles size={16}/> Back to top</a></div><div className="vld-edition-note">MINECRAFT JAVA EDITION <span>·</span> SERVER ADDRESS ABOVE</div></section>

    <footer className="vld-footer"><a className="vld-brand" href="#top"><span className="vld-brand-mark"><HeartMark/></span><span className="vld-brand-name">VELDORA<span>MC</span></span></a><p>Built for the stories we make together.</p><div className="vld-footer-links"><a href={DISCORD_URL} target="_blank" rel="noreferrer"><MessageCircle size={15}/> Discord</a><a href="#join">Join the server <ArrowRight size={14}/></a></div><small>© {new Date().getFullYear()} VeldoraMC. Minecraft is a trademark of Mojang Studios. VeldoraMC is not affiliated with Mojang or Microsoft.</small></footer>
  </main>;
}
