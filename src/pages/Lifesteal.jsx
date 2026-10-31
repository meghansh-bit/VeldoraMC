import { useState } from "react";
import { ArrowLeft, ArrowRight, Heart, Swords, Shield, Gem, Users, Pickaxe, Crosshair, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSeo } from "../hooks/useSeo";
import lifestealImage from "../assets/hero/rear.png";
import survivalCard from "../assets/modes/survival.png";
import pvpCard from "../assets/modes/bedwars.png";
import minigamesCard from "../assets/modes/minigames.png";
import skyblockCard from "../assets/modes/skyblock.png";
import teamCard from "../assets/reasons/community.png";
import customCard from "../assets/reasons/custom-features.png";
import launchCard from "../assets/reasons/events.png";
import "./Lifesteal.css";

const inpvpImages = {
  base: survivalCard,
  hearts: customCard,
  crystal: pvpCard,
};

const features = [
  { icon: Gem, number: "01", title: "Crystal PvP", tag: "HIGH-SKILL COMBAT", body: "Master crystal placement, timing, and movement. Every fight rewards practice, awareness, and smart decisions.", className: "crystal", image: inpvpImages.crystal },
  { icon: Shield, number: "02", title: "Base Building & Raiding", tag: "PROTECT YOUR LOOT", body: "Build a hidden base, secure your resources, scout your rivals, and plan your next raid with your team.", className: "base", image: inpvpImages.base },
  { icon: Crosshair, number: "03", title: "Warzone PvP", tag: "NO PLACE TO HIDE", body: "Enter dangerous battles, challenge rival squads, and fight for valuable loot in contested areas.", className: "warzone", image: minigamesCard },
  { icon: Heart, number: "04", title: "Heart Stealing", tag: "EVERY HEART COUNTS", body: "Win fights to steal hearts and grow stronger. Lose a fight and your opponents may grow stronger instead.", className: "hearts", image: inpvpImages.hearts },
  { icon: Users, number: "05", title: "Teams & Alliances", tag: "TRUST YOUR SQUAD", body: "Build a team, form temporary alliances, and decide who deserves your trust in a world of rivalries.", className: "teams", image: teamCard },
  { icon: Pickaxe, number: "06", title: "Survival & Progression", tag: "BUILD YOUR LEGACY", body: "Gather resources, gear up, explore, and turn a small start into a base everyone knows about.", className: "survival", image: skyblockCard },
];

export default function Lifesteal() {
  const [copied, setCopied] = useState(false);
  const serverIp = "veldoramc.mc-dns.net";
  useSeo({ title: "Lifesteal — VeldoraMC", description: "Discover VeldoraMC Lifesteal: PvP, base raiding, warzones, heart stealing, and team rivalries.", path: "/lifesteal" });
  async function copyIp() {
    if (!serverIp) return;
    try { await navigator.clipboard.writeText(serverIp); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); }
  }

  return <main className="vl-page">
    <section className="vl-hero" style={{ "--vl-bg": `url(${lifestealImage})` }}>
      <div className="vl-hero-shade" />
      <div className="vl-hero-content">
        <Link to="/" className="vl-back"><ArrowLeft size={16}/> BACK TO HOME</Link>
        <span className="vl-kicker"><i/> VELDORAMC • MAIN GAMEMODE</span>
        <h1>EVERY HEART<br/><em>HAS A PRICE.</em></h1>
        <p>Build your base. Gather your squad. Fight for every heart. In Lifesteal, every encounter can change the balance of power.</p>
        <div className="vl-hero-pills"><span><Heart size={15}/> HEARTS ON THE LINE</span><span><Swords size={15}/> COMPETITIVE PvP</span><span><Users size={15}/> SQUAD UP</span></div>
        <a href="#features" className="vl-primary">EXPLORE THE GAMEMODE <ArrowRight size={17}/></a>
      </div>
      <div className="vl-hero-label"><span>01 / THE EXPERIENCE</span><span>YOUR STORY STARTS HERE</span></div>
    </section>
    <section className="vl-launch-announcement">
      <div className="vl-launch-art"><img src={launchCard} alt="Fantasy Minecraft-style VeldoraMC launch artwork"/></div>
      <div className="vl-launch-copy"><span className="vl-kicker">OFFICIAL SERVER UPDATE</span><h2>THE LAUNCH IS<br/><em>ONLY DAYS AWAY.</em></h2><p>VeldoraMC is almost ready. Get your squad together and join our Discord for the official launch date, sneak peeks, and important updates.</p><a className="vl-primary" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer">JOIN DISCORD FOR INFO <ArrowRight size={16}/></a></div>
    </section>
    <section id="features" className="vl-features">
      <div className="vl-section-heading"><span className="vl-kicker">MORE THAN SURVIVAL</span><h2>WHAT IS <em>LIFESTEAL?</em></h2><p>A survival world where hearts are power, alliances are fragile, and the next fight is never far away.</p></div>
      <div className="vl-feature-grid">{features.map(({icon:Icon,number,title,tag,body,className,image})=><article className={`vl-feature-card vl-${className}`} key={number}>
        <div className="vl-feature-art" style={{ "--vl-card-bg": `url(${image || lifestealImage})` }}><span className="vl-feature-number">{number}</span><span className="vl-feature-icon"><Icon size={25}/></span><span className="vl-feature-art-label">VELDORAMC / LIFESTEAL</span></div>
        <div className="vl-feature-copy"><span className="vl-feature-tag">{tag}</span><h3>{title}</h3><p>{body}</p></div>
      </article>)}</div>
    </section>
    <section className="vl-how"><div className="vl-how-copy"><span className="vl-kicker">PLAY SMART. STAY ALIVE.</span><h2>YOUR HEARTS.<br/><em>YOUR LEGACY.</em></h2><p>Gear up, pick your battles, and make every decision count. Whether you prefer building a secure base or taking the fight straight to your rivals, there's always another way to rise.</p><div className="vl-how-points"><span><Heart size={17}/> Hearts can be won and lost</span><span><Shield size={17}/> Protect your resources</span><span><Users size={17}/> Allies can change everything</span></div></div><div className="vl-how-art" style={{ "--vl-bg": `url(${lifestealImage})` }}><div className="vl-art-stamp"><Heart size={24}/><b>FIGHT<br/>FOR MORE</b><small>VELDORAMC</small></div></div></section>
    <section className="vl-join"><span className="vl-kicker">JOIN THE BATTLE</span><h2>READY TO MAKE<br/><em>YOUR MARK?</em></h2><p>Jump into VeldoraMC Lifesteal. Copy the server address and join the fight.</p><div className="vl-ip-box"><div><span>JAVA EDITION • SERVER IP</span><strong>{serverIp}</strong></div><button onClick={copyIp} type="button" title="Copy server IP">{copied ? "COPIED!" : "COPY IP"}</button></div><div className="vl-join-actions"><a href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer" className="vl-primary">JOIN THE COMMUNITY <ArrowRight size={17}/></a><Link to="/" className="vl-secondary">BACK TO HOME</Link></div><small className="vl-disclaimer">Add the server in Minecraft Java Edition using the address above. If connection fails, check our Discord for server status.</small></section>
  </main>;
}
