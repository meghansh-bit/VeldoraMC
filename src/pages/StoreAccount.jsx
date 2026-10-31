import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useSeo } from "../hooks/useSeo";

export default function StoreAccount() {
  const { user, status, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useSeo({ title: "Store Account", description: "Sign in or create your VeldoraMC store account.", path: "/store/account", noindex: true });

  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      if (mode === "login") await signIn(email.trim(), password);
      else {
        const result = await signUp(email.trim(), password);
        if (!result.session) setNotice("Account created. Check your email for the confirmation link before signing in.");
      }
    } catch (e) { setError(e.message || "We couldn't complete that request. Please try again."); }
    finally { setBusy(false); }
  }

  if (status === "loading") return <main className="vstore-account-page"><div className="vstore-account-card">Checking your store session…</div></main>;
  if (user) return <main className="vstore-account-page"><section className="vstore-account-card"><span className="vstore-account-icon"><CheckCircle2 size={25}/></span><span className="vstore-kicker">VELDORAMC STORE ACCOUNT</span><h1>You're signed <em>in.</em></h1><p>Your store session is active for <b>{user.email}</b>.</p><div className="vstore-account-actions"><Link className="vstore-primary" to="/store">Continue to store <ArrowRight size={16}/></Link><button className="vstore-secondary" onClick={async()=>{await signOut();}}>Sign out</button></div></section></main>;

  return <main className="vstore-account-page"><Link to="/store" className="vstore-account-back"><ArrowLeft size={15}/> Back to store</Link><section className="vstore-account-card"><span className="vstore-account-icon"><UserRound size={25}/></span><span className="vstore-kicker">YOUR VELDORAMC ACCOUNT</span><h1>{mode === "login" ? <>Welcome <em>back.</em></> : <>Create your <em>account.</em></>}</h1><p>Sign in to keep your store experience connected across visits.</p><div className="vstore-auth-tabs"><button className={mode === "login" ? "active" : ""} onClick={()=>{setMode("login");setError("");setNotice("");}}>Sign in</button><button className={mode === "signup" ? "active" : ""} onClick={()=>{setMode("signup");setError("");setNotice("");}}>Create account</button></div><form className="vstore-auth-form" onSubmit={submit}><label>Email address<span><Mail size={15}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" required/></span></label><label>Password<span><LockKeyhole size={15}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} placeholder="At least 6 characters" required/></span></label>{error && <p className="vstore-auth-error" role="alert">{error}</p>}{notice && <p className="vstore-auth-notice" role="status">{notice}</p>}<button className="vstore-primary vstore-auth-submit" disabled={busy}>{busy ? "PLEASE WAIT…" : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"} <ArrowRight size={16}/></button></form><div className="vstore-auth-foot"><ShieldCheck size={15}/> Secure account sign-in powered by Supabase Auth.</div></section></main>;
}
