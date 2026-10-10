import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Gamepad2, LockKeyhole, Mail, Eye, EyeOff } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import { supabase } from "../lib/supabase";

function MicrosoftMark({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path fill="#f25022" d="M1 1h10v10H1z"/><path fill="#7fba00" d="M13 1h10v10H13z"/><path fill="#00a4ef" d="M1 13h10v10H1z"/><path fill="#ffb900" d="M13 13h10v10H13z"/></svg>;
}

export default function Login() {
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  useSeo({ title: mode === "login" ? "Login" : "Create Account", path: "/login", noindex: true });

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    if (password.length < 6) {
      setError("Your password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin + "/profiles" }
        });
        if (authError) throw authError;
        if (data.session) {
          navigate("/profiles");
        } else {
          setNotice("Account created. Check your email for a confirmation link, then sign in.");
          setMode("login");
          setPassword("");
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        if (authError) throw authError;
        navigate("/profiles");
      }
    } catch (authError) {
      setError(authError?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return <section className="portal-page login-page"><div className="portal-inner login-inner">
    <Link to="/" className="login-back"><ArrowLeft size={16}/> Back to VeldoraMC</Link>
    <div className="login-panel">
      <div className="portal-icon"><LockKeyhole size={30}/></div>
      <div className="section-kicker">PLAYER ACCOUNT ACCESS</div>
      <h1>{mode === "login" ? "LOGIN" : "CREATE ACCOUNT"}<span>.</span></h1>
      <p>{mode === "login" ? "Sign in to your VeldoraMC account to continue to your player profile." : "Create an account with your email to get started."}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-6">
        <label className="flex flex-col gap-2 text-sm">
          <span>Email address</span>
          <span className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3">
            <Mail size={17} aria-hidden="true"/>
            <input className="w-full bg-transparent py-3 outline-none" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          </span>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Password</span>
          <span className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3">
            <input className="w-full bg-transparent py-3 outline-none" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" minLength={6} required />
            <button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Hide password" : "Show password"} className="opacity-75">{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button>
          </span>
        </label>
        {error && <div role="alert" className="security-note mt-2"><LockKeyhole size={20}/><div><b>Couldn't continue</b><small>{error}</small></div></div>}
        {notice && <div role="status" className="security-note mt-2"><Mail size={20}/><div><b>Check your email</b><small>{notice}</small></div></div>}
        <button type="submit" disabled={loading} className="vbtn vbtn-primary w-full justify-center mt-2">
          {loading ? "PLEASE WAIT..." : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">{mode === "login" ? "New to VeldoraMC?" : "Already have an account?"}{" "}
        <button type="button" className="underline underline-offset-4" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setNotice(""); }}>
          {mode === "login" ? "Create an account" : "Sign in"}
        </button>
      </p>

      <div className="security-note mt-5"><ShieldCheck size={22}/><div><b>Security first</b><small>Your password is handled by Supabase Authentication and is not stored in this website's code.</small></div></div>
      <div className="flex flex-col gap-3 mt-5">
        <button type="button" className="vbtn w-full justify-center" style={{ background: "rgba(255,255,255,.055)", border: "1px solid rgba(255,255,255,.16)", color: "#f3f4f6" }} onClick={() => setNotice("Microsoft sign-in still needs Microsoft OAuth to be configured in Supabase.")}>
          <MicrosoftMark size={19}/> Login with Microsoft
        </button>
        <button type="button" className="vbtn w-full justify-center" style={{ background: "rgba(255,255,255,.055)", border: "1px solid rgba(255,255,255,.16)", color: "#f3f4f6" }} onClick={() => setNotice("Minecraft Java/Bedrock account linking is not configured yet. Use email sign-in for now.")}>
          <Gamepad2 size={19}/> Minecraft Account Linking
        </button>
      </div>
      <Link to="/" className="vbtn w-full justify-center mt-4">BACK TO HOME <ArrowLeft size={15}/></Link>
    </div>
  </div></section>;
}
