import { Link } from "react-router-dom";
export default function Logo() {
 return <Link to="/" aria-label="VeldoraMC home" className="vel-logo">
   <span className="vel-logo-mark">V</span><span className="vel-logo-word">VELDORA<span>MC</span></span>
 </Link>;
}