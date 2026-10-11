import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, Pencil, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
import { supabase } from "../lib/supabase";

const blank = { title: "", image: "", category: "Announcement", excerpt: "", content: "", published: true };
const styles = `
.an-wrap{max-width:1180px;margin:auto;padding:30px 18px;color:#f2f4fa;font:14px Inter,system-ui,sans-serif}.an-top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:28px}.an-wrap h1{font-size:clamp(26px,4vw,38px);letter-spacing:-.04em;margin:8px 0}.an-wrap p{color:#9ba4b6;line-height:1.65}.an-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid #393f50;background:#202531;color:#f2f4fa;border-radius:9px;padding:10px 13px;font-weight:750;font-size:12px;cursor:pointer;text-decoration:none}.an-primary{background:linear-gradient(135deg,#b6c0ff,#8e9eff);color:#121522;border-color:#c2caff}.an-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px}.an-card{background:#171a22;border:1px solid #2b303b;border-radius:13px;padding:18px;min-width:0}.an-post{display:grid;grid-template-columns:100px minmax(0,1fr);gap:13px;padding:12px 0;border-bottom:1px solid #ffffff10}.an-post img{width:100px;height:76px;object-fit:cover;border-radius:8px;background:#222}.an-post h3{margin:2px 0 5px;font-size:14px;overflow-wrap:anywhere}.an-post p{font-size:11px;margin:0}.an-fields{display:grid;gap:12px}.an-fields label{display:grid;gap:6px;font-size:11px;font-weight:750;color:#cbd2e4}.an-fields input,.an-fields textarea,.an-fields select{width:100%;min-width:0;border:1px solid #343b4a;border-radius:8px;background:#10131a;color:#f4f5fa;padding:11px;font:13px/1.5 Inter,system-ui,sans-serif}.an-fields textarea{resize:vertical}.an-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.an-alert{padding:12px;border-radius:9px;background:#392126;border:1px solid #81424d;color:#ffd5dc;margin:12px 0;font-size:12px}.an-ok{padding:12px;border-radius:9px;background:#142b23;border:1px solid #2d7055;color:#a9f3c8;margin:12px 0;font-size:12px}.an-preview{width:100%;max-height:190px;object-fit:cover;border-radius:9px;margin-top:8px}.an-empty{padding:20px;border:1px dashed #3b4150;border-radius:9px;color:#9ba4b6;font-size:12px}@media(max-width:800px){.an-grid{grid-template-columns:1fr}.an-post{grid-template-columns:82px minmax(0,1fr)}.an-post img{width:82px;height:70px}}
`;

export default function AdminNews() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({data}) => {
      if (!alive) return;
      setAdmin(data?.session?.user?.app_metadata?.role === "admin");
      setChecking(false);
    }).catch(() => alive && setChecking(false));
    const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => {
      setAdmin(session?.user?.app_metadata?.role === "admin");
      setChecking(false);
    });
    return () => { alive = false; listener?.subscription?.unsubscribe(); };
  }, []);

  async function refresh() {
    setLoading(true); setError("");
    const {data,error:e} = await supabase.from("news_posts").select("*").order("created_at",{ascending:false});
    if (e) setError(e.message);
    else setPosts(data || []);
    setLoading(false);
  }
  useEffect(() => { if (admin) refresh(); }, [admin]);

  function startEdit(post) {
    setEditing(post.id);
    setForm({title:post.title||"",image:post.image||"",category:post.category||"Announcement",excerpt:post.excerpt||"",content:post.content||"",published:post.published ?? true});
    setError(""); setNotice("");
  }
  function newPost() { setEditing(null); setForm(blank); setError(""); setNotice(""); }
  function update(key,value) { setForm(old=>({...old,[key]:value})); }

  async function save(event) {
    event.preventDefault(); setError(""); setNotice("");
    const title = form.title.trim();
    if (!title) return setError("Enter a title.");
    const slug = title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || `announcement-${Date.now()}`;
    const payload = {...form,title,slug,image:form.image.trim(),excerpt:form.excerpt.trim(),content:form.content.trim(),updated_at:new Date().toISOString()};
    const result = editing
      ? await supabase.from("news_posts").update(payload).eq("id",editing)
      : await supabase.from("news_posts").insert(payload);
    if (result.error) setError(result.error.message);
    else { setNotice(editing ? "Announcement updated." : "Announcement created."); newPost(); await refresh(); }
  }

  async function remove(post) {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setError(""); setNotice("");
    const {error:e} = await supabase.from("news_posts").delete().eq("id",post.id);
    if (e) setError(e.message);
    else { setPosts(old=>old.filter(p=>p.id!==post.id)); if(editing===post.id)newPost(); setNotice("Announcement deleted."); }
  }

  if (checking) return <main style={{minHeight:"100vh",background:"#101218",color:"#fff",display:"grid",placeItems:"center"}}>Checking admin access…</main>;
  if (!admin) return <main style={{minHeight:"100vh",background:"#101218",color:"#f2f4fa",display:"grid",placeItems:"center",padding:20}}><section className="an-card"><h1>Admin access only</h1><p>Sign in with your authorized administrator account.</p><button className="an-btn" onClick={()=>navigate("/login",{state:{from:"/admin/news"}})}>Go to sign in</button></section><style>{styles}</style></main>;

  return <main style={{minHeight:"100vh",background:"#101218"}}><style>{styles}</style><div className="an-wrap">
    <div className="an-top"><div><Link to="/admin" className="an-btn"><ArrowLeft size={14}/> Control center</Link><h1>News & announcements</h1><p>Create posts with pictures and manage what appears on the public News page and homepage.</p></div><div className="an-actions"><button className="an-btn" onClick={refresh} disabled={loading}><RefreshCw size={14}/>{loading?"Loading…":"Refresh"}</button><button className="an-btn an-primary" onClick={newPost}><Plus size={15}/> New announcement</button></div></div>
    {error&&<div className="an-alert" role="alert">{error}</div>}{notice&&<div className="an-ok" role="status">{notice}</div>}
    <div className="an-grid">
      <section className="an-card"><h2 style={{fontSize:16,marginTop:0}}>Published and draft posts <span style={{color:"#aebaff"}}>({posts.length})</span></h2>{posts.length===0?<div className="an-empty">No admin-created posts yet. Create one here; posts marked published appear on the public News page.</div>:posts.map(post=><article className="an-post" key={post.id}><img src={post.image||"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='76'%3E%3Crect width='100%25' height='100%25' fill='%23222'/%3E%3C/svg%3E"} alt="" onError={e=>{e.currentTarget.style.visibility="hidden"}}/><div><h3>{post.title}</h3><p>{post.category} · {post.published?"Published":"Draft"}</p><div className="an-actions"><button className="an-btn" onClick={()=>startEdit(post)}><Pencil size={13}/> Edit</button><button className="an-btn" onClick={()=>remove(post)}><Trash2 size={13}/> Delete</button></div></div></article>)}</section>
      <section className="an-card"><h2 style={{fontSize:16,marginTop:0}}>{editing?"Edit announcement":"Create announcement"}</h2><form className="an-fields" onSubmit={save}>
        <label>Title<input value={form.title} onChange={e=>update("title",e.target.value)} maxLength={120} required placeholder="Season update, event, maintenance…"/></label>
        <label>Image URL<input value={form.image} onChange={e=>update("image",e.target.value)} placeholder="https://…/image.jpg"/>{form.image&&<img className="an-preview" src={form.image} alt="Image preview" onError={e=>{e.currentTarget.style.display="none"}} onLoad={e=>{e.currentTarget.style.display="block"}}/>}</label>
        <label>Category<select value={form.category} onChange={e=>update("category",e.target.value)}><option>Announcement</option><option>Update</option><option>Event</option><option>Community</option><option>Maintenance</option></select></label>
        <label>Short summary<textarea value={form.excerpt} onChange={e=>update("excerpt",e.target.value)} rows={3} maxLength={400} placeholder="A short preview for the cards…"/></label>
        <label>Full article<textarea value={form.content} onChange={e=>update("content",e.target.value)} rows={8} placeholder="Write your full announcement here. Separate paragraphs with a blank line."/></label>
        <label style={{display:"flex",alignItems:"center",gap:9}}><input type="checkbox" checked={form.published} onChange={e=>update("published",e.target.checked)} style={{width:16}}/> Publish on the public site</label>
        <div className="an-actions"><button className="an-btn an-primary" type="submit"><Save size={14}/>{editing?"Save changes":"Publish announcement"}</button>{editing&&<button className="an-btn" type="button" onClick={newPost}><X size={14}/> Cancel edit</button>}</div>
      </form></section>
    </div>
  </div></main>;
}
