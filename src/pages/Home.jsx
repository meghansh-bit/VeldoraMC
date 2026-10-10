import { Link } from "react-router-dom";
import { ArrowRight, Compass, Heart, Swords, Trophy, Users, Sparkles, Shield, Blocks } from "lucide-react";
import PixelBox from "../components/ui/PixelBox";
import { useSeo } from "../hooks/useSeo";
import lifestealImage from "../assets/modes/survival.png";
import bedwarsImage from "../assets/modes/bedwars.png";
import skyblockImage from "../assets/modes/skyblock.png";
import minigamesImage from "../assets/modes/minigames.png";

const gameModes = [
  { name: "Lifesteal", tag: "HIGH STAKES SURVIVAL", description: "Fight, form alliances, and build your own story. Every encounter can change the balance of power.", image: lifestealImage, icon: Heart, featured: true },
  { name: "Survival", tag: "BUILD YOUR LEGACY", description: "Gather resources, explore the world, and turn a small starter base into something legendary.", image: lifestealImage, icon: Compass },
  { name: "BedWars", tag: "TEAM UP & OUTPLAY", description: "Protect your bed, gear up, and outsmart rival teams in fast-paced matches.", image: bedwarsImage, icon: Shield },
  { name: "SkyBlock", tag: "START SMALL. DREAM BIG.", description: "Begin on a tiny island and grow your own floating world one upgrade at a time.", image: skyblockImage, icon: Blocks },
  { name: "Minigames", tag: "QUICK MATCHES. BIG MOMENTS.", description: "Jump into bite-sized challenges, compete with friends, and keep the fun going.", image: minigamesImage, icon: Trophy },
];

export default function Home() {
  useSeo({
    title: "VeldoraMC — Find Your Next Adventure",
    description: "Explore VeldoraMC game modes, meet the community, and choose your next Minecraft adventure.",
    path: "/",
  });

  return (
    <main className="veldora-home">
      <section className="vh-hero">
        <div className="vh-hero-glow" />
        <div className="vh-hero-inner">
          <div className="vh-hero-copy">
            <span className="vh-eyebrow"><span className="vh-live-dot" /> YOUR NEXT MINECRAFT ADVENTURE</span>
            <h1>ENTER THE WORLD<br /><span>OF VELDORA.</span></h1>
            <p>Big adventures. Unforgettable rivalries. A community that makes every block count. Find the mode that feels like yours.</p>
            <div className="vh-hero-actions">
              <a className="vbtn vbtn-primary" href="#gamemodes"><Compass size={17} /> EXPLORE GAMEMODES <ArrowRight size={15} /></a>
              <a className="vbtn vbtn-glass" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer"><Users size={17} /> JOIN COMMUNITY</a>
            </div>
            <div className="vh-hero-note"><span>JAVA / BEDROCK INFO</span><i /> <span>BUILT FOR THE COMMUNITY</span></div>
          </div>
          <div className="vh-hero-emblem" aria-label="VeldoraMC emblem">
            <div className="vh-emblem-ring"><div className="vh-emblem-v">V</div><span>VELDORA</span><small>MINECRAFT NETWORK</small></div>
            <Sparkles className="vh-spark vh-spark-one" size={22} /><Sparkles className="vh-spark vh-spark-two" size={15} />
          </div>
        </div>
        <a className="vh-scroll" href="#gamemodes">SCROLL TO EXPLORE <span>↓</span></a>
      </section>

      <section id="gamemodes" className="vh-modes-section">
        <div className="vh-section-head">
          <div><span className="vh-section-kicker">CHOOSE YOUR ADVENTURE</span><h2>One server. <span>Many worlds.</span></h2></div>
          <p>Whether you want a fierce challenge or a place to build at your own pace, start with the mode that calls to you.</p>
        </div>
        <div className="vh-modes-grid">
          {gameModes.map(({ name, tag, description, image, icon: Icon, featured }) => (
            <article key={name} className={`vh-mode-card ${featured ? "vh-mode-featured" : ""}`}>
              <div className="vh-mode-art"><img src={image} alt={`${name} Minecraft game mode`} loading={featured ? "eager" : "lazy"} /><div className="vh-mode-art-shade" /><span className="vh-mode-tag">{tag}</span><span className="vh-mode-icon"><Icon size={19} /></span></div>
              <div className="vh-mode-copy"><div className="vh-mode-title-row"><h3>{name}</h3>{featured && <span className="vh-popular">FEATURED MODE</span>}</div><p>{description}</p><a href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer" className="vh-mode-link">DISCOVER MODE <ArrowRight size={15} /></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="vh-community">
        <div className="vh-community-icon"><Users size={26} /></div>
        <div><span className="vh-section-kicker">YOUR PEOPLE ARE HERE</span><h2>Make your next story <span>with us.</span></h2><p>Meet other players, share your builds, find teammates, and keep up with community announcements.</p></div>
        <a className="vbtn vbtn-primary" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer">JOIN DISCORD <ArrowRight size={15} /></a>
      </section>

      <section className="vh-news-teaser">
        <div><span className="vh-section-kicker">FRESH FROM VELDORA</span><h2>Stay in the loop<span>.</span></h2><p>Check announcements, community events, and server updates.</p></div>
        <Link to="/news" className="vbtn vbtn-glass">LATEST NEWS <ArrowRight size={15} /></Link>
      </section>
    </main>
  );
}
