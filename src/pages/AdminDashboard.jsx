import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, Bell, Boxes, CheckCircle2,
  ChevronDown, CircleDollarSign, Command, Download, ExternalLink, Eye,
  FileText, LayoutDashboard, LifeBuoy, LogOut, Menu, Package, Search,
  Settings, ShieldCheck, ShoppingBag, ShoppingCart, Swords, Users, X,
  Zap, Clock3, MoreHorizontal, Plus, RefreshCw, TrendingUp, AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./AdminDashboard.css";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingBag, count: "04" },
  { label: "Players", icon: Users },
  { label: "Store & ranks", icon: Package },
  { label: "Rank delivery", icon: Zap, count: "02" },
  { label: "Announcements", icon: Bell },
  { label: "Audit log", icon: FileText },
];
const demoOrders = [
  { id: "VD-1048", player: "VoidCrafter", item: "Phantom Bundle", amount: "₹499", status: "Paid", date: "Just now" },
  { id: "VD-1047", player: "MistyPvP", item: "Titan Rank", amount: "₹299", status: "Processing", date: "12 min ago" },
  { id: "VD-1046", player: "xRitish", item: "1000 Velora", amount: "₹149", status: "Paid", date: "34 min ago" },
  { id: "VD-1045", player: "CraftNova", item: "Warden Bundle", amount: "₹799", status: "Refunded", date: "1 hr ago" },
];
const bars = [32, 45, 39, 60, 48, 71, 55, 66, 50, 79, 63, 91, 68, 83, 72, 98, 74, 86, 67, 93, 80, 100, 77, 89];

function money(n) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n); }

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [notice, setNotice] = useState("");
  const [range, setRange] = useState("7 days");

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      const user = data?.session?.user;
      setUserEmail(user?.email || "");
      setIsAdmin(user?.app_metadata?.role === "admin");
      setChecking(false);
    }).catch(() => { if (alive) setChecking(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setUserEmail(user?.email || "");
      setIsAdmin(user?.app_metadata?.role === "admin");
      setChecking(false);
    });
    return () => { alive = false; listener?.subscription?.unsubscribe(); };
  }, []);

  const filteredOrders = useMemo(() => demoOrders.filter(order =>
    [order.id, order.player, order.item, order.status].join(" ").toLowerCase().includes(query.toLowerCase())
  ), [query]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }
  function actionNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  if (checking) return <div className="va-gate"><div className="va-loader" /><p>Checking admin access…</p></div>;
  if (!isAdmin) return (
    <main className="va-gate">
      <div className="va-gate-card">
        <div className="va-brand-symbol"><Swords size={25} /></div>
        <span className="va-eyebrow">VELDORAMC CONTROL CENTER</span>
        <h1>Admin access only.</h1>
        <p>{userEmail ? "Your account is signed in, but it does not have the server-side admin role." : "Sign in with your authorized administrator account to continue."}</p>
        <div className="va-gate-note"><ShieldCheck size={17} /><span>Access is checked against Supabase user app metadata. A normal user cannot grant themselves admin access from this page.</span></div>
        <button className="va-primary" onClick={() => navigate("/login")}>{userEmail ? "Back to website" : "Go to sign in"}</button>
        <a href="/" className="va-back-link">Return to VeldoraMC <ExternalLink size={14} /></a>
      </div>
    </main>
  );

  const isOverview = active === "Overview";
  return (
    <div className="va-shell">
      {mobileNav && <button className="va-mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <aside className={`va-sidebar ${mobileNav ? "is-open" : ""}`}>
        <a className="va-brand" href="/" aria-label="VeldoraMC home">
          <span className="va-brand-symbol"><Swords size={21} /></span>
          <span><b>VELDORA<span>MC</span></b><small>CONTROL CENTER</small></span>
          <button className="va-close-nav" aria-label="Close navigation" onClick={(e) => { e.preventDefault(); setMobileNav(false); }}><X size={18} /></button>
        </a>
        <div className="va-server-switch"><span className="va-server-icon"><Command size={17} /></span><span><b>VeldoraMC</b><small>Lifesteal network</small></span><ChevronDown size={15} /></div>
        <div className="va-nav-label">WORKSPACE</div>
        <nav className="va-nav">
          {navigation.map(item => <button key={item.label} className={active === item.label ? "active" : ""} onClick={() => { setActive(item.label); setMobileNav(false); }}>
            <item.icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{item.count && <small>{item.count}</small>}
          </button>)}
        </nav>
        <div className="va-nav-label va-nav-label-bottom">SYSTEM</div>
        <nav className="va-nav"><button className={active === "Settings" ? "active" : ""} onClick={() => { setActive("Settings"); setMobileNav(false); }}><Settings size={17} /><span>Settings</span></button><a href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer"><LifeBuoy size={17} /><span>Help & support</span><ExternalLink size={13} /></a></nav>
        <div className="va-sidebar-bottom">
          <div className="va-status-line"><span className="va-live-dot" /><span>Website systems</span><b>Preview</b></div>
          <div className="va-user"><div className="va-avatar">{(userEmail[0] || "A").toUpperCase()}</div><div className="va-user-copy"><b>{userEmail.split("@")[0] || "Administrator"}</b><small>Administrator</small></div><button aria-label="Sign out" onClick={signOut}><LogOut size={16} /></button></div>
        </div>
      </aside>

      <main className="va-main">
        <header className="va-topbar">
          <div className="va-topbar-left"><button className="va-menu-button" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20} /></button><span className="va-breadcrumb">Workspace</span><span className="va-crumb-slash">/</span><b>{active}</b></div>
          <div className="va-topbar-actions"><span className="va-environment"><i /> DEMO DATA</span><button className="va-icon-button" aria-label="Notifications" onClick={() => actionNotice("You're all caught up.")}><Bell size={18} /><i /></button><a className="va-view-site" href="/" target="_blank" rel="noreferrer"><Eye size={15} /> View site <ExternalLink size={13} /></a></div>
        </header>

        <div className="va-content">
          {notice && <div className="va-toast"><CheckCircle2 size={17} />{notice}<button onClick={() => setNotice("")}><X size={15} /></button></div>}
          <div className="va-page-heading">
            <div><div className="va-eyebrow"><span className="va-live-dot" /> VELDORAMC / ADMIN</div><h1>{isOverview ? "Good to see you." : active}<span>{isOverview ? " Here's your server overview." : "."}</span></h1><p>{isOverview ? "Here's what's happening across your store and community." : `Manage your VeldoraMC ${active.toLowerCase()} from one place.`}</p></div>
            <div className="va-heading-actions"><button className="va-secondary" onClick={() => actionNotice("Demo dashboard refreshed.")}><RefreshCw size={15} /> Refresh</button><button className="va-primary" onClick={() => setShowCreate(true)}><Plus size={17} /> {active === "Announcements" ? "New announcement" : active === "Store & ranks" ? "Add product" : "Quick action"}</button></div>
          </div>

          {!isOverview && <div className="va-demo-banner"><AlertCircle size={17} /><div><b>Dashboard preview</b><span>This section is a UI preview. Live records and write actions will activate after the Supabase tables and secure server-side handlers are connected.</span></div></div>}

          {isOverview ? <>
            <section className="va-stat-grid">
              <article className="va-stat-card"><div className="va-stat-top"><span>Total revenue</span><span className="va-stat-icon purple"><CircleDollarSign size={19} /></span></div><div className="va-stat-value">{money(28450)}</div><div className="va-stat-foot"><span className="va-positive"><ArrowUpRight size={15} /> 12.8%</span><span>vs. previous 7 days</span></div><div className="va-stat-spark spark-purple">{[30,44,37,58,45,67,54,77,61,88,70,100].map((v,i)=><i key={i} style={{height:v+"%"}} />)}</div></article>
              <article className="va-stat-card"><div className="va-stat-top"><span>Store orders</span><span className="va-stat-icon blue"><ShoppingCart size={19} /></span></div><div className="va-stat-value">186</div><div className="va-stat-foot"><span className="va-positive"><ArrowUpRight size={15} /> 8.2%</span><span>vs. previous 7 days</span></div><div className="va-stat-spark spark-blue">{[43,33,52,45,60,48,68,56,72,62,84,100].map((v,i)=><i key={i} style={{height:v+"%"}} />)}</div></article>
              <article className="va-stat-card"><div className="va-stat-top"><span>Registered players</span><span className="va-stat-icon green"><Users size={19} /></span></div><div className="va-stat-value">2,841</div><div className="va-stat-foot"><span className="va-positive"><ArrowUpRight size={15} /> 5.4%</span><span>vs. previous 7 days</span></div><div className="va-stat-spark spark-green">{[25,38,34,51,46,59,52,68,65,80,74,100].map((v,i)=><i key={i} style={{height:v+"%"}} />)}</div></article>
              <article className="va-stat-card"><div className="va-stat-top"><span>Pending deliveries</span><span className="va-stat-icon amber"><Zap size={19} /></span></div><div className="va-stat-value">02</div><div className="va-stat-foot"><span className="va-attention"><Clock3 size={14} /> Needs attention</span><span>rank queue</span></div><div className="va-pending-line"><span /><span /></div></article>
            </section>

            <section className="va-main-grid">
              <article className="va-panel va-revenue-panel">
                <div className="va-panel-heading"><div><h2>Revenue overview</h2><p>Store performance at a glance</p></div><select value={range} onChange={e => setRange(e.target.value)} aria-label="Revenue date range"><option>7 days</option><option>30 days</option><option>90 days</option></select></div>
                <div className="va-chart-summary"><b>₹28,450</b><span><TrendingUp size={15} /> 12.8% <small>this period</small></span></div>
                <div className="va-chart"><div className="va-chart-y"><span>₹8k</span><span>₹6k</span><span>₹4k</span><span>₹2k</span><span>₹0</span></div><div className="va-chart-area"><div className="va-chart-grid">{[0,1,2,3,4].map(n=><i key={n}/>)}</div><div className="va-chart-bars">{bars.map((v,i)=><div key={i} className={i === bars.length-1 ? "current" : ""} style={{height:v+"%"}} title={`Demo point ${i+1}`} />)}</div></div></div>
                <div className="va-chart-x"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
                <div className="va-chart-disclaimer">Illustrative chart · demo data only</div>
              </article>
              <article className="va-panel va-delivery-panel">
                <div className="va-panel-heading"><div><h2>Delivery queue</h2><p>Automated rank fulfilment</p></div><button className="va-text-link" onClick={() => setActive("Rank delivery")}>View queue <span>→</span></button></div>
                <div className="va-queue-item"><span className="va-queue-icon amber"><Zap size={17}/></span><div><b>Titan Rank</b><small>MistyPvP · #VD-1047</small><div className="va-progress"><i style={{width:"68%"}} /></div></div><span className="va-queue-status amber-text">Processing</span></div>
                <div className="va-queue-item"><span className="va-queue-icon purple"><Package size={17}/></span><div><b>Phantom Bundle</b><small>VoidCrafter · #VD-1044</small><div className="va-progress"><i style={{width:"24%"}} /></div></div><span className="va-queue-status purple-text">Queued</span></div>
                <div className="va-queue-foot"><span className="va-live-dot" /> Queue status is sample data</div>
              </article>
            </section>

            <section className="va-panel va-orders-panel">
              <div className="va-panel-heading"><div><h2>Recent orders</h2><p>Your latest store activity</p></div><button className="va-text-link" onClick={() => setActive("Orders")}>All orders <span>→</span></button></div>
              <div className="va-table-tools"><label className="va-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search orders or players…" /></label><button className="va-secondary va-export" onClick={() => actionNotice("Export will be enabled when live order data is connected.")}><Download size={15}/> Export</button></div>
              <div className="va-table-wrap"><table className="va-table"><thead><tr><th>ORDER</th><th>PLAYER</th><th>ITEM</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th><th /></tr></thead><tbody>{filteredOrders.map(order=><tr key={order.id}><td className="va-order-id">{order.id}</td><td><span className="va-player-cell"><span className="va-player-avatar">{order.player.slice(0,1)}</span>{order.player}</span></td><td>{order.item}</td><td className="va-amount">{order.amount}</td><td><span className={`va-pill ${order.status.toLowerCase()}`}><i/>{order.status}</span></td><td className="va-date">{order.date}</td><td><button className="va-row-more" aria-label={`More actions for ${order.id}`} onClick={() => actionNotice(`${order.id} is sample data; live order actions are not connected.`)}><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table>{filteredOrders.length===0&&<div className="va-empty">No matching demo orders.</div>}</div>
              <div className="va-table-bottom"><span>Showing {filteredOrders.length} sample orders</span><span>Live store connection pending</span></div>
            </section>
          </> : <section className="va-panel va-section-preview">
            <div className="va-section-icon"><Boxes size={25}/></div><h2>{active}</h2><p>This workspace is ready for its live data connection. The design and navigation are in place; real management actions need secured database tables and server-side permissions before they can be enabled.</p>
            <div className="va-preview-grid"><div><span>01</span><b>Connect records</b><small>Read data from Supabase with row-level security.</small></div><div><span>02</span><b>Enable safe actions</b><small>Validate changes on the server before writing data.</small></div><div><span>03</span><b>Track every change</b><small>Record admin activity in an audit log.</small></div></div>
            <button className="va-secondary" onClick={() => setActive("Overview")}>Back to overview</button>
          </section>}
          <footer className="va-footer"><span>© {new Date().getFullYear()} VeldoraMC · Control Center</span><span><ShieldCheck size={14}/> Secure admin workspace <span className="va-footer-dot">·</span> <span>Preview build</span></span></footer>
        </div>
      </main>

      {showCreate && <div className="va-modal-backdrop" role="presentation" onMouseDown={e => { if(e.target === e.currentTarget) setShowCreate(false); }}><section className="va-modal" role="dialog" aria-modal="true" aria-labelledby="va-modal-title"><button className="va-modal-close" onClick={() => setShowCreate(false)} aria-label="Close"><X size={18}/></button><span className="va-modal-icon"><Plus size={21}/></span><span className="va-eyebrow">QUICK ACTION</span><h2 id="va-modal-title">Admin actions are coming next.</h2><p>Products, announcements and order actions will be enabled after the database and secure server-side handlers are configured. Nothing has been changed.</p><button className="va-primary" onClick={() => setShowCreate(false)}>Got it</button></section></div>}
    </div>
  );
}
