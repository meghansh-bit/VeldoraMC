import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowUpRight, FileText, LifeBuoy, LogOut, RefreshCw, ShieldCheck, ShoppingBag, Ticket, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import "./AdminDashboard.css";

const panelStyle = { background: "#171a22", border: "1px solid #2b303b", borderRadius: 14, padding: 22, minWidth: 0 };
const muted = { color: "#9ba4b6", fontSize: 13, lineHeight: 1.65 };
const buttonStyle = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 14px", borderRadius: 9, border: "1px solid #373d4b", background: "#202531", color: "#f2f4fa", textDecoration: "none", fontWeight: 700, fontSize: 12, cursor: "pointer" };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [ticketCount, setTicketCount] = useState(null);
  const [openCount, setOpenCount] = useState(null);
  const [ticketError, setTicketError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let alive = true;
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      if (!alive) return;
      const user = data?.session?.user;
      setUserEmail(user?.email || "");
      setIsAdmin(user?.app_metadata?.role === "admin");
      setChecking(false);
      if (error) setTicketError(error.message);
    }
    checkSession().catch(() => { if (alive) setChecking(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      const user = session?.user;
      setUserEmail(user?.email || "");
      setIsAdmin(user?.app_metadata?.role === "admin");
      setChecking(false);
    });
    return () => { alive = false; listener?.subscription?.unsubscribe(); };
  }, []);

  async function loadTicketStats() {
    setRefreshing(true);
    setTicketError("");
    const [all, open] = await Promise.all([
      supabase.from("support_tickets").select("id", { count: "exact", head: true }),
      supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
    ]);
    if (all.error || open.error) {
      setTicketCount(null);
      setOpenCount(null);
      setTicketError(all.error?.message || open.error?.message || "Could not load ticket totals.");
    } else {
      setTicketCount(all.count ?? 0);
      setOpenCount(open.count ?? 0);
    }
    setRefreshing(false);
  }

  useEffect(() => { if (isAdmin) loadTicketStats(); }, [isAdmin]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  if (checking) return <main style={{ minHeight: "100vh", background: "#101218", color: "#fff", display: "grid", placeItems: "center" }}>Checking administrator access…</main>;
  if (!isAdmin) return (
    <main style={{ minHeight: "100vh", background: "#101218", color: "#f2f4fa", display: "grid", placeItems: "center", padding: 20 }}>
      <section style={{ ...panelStyle, maxWidth: 460, textAlign: "center" }}>
        <ShieldCheck size={34} color="#aebaff" />
        <p style={{ color: "#aebaff", fontSize: 10, letterSpacing: ".16em", fontWeight: 800 }}>VELDORAMC CONTROL CENTER</p>
        <h1 style={{ fontSize: 28, margin: "10px 0" }}>Admin access only.</h1>
        <p style={muted}>{userEmail ? "Your current session does not contain the required Supabase administrator role. Sign out and back in after the role has been updated." : "Sign in with your authorized administrator account to continue."}</p>
        <button style={buttonStyle} onClick={() => navigate("/login", { state: { from: "/admin" } })}>Go to sign in</button>
        <p><a style={{ color: "#aebaff" }} href="/">Return to VeldoraMC</a></p>
      </section>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#101218", color: "#f2f4fa", fontFamily: "Inter,system-ui,sans-serif" }}>
      <header style={{ minHeight: 72, borderBottom: "1px solid #292e39", background: "#151820", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px clamp(16px,4vw,56px)", flexWrap: "wrap" }}>
        <Link to="/admin" style={{ color: "#f2f4fa", textDecoration: "none", fontWeight: 900, letterSpacing: ".08em" }}>VELDORA<span style={{ color: "#aebaff" }}>MC</span> <span style={{ color: "#929bad", fontSize: 10 }}>CONTROL CENTER</span></Link>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          <Link to="/admin/tickets" style={buttonStyle}><Ticket size={15}/> Support tickets {openCount !== null ? `(${openCount} open)` : ""}</Link>
          <Link to="/admin/news" style={buttonStyle}><FileText size={15}/> News & announcements</Link>
          <Link to="/admin/store" style={buttonStyle}><ShoppingBag size={15}/> Manage store</Link>
          <button style={buttonStyle} onClick={loadTicketStats} disabled={refreshing}><RefreshCw size={15}/> {refreshing ? "Refreshing…" : "Refresh"}</button>
          <button style={buttonStyle} onClick={signOut}><LogOut size={15}/> Sign out</button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(20px,4vw,42px) clamp(14px,3vw,28px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 18, flexWrap: "wrap", marginBottom: 25 }}>
          <div>
            <p style={{ color: "#aebaff", fontSize: 10, fontWeight: 800, letterSpacing: ".16em", margin: "0 0 9px" }}>ADMIN WORKSPACE</p>
            <h1 style={{ fontSize: "clamp(28px,4vw,38px)", letterSpacing: "-.04em", margin: 0 }}>Control center</h1>
            <p style={muted}>Real records only. No sample orders, invented revenue, or placeholder player statistics.</p>
          </div>
          <div style={{ ...muted, display: "flex", alignItems: "center", gap: 8 }}><Activity size={15}/> Signed in as {userEmail || "administrator"}</div>
        </div>

        {ticketError && <div role="alert" style={{ ...panelStyle, borderColor: "#a95d68", color: "#ffd5dc", marginBottom: 18 }}>Ticket statistics unavailable: {ticketError}. You can still open the ticket inbox to inspect the exact database error.</div>}

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,250px),1fr))", gap: 14, marginBottom: 18 }}>
          <article style={panelStyle}>
            <Ticket size={20} color="#aebaff"/>
            <p style={muted}>Support tickets in database</p>
            <div style={{ fontSize: 32, fontWeight: 850 }}>{ticketCount === null ? "—" : ticketCount}</div>
            <p style={muted}>Count is fetched from Supabase; no sample numbers.</p>
            <Link to="/admin/tickets" style={buttonStyle}>View and reply <ArrowUpRight size={15}/></Link>
          </article>
          <article style={panelStyle}>
            <LifeBuoy size={20} color="#8ee0ad"/>
            <p style={muted}>Open support tickets</p>
            <div style={{ fontSize: 32, fontWeight: 850 }}>{openCount === null ? "—" : openCount}</div>
            <p style={muted}>Live count of tickets with status “open”.</p>
            <Link to="/admin/tickets" style={buttonStyle}>Open inbox <ArrowUpRight size={15}/></Link>
          </article>
          <article style={panelStyle}>
            <ShoppingBag size={20} color="#f1c47a"/>
            <p style={muted}>Purchases and invoices</p>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 13 }}>Payment system not connected</div>
            <p style={muted}>The current checkout is a preview and does not create paid orders. No fake invoices are shown.</p>
          </article>
        </section>

        <section style={{ ...panelStyle, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}><FileText size={20} color="#aebaff"/><h2 style={{ margin: 0, fontSize: 18 }}>Purchases & invoices</h2></div>
          <div style={{ ...muted, marginTop: 15, padding: 20, border: "1px dashed #3a4050", borderRadius: 10, textAlign: "center" }}>
            <ShoppingBag size={25} style={{ margin: "0 auto 10px", opacity: .8 }}/>
            <b style={{ display: "block", color: "#e9ecf5", marginBottom: 6 }}>No verified purchase records available</b>
            This website’s checkout currently states that Paymenter is not connected. An invoice list can only show genuine purchases after a payment provider and a verified payment webhook/database table are configured.
          </div>
        </section>

        <section style={panelStyle}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}><Users size={20} color="#aebaff"/><h2 style={{ margin: 0, fontSize: 18 }}>Player and revenue statistics</h2></div>
          <p style={muted}>Hidden until connected to verified database records. The old demo player totals, revenue charts, delivery queue and sample orders have been removed.</p>
        </section>

        <footer style={{ ...muted, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 24, fontSize: 11 }}>
          <span>© {new Date().getFullYear()} VeldoraMC Control Center</span>
          <span><ShieldCheck size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 5 }}/>Supabase administrator session</span>
        </footer>
      </div>
    </main>
  );
}
