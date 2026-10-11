import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Gamepad2, KeyRound, Link2, Mail, ShieldCheck, RefreshCw, Copy } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import { supabase } from "../lib/supabase";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/minecraft-link`;

export default function LinkMinecraft() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [expiresAt, setExpiresAt] = useState(0);
  const [linked, setLinked] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [remaining, setRemaining] = useState(0);
  useSeo({ title: "Link Minecraft", description: "Securely link your VeldoraMC website profile to your in-game Minecraft identity.", path: "/link-minecraft", noindex: true });

  const callFunction = useCallback(async (action) => {
    const { data: { session: activeSession } } = await supabase.auth.getSession();
    if (!activeSession) throw new Error("Sign in with email OTP first.");
    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${activeSession.access_token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      body: JSON.stringify({ action })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "The linking service could not complete the request.");
    return payload;
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      const status = await callFunction("status");
      setLinked(status.linked || null);
    } catch (e) {
      setError(e.message || "Could not load link status.");
    }
  }, [callFunction]);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session) await refreshStatus();
      if (active) setChecking(false);
    }).catch(() => { if (active) setChecking(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) refreshStatus();
      else { setLinked(null); setCode(""); }
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [refreshStatus]);

  useEffect(() => {
    if (!expiresAt) { setRemaining(0); return; }
    const tick = () => setRemaining(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  async function generateCode() {
    setLoading(true); setError(""); setNotice(""); setCode("");
    try {
      const result = await callFunction("generate");
      setCode(result.code);
      setExpiresAt(Date.now() + result.expiresInSeconds * 1000);
      setNotice("Code created. Join the server and enter it with /link before it expires.");
    } catch (e) { setError(e.message || "Could not generate a code."); }
    finally { setLoading(false); }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setNotice("Code copied. Enter /link " + code + " in Minecraft.");
    } catch { setNotice("Your code is " + code + ". Enter /link " + code + " in Minecraft."); }
  }

  const actionClass = "vbtn vbtn-primary mt-4 w-full justify-center";
  return <main className="portal-page">
    <div className="portal-glow" />
    <div className="portal-inner">
      <div className="section-kicker">PLAYER ACCOUNT / LINKING</div>
      <div className="portal-heading"><div className="portal-icon"><Link2 size={29}/></div><h1>LINK MINECRAFT<span>.</span><br/><span>ONE PROFILE. YOUR LEGACY.</span></h1></div>
      <p className="portal-intro">Link the Minecraft identity currently connected to the server with a short-lived, one-time code. Never share the code with anyone.</p>

      <section className="relative mt-6 overflow-hidden rounded-xl border border-cyan-300/20 bg-[#11131c] p-5 sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-violet-400/10"/>
        <div className="relative">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Gamepad2 size={24}/></div><div><div className="text-[10px] font-bold tracking-[.2em] text-cyan-200/70">OPTIONAL ACCOUNT LINK</div><h2 className="text-xl font-extrabold text-white">Connect your player profile</h2></div></div>
          {checking ? <p className="mt-5 text-sm text-white/55">Checking your website session…</p> : session ? <div className="mt-5 rounded-lg border border-emerald-300/20 bg-emerald-300/5 p-4"><div className="flex items-center gap-2 text-emerald-200"><CheckCircle2 size={18}/><b>Website account signed in</b></div><p className="mt-2 text-sm text-white/65">Your email stays private. Only your verified Minecraft username is shown on your player profile.</p></div> : <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4"><p className="text-sm text-white/70">Sign in with email OTP first. Public pages remain available without signing in.</p><Link to="/login" className={actionClass}><Mail size={17}/> SIGN IN WITH EMAIL OTP <ArrowRight size={16}/></Link></div>}

          {session && <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 sm:p-5">
            {linked ? <><div className="flex items-center gap-2 text-emerald-200"><CheckCircle2 size={20}/><b>Minecraft account linked</b></div><div className="mt-4 flex items-center gap-3"><img src={`https://mc-heads.net/avatar/${encodeURIComponent(linked.minecraft_username)}/48`} alt="" width="48" height="48" className="rounded-lg" /><div><b className="text-white">{linked.minecraft_username}</b><p className="text-xs uppercase tracking-widest text-white/45">{linked.edition} edition · verified in-game</p></div></div><button className="vbtn mt-4 w-full justify-center" onClick={refreshStatus}><RefreshCw size={16}/> REFRESH LINK STATUS</button></> :
              <><div className="flex items-center gap-2 text-cyan-100"><KeyRound size={19}/><b>1. Generate a one-time code</b></div><p className="mt-2 text-sm leading-6 text-white/60">The code expires in 5 minutes and can only be used once. Generate a new code if it expires.</p>
              {code && remaining > 0 && <div className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/5 p-4 text-center"><div className="text-xs font-bold tracking-[.2em] text-cyan-100/70">YOUR LINK CODE</div><div className="my-3 font-mono text-3xl font-black tracking-[.22em] text-white">{code}</div><div className="text-xs text-white/55">Expires in {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2,"0")}</div><button onClick={copyCode} className="vbtn mt-3 w-full justify-center"><Copy size={16}/> COPY CODE</button></div>}
              {code && remaining === 0 && <p className="mt-3 text-sm text-amber-200">This code has expired. Generate a new one.</p>}
              <button disabled={loading} onClick={generateCode} className={actionClass}><KeyRound size={16}/>{loading ? " GENERATING..." : code && remaining > 0 ? " GENERATE NEW CODE" : " GENERATE LINK CODE"} <ArrowRight size={16}/></button>
              <div className="mt-5 flex items-start gap-3 rounded-lg border border-white/10 bg-white/[.025] p-4"><Gamepad2 size={20} className="mt-0.5 shrink-0 text-violet-200"/><div><b className="text-white">2. Redeem it in-game</b><p className="mt-1 text-sm leading-6 text-white/60">Join VeldoraMC and enter <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-100">/link YOURCODE</code>. After the server confirms it, check the status below.</p></div></div><button type="button" onClick={refreshStatus} className="vbtn mt-3 w-full justify-center"><RefreshCw size={16}/> I'VE LINKED IN-GAME — REFRESH STATUS</button></>}
          </div>}
          {error && <div role="alert" className="mt-4 rounded-lg border border-red-300/20 bg-red-300/5 p-3 text-sm text-red-100">{error}</div>}
          {notice && <div role="status" className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/5 p-3 text-sm text-cyan-100">{notice}</div>}
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-white/10 bg-[#11131c] p-5"><ShieldCheck size={23} className="text-cyan-200"/><h3 className="mt-3 font-bold text-white">One-time verification</h3><p className="mt-2 text-sm leading-6 text-white/50">Codes expire after five minutes and are stored hashed, not as plain text.</p></article>
        <article className="rounded-xl border border-white/10 bg-[#11131c] p-5"><Gamepad2 size={23} className="text-violet-200"/><h3 className="mt-3 font-bold text-white">Cracked Java support</h3><p className="mt-2 text-sm leading-6 text-white/50">The server checks the player currently connected. Offline-mode names can be impersonated, so this does not prove permanent ownership of a name.</p></article>
        <article className="rounded-xl border border-white/10 bg-[#11131c] p-5"><Link2 size={23} className="text-emerald-200"/><h3 className="mt-3 font-bold text-white">Private by design</h3><p className="mt-2 text-sm leading-6 text-white/50">Your website email is never sent to the Minecraft server or shown as your player name.</p></article>
      </div>
      <div className="portal-bottom"><div><h2>YOUR STATS. YOUR LEGACY.</h2><p>Verified profiles can show your linked Minecraft username after server integration is configured.</p></div><Link className="vbtn vbtn-primary" to="/profiles">VIEW PROFILES <ArrowRight size={16}/></Link></div>
    </div>
  </main>;
}
