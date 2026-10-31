import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useSeo } from "../hooks/useSeo";

export default function StoreAccount() {
  const { user, status, signOut } = useAuth();
  useSeo({ title: "Account", description: "Manage your VeldoraMC account.", path: "/store/account", noindex: true });

  if (status === "loading") return <main className="vstore-account-page"><div className="vstore-account-card">Checking your account…</div></main>;

  if (!user) return (
    <main className="vstore-account-page">
      <section className="vstore-account-card">
        <span className="vstore-account-icon"><UserRound size={25}/></span>
        <span className="vstore-kicker">VELDORAMC ACCOUNT</span>
        <h1>One account.<br/><em>One sign-in.</em></h1>
        <p>Use the main Microsoft sign-in in the website header to access your VeldoraMC account. There is no separate store login.</p>
        <div className="vstore-account-actions"><Link className="vstore-primary" to="/">Back to website <ArrowRight size={16}/></Link></div>
      </section>
    </main>
  );

  return (
    <main className="vstore-account-page">
      <section className="vstore-account-card">
        <span className="vstore-account-icon"><CheckCircle2 size={25}/></span>
        <span className="vstore-kicker">VELDORAMC ACCOUNT</span>
        <h1>You’re signed <em>in.</em></h1>
        <p>Your main website session is active for <b>{user.email || user.user_metadata?.full_name || "your account"}</b>.</p>
        <div className="vstore-auth-foot"><ShieldCheck size={15}/> Your website sign-in also applies to the store.</div>
        <div className="vstore-account-actions">
          <Link className="vstore-primary" to="/store">Continue to store <ArrowRight size={16}/></Link>
          <button className="vstore-secondary" onClick={async()=>{await signOut();}}>Sign out</button>
        </div>
      </section>
    </main>
  );
}
