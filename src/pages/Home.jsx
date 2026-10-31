import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ArrowDown, ArrowRight, Check, Copy, Crown, Heart, Shield, Users, Zap, Gamepad2, MessageCircle, Sparkles, CalendarDays, Newspaper } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import lifestealImage from "../assets/hero/rear.png";
import VeldoraScene from "../components/scene/VeldoraScene";
import NetworkStatus from "../components/NetworkStatus";
import { motion } from "framer-motion";

const SERVER_IP = "play.veldoramc.net";
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
  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => { let active = true; supabase.from("news_posts").select("slug,title,excerpt,category,created_at").eq("published", true).order("created_at", { ascending: false }).limit(3).then(({ data }) => { if (active && data) setAnnouncements(data); }); return () => { active = false; }; }, []);
  useSeo({ title: "VeldoraMC — Explore the Gamemodes", description: "Explore VeldoraMC Minecraft gamemodes, meet the community, and find your next adventure.", path: "/", image: "https://veldoramc.vercel.app/og-image.svg" });

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
        <VeldoraScene />
        <div className="vld-scene-shade" /><div className="vld-scene-glow vld-glow-one" /><div className="vld-scene-glow vld-glow-two" /><div className="vld-scene-grid" /><div className="vld-scene-grain" />
      </div>
      <div className="vld-hero-content">
        <a className="vld-brand" href="#top" aria-label="VeldoraMC home"><span className="vld-brand-mark"><HeartMark /></span><span className="vld-brand-name">VELDORA<span>MC</span></span></a>
        <div className="vld-kicker"><i /> THE VELDORAMC NETWORK <b>·</b> MINECRAFT</div>
        <h1 id="vld-hero-title">YOUR NEXT<br/><span>ADVENTURE STARTS HERE.</span></h1>
        <p className="vld-hero-copy">Discover a world of custom experiences, find your people, and choose the gamemode that fits your style. Your next adventure starts here.</p>
        <div className="vld-hero-actions"><a className="vld-button vld-button-primary" href="#join">Enter the realm <ArrowRight size={17}/></a><a className="vld-button vld-button-glass" href={DISCORD_URL} target="_blank" rel="noreferrer"><DiscordIcon/> Join Discord</a></div>
        <div className="vld-hero-meta"><span><Gamepad2 size={13}/> MINECRAFT GAMEMODES</span><i/><span><Gamepad2 size={14}/> MINECRAFT SERVER</span><i/><span>JAVA EDITION</span></div>
      </div>
      <a className="vld-scroll-cue" href="#realm"><span>EXPLORE GAMEMODES</span><ArrowDown size={15}/></a><div className="vld-hero-index">01 <span>/</span> 04</div>
    </section>

    <section className="vld-announcements vld-section" id="announcements"><div className="vld-announcement-heading"><div><div className="vld-overline">FROM THE REALM <span>— LATEST UPDATES</span></div><h2>Word travels<br/><em>through the realm.</em></h2></div><Link className="vld-text-link" to="/news">All announcements <ArrowRight size={16}/></Link></div>{announcements.length ? <div className="vld-announcement-grid">{announcements.map((post) => <article className="vld-announcement-card" key={post.slug}><div className="vld-announcement-meta"><span><Newspaper size={13}/>{post.category || "UPDATE"}</span><time><CalendarDays size={13}/>{new Date(post.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</time></div><h3>{post.title}</h3><p>{post.excerpt}</p><Link to={"/news/"+post.slug}>Read update <ArrowRight size={14}/></Link></article>)}</div> : <div className="vld-announcements-empty"><span className="vld-announcement-pulse"/><div><b>Nothing new has been posted just yet.</b><p>Official VeldoraMC updates will appear here as soon as they are published.</p></div><Link to="/news">Visit announcements <ArrowRight size={14}/></Link></div>}</section>

    <section className="vld-gamemodes vld-section" id="gamemodes">
      <div className="vld-section-heading"><div><div className="vld-overline">CHOOSE YOUR ADVENTURE <span>— EXPLORE</span></div><h2>Explore our<br/><em>gamemodes.</em></h2></div><p>Find your next way to play on VeldoraMC. Start with our featured experience and discover what makes the network yours.</p></div>
      <motion.div className="vld-gamemode-motion" whileHover={{ y: -5, rotateX: 1, rotateY: -1 }} transition={{ type: "spring", stiffness: 220, damping: 22 }}><Link to="/gamemodes" className="vld-gamemode-card"><div className="vld-gamemode-art"><img src={lifestealImage} alt="Minecraft Lifesteal world"/><span className="vld-gamemode-status"><i/> FEATURED GAMEMODE</span><span className="vld-gamemode-number">01</span></div><div className="vld-gamemode-copy"><div className="vld-edition-badges"><span>JAVA</span><span>BEDROCK</span><span>SEASON 1</span><NetworkStatus compact /></div><span className="vld-overline">SURVIVAL • COMPETITIVE • COMMUNITY</span><h3>Lifesteal</h3><p>Build your base, team up with friends, explore the world, and grow your hearts through the featured VeldoraMC survival experience.</p><span className="vld-gamemode-link">Explore Lifesteal <ArrowRight size={16}/></span></div></Link></motion.div>
      <div className="vld-gamemode-note"><Sparkles size={15}/> More gamemodes and experiences will be revealed as the network grows.</div>
    </section>

    <section className="vld-intro vld-section" id="realm">
      <div className="vld-intro-art" aria-hidden="true"><div className="vld-art-ring vld-ring-a"/><div className="vld-art-ring vld-ring-b"/><div className="vld-art-heart"><HeartMark/></div><span className="vld-art-caption">ONE HEART. ONE LIFE. ONE LEGACY.</span></div>
      <div className="vld-intro-copy"><div className="vld-overline">WELCOME TO VELDORAMC <span>— 001</span></div><h2>A network where<br/><em>every story begins.</em></h2><p>VeldoraMC brings players together through memorable Minecraft experiences, an active community, and a world that keeps growing.</p><p>Explore our gamemodes, meet your next teammates, and make your mark on the network.</p><a className="vld-text-link" href="#how-it-works">Discover how it works <ArrowRight size={16}/></a></div>
    </section>

    <section className="vld-world vld-section" id="how-it-works">
      <div className="vld-section-heading"><div><div className="vld-overline">YOUR NEXT ADVENTURE <span>— 002</span></div><h2>Make every<br/><em>move matter.</em></h2></div><p>Every gamemode brings a different way to play. Pick your path, bring your friends, and make the experience your own.</p></div>
      <div className="vld-feature-grid">
        <article className="vld-feature vld-feature-large"><div className="vld-feature-top"><span>01 / SURVIVE</span><Heart size={21}/></div><div className="vld-feature-bottom"><h3>Find your next challenge.</h3><p>Discover a new way to play, take on fresh challenges, and enjoy the journey with your friends.</p></div><div className="vld-feature-watermark">♥</div></article>
        <article className="vld-feature"><div className="vld-feature-top"><span>02 / BUILD</span><Shield size={21}/></div><div className="vld-feature-bottom"><h3>Create your world.</h3><p>Build, explore, and make a place that feels like yours.</p></div><div className="vld-feature-watermark">⌂</div></article>
        <article className="vld-feature"><div className="vld-feature-top"><span>03 / CONQUER</span><Zap size={21}/></div><div className="vld-feature-bottom"><h3>Play together.</h3><p>Meet new players, team up with friends, and shape the community.</p></div><div className="vld-feature-watermark">⚔</div></article>
      </div>
    </section>

    <section className="vld-about vld-section" id="about"><div className="vld-about-panel"><div className="vld-about-image" style={{ backgroundImage: "url(" + lifestealImage + ")" }} aria-hidden="true"/><div className="vld-about-copy"><div className="vld-overline">MORE THAN A SERVER <span>— 003</span></div><h2>Find your people.<br/><em>Write your story.</em></h2><p>From first-time joins to long-running squads, the best parts of Minecraft happen together. Meet other players, find a team, and help shape VeldoraMC.</p><div className="vld-about-points"><span><Users size={17}/> Community-led</span><span><Zap size={17}/> Always evolving</span><span><Crown size={17}/> Your legacy</span></div></div></div></section>

    <section className="vld-join vld-section" id="join"><div className="vld-join-orbit" aria-hidden="true"><div/><div/><div/></div><div className="vld-overline">YOUR NEXT CHAPTER STARTS HERE <span>— 004</span></div><h2>Claim your<br/><em>place in the realm.</em></h2><p>Copy the server address, launch Minecraft Java Edition, and join the adventure.</p><div className="vld-ip-card"><div className="vld-ip-label"><span className="vld-live-dot"/> SERVER ADDRESS</div><code>{SERVER_IP}</code><button type="button" onClick={copyIp} className="vld-copy-button" aria-label="Copy server address">{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "COPIED" : "COPY IP"}</button></div><div className="vld-join-actions"><a className="vld-button vld-button-primary" href={DISCORD_URL} target="_blank" rel="noreferrer"><DiscordIcon/> Join the community <ArrowRight size={16}/></a><a className="vld-button vld-button-glass" href="#top"><Sparkles size={16}/> Back to top</a></div><div className="vld-edition-note">MINECRAFT JAVA EDITION <span>·</span> SERVER ADDRESS ABOVE</div></section>

    <footer className="vld-footer"><a className="vld-brand" href="#top"><span className="vld-brand-mark"><HeartMark/></span><span className="vld-brand-name">VELDORA<span>MC</span></span></a><p>Built for the stories we make together.</p><div className="vld-footer-links"><a href={DISCORD_URL} target="_blank" rel="noreferrer"><MessageCircle size={15}/> Discord</a><a href="#join">Join the server <ArrowRight size={14}/></a></div><small>© {new Date().getFullYear()} VeldoraMC. Minecraft is a trademark of Mojang Studios. VeldoraMC is not affiliated with Mojang or Microsoft.</small></footer>
  </main>;
}
