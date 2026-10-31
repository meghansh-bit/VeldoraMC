import { useState } from "react";
import { ArrowRight, Check, Copy, Heart, Shield, Users, Gem, Pickaxe, Crosshair, Gamepad2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useSeo } from "../hooks/useSeo";
import lifestealImage from "../assets/hero/rear.png";

const features = [
  { icon: Gem, number: "01", title: "Crystal PvP", tag: "SKILL & STRATEGY", body: "Test your timing, movement, and game sense in competitive encounters." },
  { icon: Shield, number: "02", title: "Build your base", tag: "MAKE IT YOURS", body: "Gather resources, create a home, and build a base alongside your team." },
  { icon: Crosshair, number: "03", title: "Warzone", tag: "CONTESTED AREAS", body: "Explore high-risk areas, challenge rivals, and compete for valuable rewards." },
  { icon: Heart, number: "04", title: "Heart progression", tag: "EVERY HEART COUNTS", body: "Grow your hearts through the Lifesteal experience and protect your progress." },
  { icon: Users, number: "05", title: "Teams & alliances", tag: "PLAY TOGETHER", body: "Create a team, build friendships, and take on the world together." },
  { icon: Pickaxe, number: "06", title: "Survival", tag: "START YOUR STORY", body: "Explore, gather, gear up, and turn a fresh start into your own legacy." },
];

export default function Gamemodes() {
  const [copied,setCopied] = useState(false);
  useSeo({title:"Gamemodes — VeldoraMC",description:"Explore VeldoraMC gamemodes, including our featured Lifesteal experience.",path:"/gamemodes"});
  async function copyIp(){try{await navigator.clipboard.writeText("veldoramc.mc-dns.net");setCopied(true);window.setTimeout(()=>setCopied(false),1600);}catch{setCopied(false);}}
  return <main className="vld-gamemodes-page">
    <section className="vld-gamemodes-hero" style={{"--vld-gamemode-bg":`url(${lifestealImage})`}}>
      <div className="vld-gamemodes-hero-inner"><Link to="/" className="vld-gamemodes-back">← BACK TO HOME</Link><span className="vld-overline">THE VELDORAMC NETWORK • GAME MODES</span><h1>Find your<br/><em>way to play.</em></h1><p>Different ways to explore. One community to call home. Start with our featured gamemode and make your mark.</p><a href="#featured-gamemode" className="vld-button vld-button-primary">Explore featured gamemode <ArrowRight size={16}/></a></div>
    </section>
    <section className="vld-gamemode-detail vld-section" id="featured-gamemode">
      <div className="vld-gamemode-detail-art"><img src={lifestealImage} alt="Minecraft Lifesteal world"/><span>01 / FEATURED EXPERIENCE</span></div>
      <div className="vld-gamemode-detail-copy"><span className="vld-overline">SURVIVAL • COMPETITIVE • COMMUNITY</span><h2>Life<em>steal.</em></h2><p>Build your base, gather your squad, and explore a survival world where every encounter can change your progress. Form teams, protect your resources, and create your own story.</p><div className="vld-gamemode-points"><span><Heart size={16}/> Heart progression</span><span><Shield size={16}/> Base building</span><span><Users size={16}/> Teams & alliances</span><span><Gamepad2 size={16}/> Survival gameplay</span></div><button className="vld-copy-server" type="button" onClick={copyIp}>{copied?<Check size={16}/>:<Copy size={16}/>} {copied?"SERVER IP COPIED":"COPY SERVER IP"} <code>veldoramc.mc-dns.net</code></button></div>
    </section>
    <section className="vld-gamemode-features vld-section"><div className="vld-section-heading"><div><div className="vld-overline">THE LIFESTEAL EXPERIENCE</div><h2>Play your way.<br/><em>Build your legacy.</em></h2></div><p>Explore the different parts of the featured experience, from building and progression to teaming up with friends.</p></div><div className="vld-feature-grid">{features.map(({icon:Icon,number,title,tag,body})=><article className="vld-feature" key={number}><div className="vld-feature-top"><span>{number} / {tag}</span><Icon size={20}/></div><div className="vld-feature-bottom"><h3>{title}</h3><p>{body}</p></div></article>)}</div><div className="vld-gamemode-coming"><Sparkles size={16}/> More gamemodes are planned. Stay tuned for announcements.</div></section>
  </main>;
}