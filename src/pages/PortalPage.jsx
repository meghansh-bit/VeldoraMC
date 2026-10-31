import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CircleHelp, MessageCircle, Trophy, Users, Swords, Coins, Wallet, UsersRound, Medal, Plus, Ticket, Send, RefreshCw, Clock3, CheckCircle2, AlertCircle, X, ChevronLeft } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import { supabase } from "../lib/supabase";

const pages = {
  "/profiles": { num:"01", eyebrow:"PLAYER DIRECTORY", title:"PLAYER PROFILES", accent:"YOUR LEGACY.", intro:"A home for every adventurer. Search players, view stats, and follow the stories unfolding across VeldoraMC.", icon:Users, cards:[["Public profiles","Minecraft name, avatar, rank, and recent achievements."],["Personal stats","Kills, hearts, streaks, and playtime when game data is connected."],["Player history","A timeline for milestones and notable moments."]] },
  "/community": { num:"03", eyebrow:"FIND YOUR ALLIANCE", title:"COMMUNITY", accent:"PLAY TOGETHER.", intro:"Meet your next duo, plan your next adventure, and stay connected with the VeldoraMC community.", icon:MessageCircle, cards:[["Discord server","Join the official VeldoraMC Discord community."],["Events & announcements","Follow official news, events, and server updates."],["Meet your teammates","Find players, form teams, and make new friends."]] },
  "/rules": { num:"02", eyebrow:"COMMUNITY GUIDELINES", title:"SERVER RULES", accent:"PLAY FAIR. RESPECT OTHERS.", intro:"Help keep VeldoraMC competitive, welcoming, and enjoyable. Treat players fairly, respect staff decisions, and keep the community safe.", icon:ShieldCheck, cards:[["Respect every player","No harassment, hate speech, threats, or targeted abuse."],["Play fairly","No cheating, exploiting, malicious clients, or abusing unintended bugs."],["Protect the community","No scams, impersonation, spam, or sharing private information. Follow staff instructions."]] },
};

const TICKET_CATEGORIES = ["General question", "Account help", "Store / purchase", "Player report", "Bug report", "Ban appeal", "Other"];

function SupportCentre() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(TICKET_CATEGORIES[0]);
  const [priority, setPriority] = useState("normal");
  const [firstMessage, setFirstMessage] = useState("");
  const [reply, setReply] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user || null);
      setLoading(false);
    }).catch(() => { if (active) setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  async function loadTickets() {
    if (!user) { setTickets([]); return; }
    setLoading(true); setError("");
    const { data, error: queryError } = await supabase.from("support_tickets").select("id,subject,category,priority,status,created_at,updated_at").order("updated_at", { ascending: false });
    if (queryError) setError(queryError.message.includes("does not exist") ? "Support tables aren't set up yet. Run the SQL setup script in your Supabase SQL Editor." : queryError.message);
    else setTickets(data || []);
    setLoading(false);
  }

  useEffect(() => { loadTickets(); }, [user]);

  async function openTicket(ticket) {
    setSelected(ticket); setMessages([]); setError(""); setNotice("");
    const { data, error: queryError } = await supabase.from("support_messages").select("id,ticket_id,user_id,message,created_at").eq("ticket_id", ticket.id).order("created_at", { ascending: true });
    if (queryError) setError(queryError.message);
    else setMessages(data || []);
  }

  async function createTicket(event) {
    event.preventDefault(); setError(""); setNotice("");
    if (!user) return;
    const activeTicket = tickets.find((item) => item.status === "open");
    if (activeTicket) {
      setShowNew(false); setSelected(activeTicket);
      setError("You already have an open ticket. Please continue that conversation; you can create another after it is resolved.");
      return;
    }
    if (subject.trim().length < 4 || firstMessage.trim().length < 10) {
      setError("Add a subject (at least 4 characters) and explain your issue in at least 10 characters."); return;
    }
    setCreating(true);
    // Re-check the live Supabase session at submit time rather than relying on
    // component state that may be stale after OTP login/session refresh.
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const authenticatedUser = authData?.user;
    if (authError || !authenticatedUser) {
      setError("Your login session has expired. Please sign in again, then create your ticket.");
      setCreating(false);
      return;
    }
    const { data: ticket, error: insertError } = await supabase.from("support_tickets").insert({
      user_id: authenticatedUser.id,
      subject: subject.trim(),
      category,
      priority,
      status: "open"
    }).select("id,subject,category,priority,status,created_at,updated_at").single();
    if (insertError) { setError(insertError.message); setCreating(false); return; }
    const { error: messageError } = await supabase.from("support_messages").insert({ ticket_id: ticket.id, user_id: user.id, message: firstMessage.trim() });
    if (messageError) {
      setError("Ticket was created, but the first message could not be saved: " + messageError.message);
      setCreating(false); await loadTickets(); return;
    }
    setSubject(""); setFirstMessage(""); setPriority("normal"); setCategory(TICKET_CATEGORIES[0]); setShowNew(false);
    await loadTickets(); await openTicket(ticket); setCreating(false); setNotice("Your ticket has been created.");
  }

  async function sendReply(event) {
    event.preventDefault(); if (!selected || !reply.trim() || !user) return;
    setSending(true); setError("");
    const { error: insertError } = await supabase.from("support_messages").insert({ ticket_id: selected.id, user_id: user.id, message: reply.trim() });
    if (insertError) setError(insertError.message);
    else { setReply(""); await openTicket(selected); await loadTickets(); }
    setSending(false);
  }

  async function closeTicket() {
    if (!selected) return;
    setError("");
    const { error: updateError } = await supabase.from("support_tickets").update({ status: "closed" }).eq("id", selected.id);
    if (updateError) setError(updateError.message);
    else { const updated = { ...selected, status: "closed" }; setSelected(updated); await loadTickets(); }
  }

  return <main className="portal-page support-page"><div className="portal-glow"/><div className="portal-inner">
    <div className="section-kicker">04 / PLAYER CARE</div>
    <div className="portal-heading"><div className="portal-icon"><CircleHelp size={29}/></div><h1>SUPPORT CENTRE<br/><span>WE'VE GOT YOUR BACK.</span></h1></div>
    <p className="portal-intro">Open a private ticket, explain what happened, and keep the conversation in one place — like a Discord support ticket.</p>
    <div className="coming-banner support-response-banner"><span className="live-dot"/><div><b>OUR RESPONSE GOAL: WITHIN 24 HOURS</b><small>We aim to resolve all support tickets within 24 hours. Complex issues may take longer, but we will keep you updated.</small></div></div>
    {!user ? <section className="support-auth-card"><div className="support-status-icon"><Ticket size={24}/></div><h2>Sign in to open a ticket</h2><p>Tickets are private to your account. Sign in with your email to create a ticket and view your support history.</p><Link className="vbtn vbtn-primary" to="/login">SIGN IN TO CONTINUE <ArrowRight size={16}/></Link></section> :
    <div className="support-layout">
      <aside className="support-sidebar">
        <div className="support-sidebar-top"><div><span className="support-overline">YOUR SUPPORT</span><h2>My tickets</h2></div><button className="support-icon-btn" onClick={loadTickets} aria-label="Refresh tickets"><RefreshCw size={16}/></button></div>
        <button className="vbtn vbtn-primary support-new-btn" disabled={tickets.some((item) => item.status === "open")} title={tickets.some((item) => item.status === "open") ? "Resolve your open ticket before creating another" : "Create a support ticket"} onClick={() => { setShowNew(true); setSelected(null); setError(""); setNotice(""); }}><Plus size={17}/> {tickets.some((item) => item.status === "open") ? "OPEN TICKET IN PROGRESS" : "CREATE TICKET"}</button>
        {loading ? <p className="support-muted">Loading tickets…</p> : tickets.length === 0 ? <div className="support-empty-small"><Ticket size={22}/><b>No tickets yet</b><span>Need help? Create your first ticket.</span></div> : <div className="support-ticket-list">{tickets.map(ticket=><button key={ticket.id} className={`support-ticket-row ${selected?.id===ticket.id ? "is-selected" : ""}`} onClick={() => { setShowNew(false); openTicket(ticket); }}><span className="support-ticket-row-top"><span className={`support-dot status-${ticket.status}`}/><b>{ticket.subject}</b></span><span className="support-ticket-row-meta">#{ticket.id.slice(0,8)} · {ticket.category}</span><span className="support-ticket-row-bottom"><span className={`support-status status-${ticket.status}`}>{ticket.status}</span><small>{new Date(ticket.updated_at || ticket.created_at).toLocaleDateString()}</small></span></button>)}</div>}
      </aside>
      <section className="support-main">
        {showNew && tickets.some((item) => item.status === "open") ? <div className="support-welcome"><div className="support-welcome-icon"><Ticket size={28}/></div><span className="support-overline">ONE OPEN TICKET AT A TIME</span><h2>Continue your current ticket</h2><p>To keep support organized, please resolve your current ticket before opening another.</p><button className="vbtn vbtn-primary" onClick={() => { const activeTicket = tickets.find((item) => item.status === "open"); if (activeTicket) { setShowNew(false); openTicket(activeTicket); } }}>VIEW OPEN TICKET <ArrowRight size={16}/></button></div> : showNew ? <><div className="support-panel-heading"><span className="support-overline">NEW REQUEST</span><h2>Create a ticket</h2><p>Give us enough detail to understand how we can help.</p></div><form className="support-form" onSubmit={createTicket}>
          <label>Subject<input value={subject} onChange={e=>setSubject(e.target.value)} maxLength={120} placeholder="Briefly describe your issue" required/></label>
          <div className="support-form-grid"><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{TICKET_CATEGORIES.map(item=><option key={item}>{item}</option>)}</select></label><label>Priority<select value={priority} onChange={e=>setPriority(e.target.value)}><option value="normal">Normal</option><option value="high">High</option></select></label></div>
          <label>How can we help?<textarea value={firstMessage} onChange={e=>setFirstMessage(e.target.value)} rows={6} maxLength={5000} placeholder="Include what happened and any useful details. Don't share passwords or payment card details." required/></label>
          <div className="support-form-foot"><small>{firstMessage.length}/5000 characters</small><button className="vbtn vbtn-primary" type="submit" disabled={creating}>{creating ? "CREATING…" : "SUBMIT TICKET"} <ArrowRight size={16}/></button></div>
        </form></> : selected ? <><div className="support-panel-heading support-thread-heading"><button className="support-back-btn" onClick={()=>setSelected(null)}><ChevronLeft size={16}/> ALL TICKETS</button><div className="support-thread-title"><div><span className="support-overline">TICKET #{selected.id.slice(0,8)}</span><h2>{selected.subject}</h2><p>{selected.category} · Created {new Date(selected.created_at).toLocaleString()}</p></div><span className={`support-status status-${selected.status}`}>{selected.status}</span></div>{selected.status==="open" && <button className="support-close-btn" onClick={closeTicket}><CheckCircle2 size={15}/> Mark as resolved</button>}</div>
          <div className="support-messages">{messages.map(message=><article key={message.id} className={`support-message ${message.user_id===user.id ? "own-message" : ""}`}><div className="support-message-avatar">{message.user_id===user.id ? "Y" : "S"}</div><div className="support-message-content"><div className="support-message-meta"><b>{message.user_id===user.id ? "You" : "Support team"}</b><time>{new Date(message.created_at).toLocaleString()}</time></div><p>{message.message}</p></div></article>)}</div>
          {selected.status==="open" ? <form className="support-reply-form" onSubmit={sendReply}><textarea value={reply} onChange={e=>setReply(e.target.value)} rows={3} maxLength={5000} placeholder="Write a reply…" required/><div><small>Never share passwords or sensitive payment details.</small><button type="submit" className="vbtn vbtn-primary" disabled={sending || !reply.trim()}>{sending ? "SENDING…" : "SEND REPLY"} <Send size={15}/></button></div></form> : <div className="support-closed-note"><CheckCircle2 size={18}/> This ticket is marked as resolved.</div>}
        </> : <div className="support-welcome"><div className="support-welcome-icon"><MessageCircle size={28}/></div><span className="support-overline">PRIVATE SUPPORT THREADS</span><h2>How can we help?</h2><p>Choose an existing ticket to continue the conversation, or create a new one for account help, store issues, player reports, ban appeals, and more.</p><button className="vbtn vbtn-primary" onClick={()=>setShowNew(true)}><Plus size={17}/> CREATE A TICKET</button><div className="support-help-tags"><span>Account help</span><span>Purchases</span><span>Player reports</span><span>Bug reports</span></div></div>}
        {error && <div role="alert" className="support-alert"><AlertCircle size={17}/><span>{error}</span></div>}{notice && <div role="status" className="support-notice"><CheckCircle2 size={17}/><span>{notice}</span></div>}
      </section>
    </div>}
    <div className="portal-bottom"><div><h2>NEED COMMUNITY HELP?</h2><p>Join the community for announcements and launch updates.</p></div><a className="vbtn vbtn-primary" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer">OPEN DISCORD <ArrowRight size={16}/></a></div>
  </div></main>;
}

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
  if (loc.pathname === "/support") return <SupportCentre />;
  const p=pages[loc.pathname] || pages["/community"]; const Icon=p.icon;
  useSeo({title:p.title, description:p.intro, path:loc.pathname});
  return <main className="portal-page"><div className="portal-glow"/><div className="portal-inner"><div className="section-kicker">{p.num} / {p.eyebrow}</div><div className="portal-heading"><div className="portal-icon"><Icon size={29}/></div><h1>{p.title}<br/><span>{p.accent}</span></h1></div><p className="portal-intro">{p.intro}</p><div className="coming-banner"><span className="live-dot"/><div><b>INTEGRATION READY · COMING SOON</b><small>This is a front-end foundation. Live data and account services are not connected yet.</small></div></div><div className="portal-card-grid">{p.cards.map(([title,desc],i)=><article className="portal-card" key={title}><span className="portal-card-num">0{i+1}</span><h2>{title}</h2><p>{desc}</p><ArrowRight size={18} className="portal-card-arrow"/></article>)}</div><div className="portal-bottom"><div><h2>BE THERE FROM DAY ONE.</h2><p>Stay tuned while we prepare the realm for launch.</p></div><Link className="vbtn vbtn-primary" to="/">BACK TO HOME <ArrowRight size={16}/></Link></div></div></main>;
}
