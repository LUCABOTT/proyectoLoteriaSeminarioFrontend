import { Link } from "react-router-dom";
import "../styles/PublicNavbar.css";

export default function PublicNavbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Mi Proyecto</Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/register">Registrarse</Link></li>
        <li><Link to="/login">Iniciar Sesión</Link></li>
      </ul>
    </nav>
  );
}
