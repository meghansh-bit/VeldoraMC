import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
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
  useSeo({ title: "Email Login", description: "Sign in or create your VeldoraMC store account.", path: "/store/account", noindex: true });

  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      if (mode === "login") {
        await signIn(email.trim(), password);
      } else {
        const result = await signUp(email.trim(), password);
        if (!result.session) setNotice("We've sent a confirmation link to your email. Open it to verify your account and finish signing in.");
      }
    } catch (e) {
      setError(e.message || "We couldn't complete that request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") return <main className="vstore-account-page"><div className="vstore-account-card">Checking your account…</div></main>;

  if (user) return (
    <main className="vstore-account-page">
      <section className="vstore-account-card vstore-account-success">
        <span className="vstore-account-icon"><CheckCircle2 size={27}/></span>
        <span className="vstore-kicker">VELDORAMC ACCOUNT</span>
        <h1>Congratulations, <em>you're logged in!</em></h1>
        <p>Your email <b>{user.email}</b> is now signed in. You're ready to explore the store.</p>
        <div className="vstore-account-actions">
          <Link className="vstore-primary" to="/">Checkout our plans now <ArrowRight size={16}/></Link>
          <button className="vstore-secondary" onClick={async () => { await signOut(); }}>Sign out</button>
        </div>
      </section>
    </main>
  );

  return (
    <main className="vstore-account-page">
      <Link to="/" className="vstore-account-back">← Back to store</Link>
      <section className="vstore-account-card">
        <span className="vstore-account-icon"><UserRound size={25}/></span>
        <span className="vstore-kicker">YOUR VELDORAMC ACCOUNT</span>
        <h1>{mode === "login" ? <>Welcome <em>back.</em></> : <>Create your <em>account.</em></>}</h1>
        <p>{mode === "login" ? "Enter your email and password to continue." : "Create an account and confirm your email to get started."}</p>
        <div className="vstore-auth-tabs">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); setNotice(""); }}>Sign in</button>
          <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setError(""); setNotice(""); }}>Create account</button>
        </div>
        <form className="vstore-auth-form" onSubmit={submit}>
          <label>Email address<input className="vstore-simple-input" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" placeholder="Enter your email address" required/></label>
          <label>Password<input className="vstore-simple-input" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} placeholder="Enter your password" required/></label>
          {error && <p className="vstore-auth-error" role="alert">{error}</p>}
          {notice && <p className="vstore-auth-notice" role="status">{notice}</p>}
          <button className="vstore-primary vstore-auth-submit" disabled={busy}>{busy ? "PLEASE WAIT…" : mode === "login" ? "LOGIN" : "CREATE ACCOUNT"} <ArrowRight size={16}/></button>
        </form>
        <div className="vstore-auth-foot"><ShieldCheck size={15}/> Secure sign-in and email confirmation powered by Supabase.</div>
      </section>
    </main>
  );
}
