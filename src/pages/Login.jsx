import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Gamepad2, LockKeyhole } from "lucide-react";
import { useSeo } from "../hooks/useSeo";

function MicrosoftMark({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path fill="#f25022" d="M1 1h10v10H1z"/><path fill="#7fba00" d="M13 1h10v10H13z"/><path fill="#00a4ef" d="M1 13h10v10H1z"/><path fill="#ffb900" d="M13 13h10v10H13z"/></svg>;
}

export default function Login() {
  const [notice, setNotice] = useState("");
  useSeo({ title: "Login", path: "/login", noindex: true });

  return <section className="portal-page login-page"><div className="portal-inner login-inner">
    <Link to="/" className="login-back"><ArrowLeft size={16}/> Back to VeldoraMC</Link>
    <div className="login-panel">
      <div className="portal-icon"><MicrosoftMark size={30}/></div>
      <div className="section-kicker">PLAYER ACCOUNT ACCESS</div>
      <h1>LOGIN<span>.</span></h1>
      <p>Choose how you want to access VeldoraMC. Account sign-in is not enabled yet while the authentication setup is being completed.</p>

      <div className="flex flex-col gap-3 mt-6">
        <button type="button" className="vbtn vbtn-primary w-full justify-center" onClick={() => setNotice("Microsoft sign-in is not enabled yet. Official Microsoft OAuth and a secure server-side session must be configured first.")}>
          <MicrosoftMark size={19}/> Login with Microsoft
        </button>
        <button type="button" className="vbtn w-full justify-center" style={{ background: "rgba(255,255,255,.055)", border: "1px solid rgba(255,255,255,.16)", color: "#f3f4f6" }} onClick={() => setNotice("Cracked/offline account login is not configured. This button is currently a UI option only; no account will be signed in until a supported authentication flow is implemented.")}>
          <Gamepad2 size={19}/> Login with Cracked Account
        </button>
      </div>

      <div className="security-note mt-5"><ShieldCheck size={22}/><div><b>Security first</b><small>Never enter your Microsoft password directly on this website. Microsoft authentication must happen on an official Microsoft page.</small></div></div>
      {notice && <div role="status" className="security-note mt-4"><LockKeyhole size={20}/><div><b>Login unavailable</b><small>{notice}</small></div></div>}
      <div className="login-status mt-5"><span className="live-dot"/> LOGIN NOT ENABLED YET</div>
      <Link to="/" className="vbtn w-full justify-center mt-4">BACK TO HOME <ArrowLeft size={15}/></Link>
    </div>
  </div></section>;
}
