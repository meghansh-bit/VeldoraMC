
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Gamepad2 } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
export default function Login() {
  useSeo({ title: "Xbox Account Login", path: "/login", noindex: true });
  return <section className="portal-page login-page"><div className="portal-inner login-inner">
    <Link to="/" className="login-back"><ArrowLeft size={16}/> Back to VeldoraMC</Link>
    <div className="login-panel"><div className="portal-icon"><Gamepad2 size={28}/></div><div className="section-kicker">MICROSOFT ACCOUNT LINKING</div>
      <h1>XBOX <span>LOGIN.</span></h1><p>Secure Xbox/Microsoft sign-in will be enabled after the official OAuth application and server-side session flow are configured.</p>
      <div className="security-note"><ShieldCheck size={22}/><div><b>Security first</b><small>VeldoraMC will never ask you to type your Microsoft password into this website. Sign-in must happen on an official Microsoft page.</small></div></div>
      <div className="login-status"><span className="live-dot"/> LOGIN NOT ENABLED YET</div>
      <Link to="/community" className="vbtn vbtn-primary">VIEW COMMUNITY <ArrowLeft size={15}/></Link>
    </div>
  </div></section>
}
