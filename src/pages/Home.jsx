import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Heart, Users, ShieldCheck, Clock3, FlaskConical, BarChart3, ExternalLink, Signal, Gamepad2 } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import lifestealImage from "../assets/hero/rear.png";
function DiscordMark({ size = 19 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.73 5.14A18.4 18.4 0 0 0 15.2 3.75l-.56 1.14a16.9 16.9 0 0 0-5.27 0L8.8 3.75a18.4 18.4 0 0 0-4.53 1.39C1.4 9.38.62 13.52 1.01 17.6a18.5 18.5 0 0 0 5.55 2.8l1.2-1.95a12 12 0 0 1-1.89-.91l.46-.36c3.64 1.69 7.59 1.69 11.19 0l.47.36c-.61.36-1.24.66-1.9.91l1.2 1.95a18.4 18.4 0 0 0 5.55-2.8c.46-4.73-.79-8.83-3.11-12.46ZM8.74 14.9c-1.09 0-1.98-.99-1.98-2.2s.87-2.2 1.98-2.2c1.12 0 2 .99 1.98 2.2 0 1.21-.87 2.2-1.98 2.2Zm6.52 0c-1.09 0-1.98-.99-1.98-2.2s.87-2.2 1.98-2.2c1.12 0 2 .99 1.98 2.2 0 1.21-.86 2.2-1.98 2.2Z"/></svg>; }
function MinecraftHeart({ className = "" }) {
  return <svg className={`vh-minecraft-heart ${className}`} viewBox="0 0 16 15" aria-label="Minecraft heart" role="img" shapeRendering="crispEdges"><path fill="#360c18" d="M1 2h2V1h4v1h2V1h4v1h2v5h-1v2h-2v2H9v2H7v-1H5v-2H3V8H2V6H1z"/><path fill="#f32645" d="M2 2h4v2h2V2h4v1h1v4h-1v2h-2v2H8v1H7v-1H5V9H4V7H3V5H2z"/><path fill="#ff7784" d="M2 2h3v1h1v2H4V4H2z"/><path fill="#b50f2c" d="M12 5h1v2h-1v2h-2v2H8v-1h1V9h2V7h1z"/></svg>;
}
const values = [
  { icon: Users, title: "Community First", body: "A place to make friends, find teammates, and build stories together." },
  { icon: FlaskConical, title: "Always Evolving", body: "We keep improving the experience and listen to feedback from players." },
  { icon: BarChart3, title: "Fair Play", body: "A competitive world where your choices, skill, and teamwork matter." },
  { icon: ExternalLink, title: "Player Focused", body: "Clear updates, helpful support, and a community that keeps growing." },
];
const trust = [
  { icon: Users, title: "Community Driven", body: "Players help shape the world and its future." },
  { icon: ShieldCheck, title: "Respectful Community", body: "We aim to keep the server welcoming and enjoyable." },
  { icon: Clock3, title: "Events & Updates", body: "Keep an eye out for new challenges and announcements." },
  { icon: Heart, title: "Lifesteal Action", body: "Every heart counts. Every encounter tells a story." },
];
export default function Home() {
  useSeo({ title: "VeldoraMC — Lifesteal Minecraft Server", description: "Join VeldoraMC Lifesteal SMP. Battle rivals, build alliances, and make your mark.", path: "/" });
  return <main className="veldora-home vh-inpvp-home">
    <section className="vhi-hero">
      <div className="vhi-hero-bg" style={{ backgroundImage: `linear-gradient(90deg,rgba(7,7,20,.94),rgba(7,7,20,.52) 52%,rgba(7,7,20,.7)),url(${lifestealImage})` }} />
      <div className="vhi-hero-inner">
        <div className="vhi-wordmark"><span className="vhi-mark"><MinecraftHeart /></span><span>VELDORA<span className="vhi-wordmark-accent">MC</span></span></div>
        <span className="vhi-eyebrow"><span className="vhi-pulse" /> MINECRAFT LIFESTEAL SERVER</span>
        <h1>YOUR NEXT<br/><span>BIG ADVENTURE.</span></h1>
        <p className="vhi-lead">Fight for every heart. Build your legacy. Make allies, challenge rivals, and carve your own story in VeldoraMC Lifesteal.</p>
        <div className="vhi-stats"><div><strong>LIFESTEAL</strong><span>ONE MAIN GAMEMODE</span></div><div><strong>JAVA + BEDROCK*</strong><span>PLAYER COMMUNITY</span></div></div>
        <div className="vhi-platforms" aria-label="Minecraft platform compatibility"><span>▰</span><span>▦</span><span>◉</span><span>▯</span></div>
        <div className="vhi-hero-actions"><a href="#projects" className="vhi-btn vhi-btn-green"><Gamepad2 size={18}/> Explore Lifesteal <ArrowDown size={16}/></a><a href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer" className="vhi-btn vhi-btn-ghost"><DiscordMark size={20}/> Join Community</a></div>
      </div>
      <div className="vhi-hero-bottom"><span><Signal size={15}/> YOUR NEXT WORLD IS WAITING</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>
    <section id="projects" className="vhi-projects">
      <div className="vhi-section-title"><span>THE VELDORAMC EXPERIENCE</span><h2>Pick Your <em>Adventure</em></h2><p>One world, one community, endless ways to make your mark.</p></div>
      <article className="vhi-project-card">
        <div className="vhi-project-art" style={{ backgroundImage: `linear-gradient(90deg,rgba(21,8,20,.8),rgba(8,10,23,.38)),url(${lifestealImage})` }}>
          <div className="vhi-project-brand"><div className="vhi-project-heart"><MinecraftHeart/></div><strong>VELDORA<br/><b>LIFESTEAL</b></strong><small>EST. 2026</small></div>
          <span className="vhi-project-badge">MAIN GAMEMODE</span><div className="vhi-online"><Signal size={16}/> Lifesteal SMP <span>Explore now</span></div>
        </div>
        <div className="vhi-project-info"><h3>Lifesteal Survival Multiplayer</h3><p>Venture into a world where hearts are everything. Battle other players, steal hearts, build hidden bases, and form alliances. Trust carefully — every fight can change your future.</p><div className="vhi-project-footer"><a className="vhi-btn vhi-btn-green" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer"><DiscordMark size={20}/> Join Discord</a><a className="vhi-arrow-btn" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer" aria-label="Discover Lifesteal"><ArrowRight size={22}/></a></div></div>
      </article>
    </section>
    <section className="vhi-values"><div className="vhi-section-title"><span>WHAT WE STAND FOR</span><h2>Our <em>Values</em></h2></div><div className="vhi-values-grid">{values.map(({icon:Icon,title,body})=><article className="vhi-value-card" key={title}><Icon size={27}/><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    <section className="vhi-about"><div className="vhi-about-copy"><span className="vhi-section-kicker">BUILT AROUND THE PLAYERS</span><h2>A world worth<br/>coming back to.</h2><p>VeldoraMC is about more than winning fights. It’s about the rivalries, friendships, surprise alliances, and moments that become stories you tell later.</p><p>Jump in, find your people, and help shape the community one block at a time.</p></div><div className="vhi-trust-grid">{trust.map(({icon:Icon,title,body})=><article className="vhi-trust-card" key={title}><Icon size={25}/><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    <section className="vhi-final-cta"><div className="vhi-final-heart"><MinecraftHeart/></div><div><span>YOUR STORY STARTS HERE</span><h2>Ready to enter <em>Veldora?</em></h2><p>Meet the community and get ready for Lifesteal.</p></div><a className="vhi-btn vhi-btn-discord" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer"><DiscordMark size={21}/> Join the Community <ArrowRight size={17}/></a></section>
    <section className="vh-news-teaser"><div><span className="vh-section-kicker">FRESH FROM VELDORA</span><h2>Stay in the loop<span>.</span></h2><p>Check announcements, community events, and server updates.</p></div><Link to="/news" className="vbtn vbtn-glass">LATEST NEWS <ArrowRight size={15}/></Link></section>
  </main>;
}
