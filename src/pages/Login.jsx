import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, LockKeyhole, Mail, KeyRound, ArrowRight } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useSeo({ title: "Email OTP Login", description: "Sign in to your VeldoraMC website account with a one-time email code.", path: "/login", noindex: true });

  async function sendCode(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Enter your email address first.");
      return;
    }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { shouldCreateUser: true }
      });
      if (authError) throw authError;
      setEmail(cleanEmail);
      setStep("code");
      setNotice("We've sent a sign-in code to your email. Check your inbox and spam folder.");
    } catch (authError) {
      setError(authError?.message || "Couldn't send the code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    const token = code.trim();
    if (!/^\\d{6}$/.test(token)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token,
        type: "email"
      });
      if (authError) throw authError;
      navigate("/profiles");
    } catch (authError) {
      setError(authError?.message || "That code didn't work. Request a new one and try again.");
    } finally {
      setLoading(false);
    }
  }

  return <section className="portal-page login-page"><div className="portal-inner login-inner">
    <Link to="/" className="login-back"><ArrowLeft size={16}/> Back to VeldoraMC</Link>
    <div className="login-panel">
      <div className="portal-icon">{step === "email" ? <LockKeyhole size={30}/> : <KeyRound size={30}/>}</div>
      <div className="section-kicker">PLAYER ACCOUNT ACCESS</div>
      <h1>{step === "email" ? "LOGIN WITH OTP" : "CHECK YOUR EMAIL"}<span>.</span></h1>
      <p>{step === "email" ? "Enter your email and we'll send you a one-time sign-in code. No password to remember." : <>Enter the 6-digit code sent to <strong>{email}</strong>.</>}</p>

      {step === "email" ? <form onSubmit={sendCode} className="flex flex-col gap-3 mt-6">
        <label className="flex flex-col gap-2 text-sm">
          <span>Email address</span>
          <span className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3">
            <Mail size={17} aria-hidden="true"/>
            <input className="w-full bg-transparent py-3 outline-none" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required />
          </span>
        </label>
        {error && <div role="alert" className="security-note mt-2"><LockKeyhole size={20}/><div><b>Couldn't continue</b><small>{error}</small></div></div>}
        {notice && <div role="status" className="security-note mt-2"><Mail size={20}/><div><b>Check your email</b><small>{notice}</small></div></div>}
        <button type="submit" disabled={loading} className="vbtn vbtn-primary w-full justify-center mt-2">{loading ? "SENDING CODE..." : "SEND LOGIN CODE"} <ArrowRight size={16}/></button>
      </form> : <form onSubmit={verifyCode} className="flex flex-col gap-3 mt-6">
        <label className="flex flex-col gap-2 text-sm">
          <span>6-digit email code</span>
          <span className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3">
            <KeyRound size={17} aria-hidden="true"/>
            <input className="w-full bg-transparent py-3 tracking-[.35em] outline-none" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={event => setCode(event.target.value.replace(/\\D/g, "").slice(0, 6))} placeholder="123456" required />
          </span>
        </label>
        {error && <div role="alert" className="security-note mt-2"><LockKeyhole size={20}/><div><b>Couldn't verify</b><small>{error}</small></div></div>}
        {notice && <div role="status" className="security-note mt-2"><Mail size={20}/><div><b>Code sent</b><small>{notice}</small></div></div>}
        <button type="submit" disabled={loading} className="vbtn vbtn-primary w-full justify-center mt-2">{loading ? "VERIFYING..." : "VERIFY & SIGN IN"} <ArrowRight size={16}/></button>
        <button type="button" disabled={loading} className="w-full py-2 text-sm text-white/65 underline underline-offset-4" onClick={() => { setStep("email"); setCode(""); setError(""); setNotice(""); }}>Use a different email</button>
        <button type="button" disabled={loading} className="w-full py-2 text-sm text-cyan-200 underline underline-offset-4" onClick={sendCode}>Send a new code</button>
      </form>}

      <div className="security-note mt-5"><ShieldCheck size={22}/><div><b>Secure and separate</b><small>This signs you into the VeldoraMC website only. It does not log you into or out of Minecraft.</small></div></div>
      <div className="mt-5 rounded-lg border border-cyan-300/15 bg-cyan-300/5 p-4 text-sm text-white/65">
        <b className="text-cyan-100">Want to link Minecraft?</b>
        <p className="mt-1">After signing in, open Link Minecraft to connect your in-game identity. Linking is optional.</p>
        <Link to="/link-minecraft" className="mt-3 inline-flex items-center gap-2 font-semibold text-cyan-200">Link Minecraft <ArrowRight size={15}/></Link>
      </div>
      <Link to="/" className="vbtn w-full justify-center mt-4">BACK TO HOME <ArrowLeft size={15}/></Link>
    </div>
  </div></section>;
}
