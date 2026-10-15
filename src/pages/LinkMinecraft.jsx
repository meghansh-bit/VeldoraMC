import { Link } from "react-router-dom";
import { ArrowRight, Gamepad2, KeyRound, ShieldCheck } from "lucide-react";
import { useSeo } from "../hooks/useSeo";

export default function LinkMinecraft() {
  useSeo({ title: "Link Minecraft", description: "Link your VeldoraMC player identity with a code generated in-game.", path: "/link-minecraft", noindex: true });
  return <main className="portal-page">
    <div className="portal-glow" />
    <div className="portal-inner">
      <div className="section-kicker">PLAYER ACCOUNT / LINKING</div>
      <div className="portal-heading">
        <div className="portal-icon"><Gamepad2 size={29}/></div>
        <h1>MINECRAFT ACCOUNT<span>.</span><br/><span>ONE PROFILE. YOUR LEGACY.</span></h1>
      </div>
      <p className="portal-intro">Use your verified in-game identity to access your VeldoraMC website profile. No email or password required.</p>
      <section className="relative mt-6 overflow-hidden rounded-xl border border-red-300/20 bg-[#11131c] p-5 sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-violet-400/10"/>
        <div className="relative">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-300/20 bg-red-300/10 text-red-200"><KeyRound size={24}/></div><div><div className="text-[10px] font-bold tracking-[.2em] text-red-200/70">MINECRAFT-ONLY LOGIN</div><h2 className="text-xl font-extrabold text-white">Link your player profile</h2></div></div>
          <ol className="mt-6 space-y-4 text-sm leading-6 text-white/75">
            <li><b className="text-white">1. Join VeldoraMC</b><br/>Connect to the Minecraft server with the account you want to link.</li>
            <li><b className="text-white">2. Run <code>/link</code></b><br/>The server will display a six-digit code that expires in five minutes.</li>
            <li><b className="text-white">3. Enter the code</b><br/>Use the link button below. The website verifies the code against the server-generated player identity.</li>
          </ol>
          <Link to="/login" className="vbtn vbtn-primary mt-6 w-full justify-center">ENTER LINK CODE <ArrowRight size={16}/></Link>
        </div>
      </section>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-white/10 bg-[#11131c] p-5"><ShieldCheck size={23} className="text-red-200"/><h3 className="mt-3 font-bold text-white">One-time codes</h3><p className="mt-2 text-sm leading-6 text-white/50">Codes expire quickly and must be consumed only once.</p></article>
        <article className="rounded-xl border border-white/10 bg-[#11131c] p-5"><Gamepad2 size={23} className="text-violet-200"/><h3 className="mt-3 font-bold text-white">Verified identity</h3><p className="mt-2 text-sm leading-6 text-white/50">The UUID comes from the server-side plugin registration, not a username typed into a form.</p></article>
        <article className="rounded-xl border border-white/10 bg-[#11131c] p-5"><KeyRound size={23} className="text-emerald-200"/><h3 className="mt-3 font-bold text-white">Admin stays separate</h3><p className="mt-2 text-sm leading-6 text-white/50">Minecraft linking does not grant administrator permissions.</p></article>
      </div>
    </div>
  </main>;
}
