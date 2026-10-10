import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Gamepad2, KeyRound, Link2, Mail, ShieldCheck } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import { supabase } from "../lib/supabase";

export default function LinkMinecraft() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [method, setMethod] = useState("code");
  useSeo({ title: "Link Minecraft", description: "Link your VeldoraMC website profile using email verification or an in-game code.", path: "/link-minecraft", noindex: true });

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setChecking(false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const actionClass = "vbtn vbtn-primary mt-4 w-full justify-center";
  return <main className="portal-page">
    <div className="portal-glow" />
    <div className="portal-inner">
      <div className="section-kicker">PLAYER ACCOUNT / LINKING</div>
      <div className="portal-heading">
        <div className="portal-icon"><Link2 size={29}/></div>
        <h1>LINK MINECRAFT<span>.</span><br/><span>ONE PROFILE. YOUR LEGACY.</span></h1>
      </div>
      <p className="portal-intro">Choose how you'd like to verify your VeldoraMC player identity. Linking is optional and does not sign you out of Minecraft.</p>

      <section className="relative mt-6 overflow-hidden rounded-xl border border-cyan-300/20 bg-[#11131c] p-5 sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-violet-400/10"/>
        <div className="relative">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Gamepad2 size={24}/></div><div><div className="text-[10px] font-bold tracking-[.2em] text-cyan-200/70">OPTIONAL ACCOUNT LINK</div><h2 className="text-xl font-extrabold text-white">Connect your player profile</h2></div></div>
          {checking ? <p className="mt-5 text-sm text-white/55">Checking your website session…</p> : session ? <div className="mt-5 rounded-lg border border-emerald-300/20 bg-emerald-300/5 p-4"><div className="flex items-center gap-2 text-emerald-200"><CheckCircle2 size={18}/><b>Website account signed in</b></div><p className="mt-2 break-all text-sm text-white/65">{session.user.email}</p></div> : <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4"><p className="text-sm text-white/70">Sign in with email OTP first. You can still browse public profiles and leaderboards without signing in.</p><Link to="/login" className={actionClass}><Mail size={17}/> SIGN IN WITH EMAIL OTP <ArrowRight size={16}/></Link></div>}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button type="button" onClick={() => setMethod("email")} className={"rounded-xl border p-4 text-left transition-all " + (method === "email" ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-black/15 hover:border-white/25")}>
              <div className="flex items-center gap-3"><Mail size={22} className="text-cyan-200"/><b className="text-white">Email verification</b></div>
              <p className="mt-2 text-sm leading-6 text-white/55">Confirm the email on your website account. Useful as an account-security step, but it doesn't by itself prove you own a Minecraft username.</p>
            </button>
            <button type="button" onClick={() => setMethod("code")} className={"rounded-xl border p-4 text-left transition-all " + (method === "code" ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-black/15 hover:border-white/25")}>
              <div className="flex items-center gap-3"><KeyRound size={22} className="text-cyan-200"/><b className="text-white">In-game code</b></div>
              <p className="mt-2 text-sm leading-6 text-white/55">Generate a one-time code on the website, then enter <code>/link CODE</code> in Minecraft to prove control of the player currently online.</p>
            </button>
          </div>

          {method === "email" ? <div className="mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/5 p-4"><div className="flex items-center gap-2 text-cyan-100"><Mail size={18}/><b>Email verification selected</b></div><p className="mt-2 text-sm leading-6 text-white/65">Your website login already uses email OTP. We can use that to confirm your website account, then still require an in-game check before attaching a Minecraft username.</p><Link to="/login" className={actionClass}>VERIFY WEBSITE EMAIL <ArrowRight size={16}/></Link></div> : <div className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/5 p-4"><div className="flex items-center gap-2 text-amber-100"><KeyRound size={18}/><b>In-game code linking</b></div><p className="mt-2 text-sm leading-6 text-white/65">This is the recommended way to prove control of a cracked Java or Bedrock player identity. The code generator and Minecraft plugin/API still need to be installed, so no real code can be generated yet.</p><button type="button" disabled className="vbtn mt-4 w-full justify-center opacity-60 cursor-not-allowed">CODE GENERATION COMING NEXT</button></div>}
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-white/10 bg-[#11131c] p-5"><ShieldCheck size={23} className="text-cyan-200"/><h3 className="mt-3 font-bold text-white">Safe verification</h3><p className="mt-2 text-sm leading-6 text-white/50">Codes will expire quickly and work once. Verification must be checked server-side.</p></article>
        <article className="rounded-xl border border-white/10 bg-[#11131c] p-5"><Gamepad2 size={23} className="text-violet-200"/><h3 className="mt-3 font-bold text-white">Java and Bedrock</h3><p className="mt-2 text-sm leading-6 text-white/50">The linking service must support the server's Java and Floodgate/Bedrock identities.</p></article>
        <article className="rounded-xl border border-white/10 bg-[#11131c] p-5"><Link2 size={23} className="text-emerald-200"/><h3 className="mt-3 font-bold text-white">Optional linking</h3><p className="mt-2 text-sm leading-6 text-white/50">Website linking will not log players out of Minecraft or be required just to browse.</p></article>
      </div>
      <div className="portal-bottom"><div><h2>YOUR STATS. YOUR LEGACY.</h2><p>Once server integration is connected, linked profiles can show verified player stats.</p></div><Link className="vbtn vbtn-primary" to="/profiles">VIEW PROFILES <ArrowRight size={16}/></Link></div>
    </div>
  </main>;
}
