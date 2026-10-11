import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Ticket, RefreshCw, Send, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminTickets() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      const ok = data.session?.user?.app_metadata?.role === "admin";
      setAdmin(ok); setChecking(false);
      if (!ok && !data.session) navigate("/login");
    }).catch(() => { if (alive) setChecking(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const ok = session?.user?.app_metadata?.role === "admin";
      setAdmin(ok);
      if (!session) navigate("/login");
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, [navigate]);

  async function refresh() {
    setError("");
    const { data, error: e } = await supabase.from("support_tickets").select("id,user_id,subject,category,priority,status,created_at,updated_at").order("updated_at", { ascending: false });
    if (e) setError(e.message);
    else setTickets(data || []);
  }
  useEffect(() => { if (admin) refresh(); }, [admin]);

  async function openTicket(ticket) {
    setSelected(ticket); setMessages([]); setError(""); setNotice("");
    const { data, error: e } = await supabase.from("support_messages").select("id,ticket_id,user_id,message,created_at").eq("ticket_id", ticket.id).order("created_at", { ascending: true });
    if (e) setError(e.message); else setMessages(data || []);
  }

  async function sendReply(event) {
    event.preventDefault();
    if (!selected || !reply.trim()) return;
    setBusy(true); setError("");
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    const { error: e } = await supabase.from("support_messages").insert({ ticket_id: selected.id, user_id: user.id, message: reply.trim() });
    if (e) setError(e.message);
    else { setReply(""); await openTicket(selected); await refresh(); setNotice("Reply sent."); }
    setBusy(false);
  }

  async function setStatus(status) {
    if (!selected) return;
    setError("");
    const { error: e } = await supabase.from("support_tickets").update({ status }).eq("id", selected.id);
    if (e) setError(e.message);
    else { const updated = { ...selected, status }; setSelected(updated); setTickets(old => old.map(t => t.id === updated.id ? updated : t)); setNotice(status === "closed" ? "Ticket closed." : "Ticket reopened."); }
  }

  async function signOut() { await supabase.auth.signOut(); navigate("/login"); }

  if (checking) return <main className="at-page"><p>Checking staff access…</p></main>;
  if (!admin) return <main className="at-page"><section className="at-gate"><ShieldCheck size={35}/><h1>Admin access only</h1><p>This inbox requires the secure Supabase admin role.</p><Link to="/admin">Back to control center</Link></section></main>;

  return <main className="at-page"><header className="at-top"><Link to="/admin" className="at-back"><ArrowLeft size={16}/> Control center</Link><div><Ticket size={20}/> VELDORAMC SUPPORT INBOX</div><button onClick={signOut}><LogOut size={15}/> Sign out</button></header>
    <div className="at-wrap"><div className="at-heading"><div><span>STAFF WORKSPACE</span><h1>Support tickets</h1><p>Review player requests and reply in private threads.</p></div><button onClick={refresh}><RefreshCw size={15}/> Refresh</button></div>
      <div className="at-layout"><aside className="at-list"><h2>All tickets <span>{tickets.length}</span></h2>{tickets.length===0 ? <p className="at-muted">No tickets found, or database staff policies are not configured yet.</p> : tickets.map(t=><button key={t.id} className={selected?.id===t.id?"active":""} onClick={()=>openTicket(t)}><b>{t.subject}</b><small>#{t.id.slice(0,8)} · {t.category}</small><span><i className={t.status}/>{t.status} · {t.priority} priority</span></button>)}</aside>
        <section className="at-thread">{selected ? <><div className="at-thread-head"><div><small>TICKET #{selected.id.slice(0,8)} · {selected.category}</small><h2>{selected.subject}</h2><p>Player ID: {selected.user_id}</p></div><div className="at-status">{selected.status}</div></div><div className="at-messages">{messages.map(m=><article key={m.id}><div className="at-msg-meta"><b>{m.user_id===selected.user_id?"Player":"Staff / Support"}</b><time>{new Date(m.created_at).toLocaleString()}</time></div><p>{m.message}</p></article>)}</div>{selected.status==="open" ? <form className="at-reply" onSubmit={sendReply}><textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Write a reply to the player…" rows={3} maxLength={5000} required/><button disabled={busy||!reply.trim()}>{busy?"SENDING…":"SEND REPLY"} <Send size={15}/></button></form> : <div className="at-closed">This ticket is closed.</div>}<div className="at-actions"><button onClick={()=>setStatus(selected.status==="open"?"closed":"open")}><CheckCircle2 size={15}/>{selected.status==="open"?"Close ticket":"Reopen ticket"}</button></div></> : <div className="at-empty"><Ticket size={30}/><h2>Choose a ticket</h2><p>Select a request on the left to read the conversation and respond.</p></div>}
        {error&&<div className="at-error"><AlertCircle size={16}/>{error}</div>}{notice&&<div className="at-notice"><CheckCircle2 size={16}/>{notice}</div>}</section>
      </div>
    </div>
    <style>{`
      .at-page{min-height:100vh;background:#101218;color:#f2f4fa;font:14px Inter,system-ui,sans-serif}.at-page *{box-sizing:border-box}.at-top{height:68px;border-bottom:1px solid #292e39;display:flex;align-items:center;justify-content:space-between;padding:0 4vw;background:#151820}.at-top>div,.at-top button,.at-back,.at-heading button,.at-actions button{display:flex;align-items:center;gap:9px}.at-top>div{font-weight:800;letter-spacing:.12em;font-size:11px;color:#bac5ff}.at-top button,.at-heading button,.at-actions button{border:1px solid #363c4a;background:#1b1f29;color:#dce1ed;padding:9px 12px;border-radius:8px;cursor:pointer}.at-back{color:#b9c2d4;font-size:12px}.at-wrap{max-width:1300px;margin:auto;padding:32px 24px}.at-heading{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:22px}.at-heading>div>span,.at-thread-head small{font-size:10px;color:#a9b5ff;font-weight:800;letter-spacing:.15em}.at-heading h1{font-size:30px;letter-spacing:-.04em;margin:8px 0}.at-heading p,.at-thread-head p{color:#929bad;font-size:12px;margin:0}.at-layout{display:grid;grid-template-columns:340px minmax(0,1fr);gap:16px}.at-list,.at-thread{border:1px solid #2b303b;border-radius:12px;background:#171a22;min-width:0;overflow:hidden}.at-list{padding:14px}.at-list h2{font-size:13px;margin:5px 4px 14px;display:flex;justify-content:space-between}.at-list h2 span{color:#9daaff}.at-list>button{display:grid;gap:7px;text-align:left;width:100%;padding:13px;border-radius:9px;border:1px solid #ffffff0c;background:#11141b;color:#eef0f8;margin-bottom:7px;cursor:pointer}.at-list>button.active,.at-list>button:hover{border-color:#8294ff60;background:#8193ff12}.at-list>button b{font-size:12px;overflow-wrap:anywhere}.at-list small,.at-list>button span{font-size:10px;color:#969fb1}.at-list>button span{display:flex;align-items:center;gap:7px;text-transform:capitalize}.at-list i{width:7px;height:7px;border-radius:50%;background:#8b93a4}.at-list i.open{background:#6ce4a1}.at-muted{font-size:12px;line-height:1.7;color:#929bad;padding:8px}.at-thread{min-height:540px;display:flex;flex-direction:column}.at-thread-head{padding:22px;border-bottom:1px solid #292e39}.at-thread-head h2{font-size:20px;margin:10px 0;overflow-wrap:anywhere}.at-status{text-transform:uppercase;color:#91e9b1;font-size:10px;margin-top:13px}.at-messages{padding:22px;display:grid;align-content:start;gap:20px;flex:1}.at-messages article{border-bottom:1px solid #ffffff0b;padding-bottom:15px}.at-msg-meta{display:flex;gap:12px;flex-wrap:wrap;justify-content:space-between}.at-msg-meta b{font-size:12px}.at-msg-meta time{font-size:10px;color:#818a9e}.at-messages article p{white-space:pre-wrap;overflow-wrap:anywhere;color:#cbd1df;font:13px/1.7 system-ui,sans-serif;margin:8px 0 0}.at-reply{padding:18px;border-top:1px solid #292e39;display:grid;gap:12px}.at-reply textarea{resize:vertical;background:#0f1218;border:1px solid #353b49;border-radius:8px;padding:12px;color:#f2f4fa;font:13px/1.6 system-ui,sans-serif}.at-reply button{justify-self:end;display:flex;align-items:center;gap:8px;padding:10px 13px;border:0;border-radius:8px;background:#aab6ff;color:#111522;font-weight:800;font-size:11px;cursor:pointer}.at-reply button:disabled{opacity:.5;cursor:not-allowed}.at-actions{padding:0 18px 18px}.at-closed,.at-empty{padding:35px;text-align:center;color:#9ca6b8}.at-empty{margin:auto}.at-empty h2{color:#e8ebf4}.at-error,.at-notice{display:flex;gap:8px;align-items:flex-start;margin:0 18px 18px;padding:12px;border-radius:8px;font-size:12px;overflow-wrap:anywhere}.at-error{color:#fecdd3;background:#fb718511;border:1px solid #fb71853a}.at-notice{color:#a7f3c0;background:#70e7a10c;border:1px solid #70e7a13a}.at-gate{margin:12vh auto;max-width:400px;text-align:center;padding:35px;border:1px solid #303541;border-radius:14px;background:#191c23}.at-gate h1{font-size:24px}.at-gate p{color:#a4adbf;line-height:1.7}.at-gate a{color:#aebaff}.at-gate svg{color:#aebaff}@media(max-width:800px){.at-layout{grid-template-columns:1fr}.at-list{max-height:320px;overflow:auto}.at-thread{min-height:430px}.at-top{padding:0 14px}.at-top>div{font-size:9px}.at-back{font-size:0;gap:0}.at-wrap{padding:22px 13px}.at-heading h1{font-size:25px}}@media(max-width:430px){.at-heading{align-items:flex-start;flex-direction:column}.at-top>button{font-size:0}.at-top>button svg{width:17px;height:17px}}
    `}</style>
  </main>;
}
