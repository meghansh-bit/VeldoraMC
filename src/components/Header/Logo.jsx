import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" aria-label="VeldoraMC home" className="vel-logo">
      <img src="/veldoramc-logo.svg" alt="VeldoraMC" className="vel-logo-image" />
    </Link>
  );
}
