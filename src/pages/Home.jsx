import { ArrowRight, Gamepad2, Users, ShieldCheck, Sparkles, Swords, MessageCircle, Globe2 } from "lucide-react";
import { useState } from "react";
import { useSeo } from "../hooks/useSeo";

const projects = [
  { tag: "SURVIVAL · LIFESTEAL", title: "Veldora Survival", description: "Build your base, protect your hearts, and write your own story in a world shaped by its players.", tone: "survival", icon: Globe2 },
  { tag: "COMPETITIVE", title: "PvP & Events", description: "Test your skills, take on challenges, and compete with the community for bragging rights.", tone: "pvp", icon: Swords },
  { tag: "COMMUNITY", title: "Play together", description: "Find your squad, join events, and be there from the very beginning of VeldoraMC.", tone: "community", icon: Users },
];
const values = [
  { icon: Users, title: "Community first", text: "A place to meet players, build friendships, and create stories together." },
  { icon: Sparkles, title: "Always evolving", text: "We want VeldoraMC to grow with player feedback, fresh ideas, and new adventures." },
  { icon: ShieldCheck, title: "Fair play matters", text: "A welcoming environment built around respectful play and clear community rules." },
];
export default function Home() {
  useSeo({ title: "VeldoraMC — Minecraft Community", description: "Discover VeldoraMC, a Minecraft community built for survival, competition, and playing together.", path: "/" });
  return <div className="vel-home inpvp-inspired">
    <section className="network-hero">
      <div className="network-hero__art" aria-hidden="true"><div className="network-hero__sun" /><div className="network-hero__mountain mountain-a" /><div className="network-hero__mountain mountain-b" /><div className="network-hero__blocks"><span /><span /><span /><span /><span /></div></div>
      <div className="network-hero__content">
        <div className="network-pill"><span className="live-dot" /> THE VELDORAMC NETWORK</div><div className="network-emblem"><span>V</span><i>MC</i></div>
        <h1>YOUR NEXT<br /><span>MINECRAFT ADVENTURE.</span></h1><p>Discover new worlds, meet your people, and make your mark. Your story starts at VeldoraMC.</p>
        <div className="network-actions"><a className="vbtn vbtn-primary" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer"><MessageCircle size={17} /> SERVER INFO & UPDATES <ArrowRight size={15} /></a><a className="vbtn vbtn-glass" href="#projects"><Gamepad2 size={17} /> EXPLORE THE NETWORK</a></div>
        <div className="network-note">SERVER ADDRESS & SUPPORTED EDITIONS ANNOUNCED IN DISCORD</div>
      </div><a className="network-scroll" href="#projects">EXPLORE VELDORAMC <span>↓</span></a>
    </section>
    <section className="network-projects" id="projects"><div className="network-section-head"><div><span className="section-kicker">DISCOVER VELDORAMC</span><h2>Pick your next <span>adventure.</span></h2></div><p>One community. New experiences. Find the way you want to play.</p></div>
      <div className="network-project-grid">{projects.map((project, index) => { const Icon = project.icon; return <article className={`network-project-card ${project.tone}`} key={project.title}><div className="project-art"><div className="project-art__glow" /><Icon size={46} strokeWidth={1.3} /><span className="project-index">0{index + 1}</span></div><div className="project-copy"><span className="project-tag">{project.tag}</span><h3>{project.title}</h3><p>{project.description}</p><a href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer">DISCOVER MORE <ArrowRight size={15} /></a></div></article>; })}</div>
    </section>
    <section className="network-community"><div className="network-community__visual"><div className="community-orbit orbit-1" /><div className="community-orbit orbit-2" /><div className="community-cube"><Gamepad2 size={60} /></div><span className="community-float float-one">BUILD</span><span className="community-float float-two">COMPETE</span><span className="community-float float-three">BELONG</span></div><div className="network-community__copy"><span className="section-kicker">MORE THAN A SERVER</span><h2>Made for players.<br /><span>Built by community.</span></h2><p>From your first login to your biggest win, VeldoraMC is about the people you meet and the memories you make. Join our Discord to hear about launches, events, and what we’re building next.</p><a className="vbtn vbtn-primary" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer"><MessageCircle size={17} /> JOIN THE COMMUNITY <ArrowRight size={15} /></a></div></section>
    <section className="network-values"><div className="network-section-head"><div><span className="section-kicker">WHAT WE BELIEVE</span><h2>A better world to <span>play in.</span></h2></div><p>Our community is the heart of VeldoraMC.</p></div><div className="network-values-grid">{values.map((value, i) => { const Icon = value.icon; return <article className="network-value" key={value.title}><span className="network-value__num">0{i + 1}</span><Icon size={25} /><h3>{value.title}</h3><p>{value.text}</p></article>; })}</div></section>
    <section className="network-final-cta"><div><span className="section-kicker">YOUR ADVENTURE AWAITS</span><h2>Ready to join <span>VeldoraMC?</span></h2><p>Get announcements, meet the community, and be first to hear when the gates open.</p></div><a className="vbtn vbtn-primary" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer">JOIN DISCORD <ArrowRight size={16} /></a></section>
  </div>;
}