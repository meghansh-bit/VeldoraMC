import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Gamepad2, ShieldCheck } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  useSeo({ title: "Link Minecraft Account", description: "Link your VeldoraMC website profile using a code generated in-game.", path: "/login", noindex: true });

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!/^\\d{6}$/.test(code)) {
      setError("Enter the six-digit code shown by /link in Minecraft.");
      return;
    }
    setLoading(true);
    try {
      const { data, error: requestError } = await supabase.functions.invoke("minecraft-link", {
        body: { action: "claim", code }
      });
      if (requestError) throw requestError;
      if (!data?.success || !data?.session_token || !data?.player) {
        throw new Error(data?.error || "That code is invalid or expired. Run /link in-game for a new code.");
      }
      localStorage.setItem("veldora_minecraft_session", data.session_token);
      localStorage.setItem("veldora_minecraft_player", JSON.stringify(data.player));
      setSuccess("Minecraft account linked. Welcome, " + data.player.username + "!");
      navigate("/profiles", { replace: true });
    } catch (e) {
      setError(e?.message || "Could not verify that code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return <section className="portal-page login-page"><div className="portal-inner login-inner">
    <Link to="/" className="login-back"><ArrowLeft size={16}/> Back to VeldoraMC</Link>
    <div className="login-panel">
      <div className="portal-icon"><Gamepad2 size={30}/></div>
      <div className="section-kicker">MINECRAFT ACCOUNT ACCESS</div>
      <h1>LINK YOUR PLAYER<span>.</span></h1>
      <p>Join the VeldoraMC server, run <code>/link</code>, then enter the six-digit code shown in chat. No email or password needed.</p>
      <form onSubmit={submit} className="flex flex-col gap-3 mt-6">
        <label className="flex flex-col gap-2 text-sm">
          <span>Six-digit in-game code</span>
          <span className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3">
            <Gamepad2 size={17} aria-hidden="true"/>
            <input className="w-full bg-transparent py-3 tracking-[.35em] outline-none" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={event => setCode(event.target.value.replace(/\\D/g, "").slice(0, 6))} placeholder="123456" aria-label="Six-digit Minecraft linking code" required />
          </span>
        </label>
        {error && <div role="alert" className="security-note mt-2"><ShieldCheck size={20}/><div><b>Couldn't link account</b><small>{error}</small></div></div>}
        {success && <div role="status" className="security-note mt-2"><ShieldCheck size={20}/><div><b>Linked successfully</b><small>{success}</small></div></div>}
        <button type="submit" disabled={loading} className="vbtn vbtn-primary w-full justify-center mt-2">{loading ? "VERIFYING CODE..." : "LINK ACCOUNT"} <ArrowRight size={16}/></button>
      </form>
      <div className="security-note mt-5"><ShieldCheck size={22}/><div><b>Verified in-game</b><small>The server generates the code for the player who is online. Codes expire quickly and can only be used once.</small></div></div>
      <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/65">
        <b>How to get a code</b>
        <p className="mt-1">1. Join VeldoraMC. 2. Type <code>/link</code>. 3. Enter the code here within five minutes.</p>
      </div>
      <Link to="/" className="vbtn w-full justify-center mt-4">BACK TO HOME <ArrowLeft size={15}/></Link>
    </div>
  </div></section>;
}