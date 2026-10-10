
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
function MicrosoftMark({ size = 24 }) { return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path fill="#f25022" d="M1 1h10v10H1z"/><path fill="#7fba00" d="M13 1h10v10H13z"/><path fill="#00a4ef" d="M1 13h10v10H1z"/><path fill="#ffb900" d="M13 13h10v10H13z"/></svg>; }\nexport default function Login() {
  useSeo({ title: "Login", path: "/login", noindex: true });
  return <section className="portal-page login-page"><div className="portal-inner login-inner">
    <Link to="/" className="login-back"><ArrowLeft size={16}/> Back to VeldoraMC</Link>
    <div className="login-panel"><div className="portal-icon"><MicrosoftMark size={30}/></div><div className="section-kicker">MICROSOFT ACCOUNT LINKING</div>
      <h1>LOGIN<span>.</span></h1><p>Secure Xbox/Microsoft sign-in will be enabled after the official OAuth application and server-side session flow are configured.</p>
      <div className="security-note"><ShieldCheck size={22}/><div><b>Security first</b><small>VeldoraMC will never ask you to type your Microsoft password into this website. Sign-in must happen on an official Microsoft page.</small></div></div>
      <div className="login-status"><span className="live-dot"/> LOGIN NOT ENABLED YET</div>
      <Link to="/" className="vbtn vbtn-primary">BACK TO HOME <ArrowLeft size={15}/></Link>
    </div>
  </div></section>
}
