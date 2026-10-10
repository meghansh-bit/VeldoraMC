import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CircleHelp, Crown, MessageCircle, ShieldCheck, Trophy, Users, Swords, Coins, Wallet, UsersRound, Medal } from "lucide-react";
import { useSeo } from "../hooks/useSeo";

const pages = {
  "/profiles": { num:"01", eyebrow:"PLAYER DIRECTORY", title:"PLAYER PROFILES", accent:"YOUR LEGACY.", intro:"A home for every adventurer. Search players, view stats, and follow the stories unfolding across VeldoraMC.", icon:Users, cards:[["Public profiles","Minecraft name, avatar, rank, and recent achievements."],["Personal stats","Kills, hearts, streaks, and playtime when game data is connected."],["Player history","A timeline for milestones and notable moments."]] },
  "/community": { num:"03", eyebrow:"FIND YOUR ALLIANCE", title:"COMMUNITY", accent:"PLAY TOGETHER.", intro:"Meet your next duo, plan your next raid, and be first to hear when VeldoraMC opens.", icon:MessageCircle, cards:[["Discord server","Invite link will be added before launch."],["Events & announcements","Community events, updates, and launch news."],["Rules & safety","A welcoming community with clear expectations."]] },
  "/support": { num:"04", eyebrow:"WE'VE GOT YOUR BACK", title:"SUPPORT CENTRE", accent:"NEED A HAND?", intro:"Find help with account access, purchases, player reports, or technical issues. Support ticket integration can be added later.", icon:CircleHelp, cards:[["Player support","Account and gameplay questions."],["Store assistance","Purchase and payment support after store launch."],["Report a player","A safe route for reporting rule-breaking."]] },
};

const HALL_CATEGORIES = [
  { id:"kills", title:"TOP KILLS", subtitle:"The fiercest fighters", detail:"Players ranked by confirmed kills", icon:Swords, accent:"text-rose-300", glow:"from-rose-400/15" },
  { id:"velora", title:"TOP VELORA COLLECTOR", subtitle:"Fortune favors the bold", detail:"Players holding the most Velora", icon:Coins, accent:"text-cyan-200", glow:"from-cyan-400/15" },
  { id:"money", title:"TOP MONEY", subtitle:"The realm's richest", detail:"Highest in-game money balance", icon:Wallet, accent:"text-amber-200", glow:"from-amber-300/15" },
  { id:"teams", title:"TOP TEAM", subtitle:"Power in numbers", detail:"Teams ranked by verified team stats", icon:UsersRound, accent:"text-violet-200", glow:"from-violet-400/15" },
];

function HallOfFame() {
  useSeo({ title:"Hall of Fame", description:"Explore the VeldoraMC Hall of Fame: top kills, Velora collectors, richest players, and leading teams.", path:"/leaderboard" });
  return <main className="portal-page">
    <div className="portal-glow"/>
    <div className="portal-inner">
      <div className="section-kicker">02 / THE HALL OF FAME</div>
      <div className="portal-heading">
        <div className="portal-icon"><Trophy size={29}/></div>
        <h1>HALL OF FAME<span>.</span><br/><span>THE BEST OF THE REALM.</span></h1>
      </div>
      <p className="portal-intro">Every kill, every coin, every victory. This is where VeldoraMC's legends will be remembered.</p>
      <div className="coming-banner"><span className="live-dot"/><div><b>WAITING FOR LIVE SERVER STATS</b><small>These rankings will populate once the Minecraft stats integration is connected. No made-up scores or player rankings.</small></div></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {HALL_CATEGORIES.map(({id,title,subtitle,detail,icon:Icon,accent,glow},index) => <section key={id} className="relative overflow-hidden rounded-xl border border-white/10 bg-[#11131c] p-5 sm:p-6">
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glow} to-transparent opacity-80`}/>
          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/20 ${accent}`}><Icon size={23}/></div>
              <span className="text-[10px] font-bold tracking-[.2em] text-white/35">CATEGORY 0{index+1}</span>
            </div>
            <h2 className={`mt-5 text-lg font-extrabold tracking-[.07em] ${accent}`}>{title}</h2>
            <p className="mt-1 text-sm font-semibold text-white/80">{subtitle}</p>
            <p className="mt-2 text-xs leading-5 text-white/50">{detail}</p>
            <div className="mt-5 flex min-h-24 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/20 px-4 py-5 text-center">
              <Medal size={22} className="mb-2 text-white/25"/>
              <p className="text-xs font-bold tracking-[.1em] text-white/50">RANKINGS COMING SOON</p>
              <p className="mt-1 text-[11px] text-white/35">Live stats not connected yet</p>
            </div>
          </div>
        </section>)}
      </div>
      <div className="portal-bottom"><div><h2>MAKE YOUR NAME LEGENDARY.</h2><p>Join the realm and earn your place in the Hall of Fame.</p></div><Link className="vbtn vbtn-primary" to="/">BACK TO HOME <ArrowRight size={16}/></Link></div>
    </div>
  </main>;
}

export default function PortalPage() {
  const loc=useLocation();
  if (loc.pathname === "/leaderboard" || loc.pathname === "/leaderboards") return <HallOfFame />;
  const p=pages[loc.pathname] || pages["/community"]; const Icon=p.icon;
  useSeo({title:p.title, description:p.intro, path:loc.pathname});
  return <main className="portal-page"><div className="portal-glow"/><div className="portal-inner"><div className="section-kicker">{p.num} / {p.eyebrow}</div><div className="portal-heading"><div className="portal-icon"><Icon size={29}/></div><h1>{p.title}<br/><span>{p.accent}</span></h1></div><p className="portal-intro">{p.intro}</p><div className="coming-banner"><span className="live-dot"/><div><b>INTEGRATION READY · COMING SOON</b><small>This is a front-end foundation. Live data and account services are not connected yet.</small></div></div><div className="portal-card-grid">{p.cards.map(([title,desc],i)=><article className="portal-card" key={title}><span className="portal-card-num">0{i+1}</span><h2>{title}</h2><p>{desc}</p><ArrowRight size={18} className="portal-card-arrow"/></article>)}</div><div className="portal-bottom"><div><h2>BE THERE FROM DAY ONE.</h2><p>Stay tuned while we prepare the realm for launch.</p></div><Link className="vbtn vbtn-primary" to="/">BACK TO HOME <ArrowRight size={16}/></Link></div></div></main>;
}
