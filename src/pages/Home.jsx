
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Swords, Trophy, Users, ShieldCheck, ShoppingBag, MessageCircle, Sparkles, Copy, Check, CircleDot } from "lucide-react";
import { useState } from "react";
import { useSeo } from "../hooks/useSeo";

const sections = [
  { icon: Swords, title: "Lifesteal, your way", text: "Every fight matters. Build alliances, outplay rivals, and make your name feared across the world." },
  { icon: Trophy, title: "Rise through the ranks", text: "Compete for the top spots and leave your mark on the VeldoraMC leaderboard." },
  { icon: Users, title: "Your people. Your story.", text: "Find teammates, join community events, and turn new faces into trusted allies." },
];
const shortcuts = [
  { to: "/profiles", icon: Users, title: "Player profiles", desc: "Your stats, your legacy" },
  { to: "/leaderboard", icon: Trophy, title: "Leaderboards", desc: "See who rules the realm" },
  { to: "/community", icon: MessageCircle, title: "Community", desc: "Find your next teammate" },
  { to: "/support", icon: ShieldCheck, title: "Support centre", desc: "We’re here to help" },
];
export default function Home() {
  useSeo({ title: "VeldoraMC — Lifesteal", description: "Enter VeldoraMC, a next-generation Minecraft Lifesteal community. Server launch coming soon.", path: "/" });
  const [copied, setCopied] = useState(false);
  const copyIp = async () => {
    try { await navigator.clipboard.writeText("IP COMING SOON"); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
  };
  return <div className="vel-home">
    <section className="vel-hero" id="top">
      <div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
      <div className="hero-grid"/>
      <div className="hero-content">
        <div className="eyebrow"><span className="live-dot"/> A NEW REALM IS RISING <span className="eyebrow-line"/></div>
        <div className="brand-mark"><span>V</span><i>MC</i></div>
        <h1>CLAIM YOUR <span>LEGACY.</span></h1>
        <p className="hero-sub">Every heart has a story. Every alliance has a cost.<br className="desktop-break"/> Welcome to <b>VeldoraMC</b> — where only the bold survive.</p>
        <div className="hero-actions">
          <button className="vbtn vbtn-primary" onClick={copyIp}>{copied ? <Check size={17}/> : <Copy size={17}/>} {copied ? "COPIED" : "IP COMING SOON"}</button>
          <Link className="vbtn vbtn-glass" to="/community"><MessageCircle size={17}/> JOIN COMMUNITY <ArrowRight size={15}/></Link>
        </div>
        <div className="hero-footnote"><CircleDot size={13}/> SERVER NOT LAUNCHED YET <span/> JAVA / BEDROCK DETAILS COMING SOON</div>
      </div>
      <a className="scroll-cue" href="#realm"><span>SCROLL TO EXPLORE</span><ArrowDown size={16}/></a>
      <div className="hero-side-label">SURVIVE · STEAL · CONQUER</div>
    </section>
    <section className="launch-strip"><div className="launch-pulse"/><div><small>THE NEXT CHAPTER</small><strong>VeldoraMC is preparing to open its gates.</strong></div><span className="launch-tag">LAUNCHING SOON</span></section>
    <section className="vel-section" id="realm">
      <div className="section-kicker">01 / THE EXPERIENCE</div><div className="section-heading"><div><h2>NOT JUST A SERVER.<br/><span>A WHOLE NEW REALM.</span></h2></div><p>Fight for hearts. Protect your loot. Trust carefully. VeldoraMC is being built for players who want their choices to matter.</p></div>
      <div className="feature-grid">{sections.map((x,i)=><article className="feature-card" key={x.title}><div className="feature-top"><span>0{i+1}</span><x.icon size={23}/></div><h3>{x.title}</h3><p>{x.text}</p><div className="card-arrow"><ArrowRight size={18}/></div></article>)}</div>
    </section>
    <section className="vel-section shortcut-section"><div className="section-kicker">02 / YOUR VELDORA</div><div className="section-heading"><h2>YOUR JOURNEY<br/><span>STARTS HERE.</span></h2><p>These pages are ready for future in-game data, stats, and community integrations.</p></div>
      <div className="shortcut-grid">{shortcuts.map((x,i)=><Link to={x.to} className="shortcut-card" key={x.to}><div className="shortcut-icon"><x.icon size={22}/></div><div><h3>{x.title}</h3><p>{x.desc}</p></div><ArrowRight className="shortcut-arrow" size={18}/></Link>)}</div>
    </section>
    <section className="community-cta" id="community"><div className="cta-symbol"><Sparkles size={30}/></div><div><div className="section-kicker">03 / STAY IN THE LOOP</div><h2>THE GATES OPEN SOON.</h2><p>Be part of the first wave. Discord invite and launch announcements will be connected here.</p></div><Link to="/community" className="vbtn vbtn-primary">JOIN THE COMMUNITY <ArrowRight size={16}/></Link></section>
  </div>;
}
