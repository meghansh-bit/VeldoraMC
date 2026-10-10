import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Logo() {
  return (
    <Link to="/" aria-label="VeldoraMC home" className="vel-logo">
      <span className="vel-logo-mark" aria-hidden="true"><span className="vel-logo-crystal">V</span><Sparkles size={10} className="vel-logo-spark" /></span>
      <span className="vel-logo-word">VELDORA<span>MC</span></span>
    </Link>
  );
}