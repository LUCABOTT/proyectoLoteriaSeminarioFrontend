import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/PublicNavbar.css";

export default function PublicNavbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to={isAuthenticated ? "/dashboard" : "/"}>Lotería</Link>
      </div>
      <ul className="navbar-links">
        {isAuthenticated ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/dashboard/sorteos">Mis Sorteos</Link></li>
            <li>
              <span style={{ color: "#fbbf24" }}>
                {user?.firstName} {user?.lastName}
              </span>
            </li>
            <li>
              <button 
                onClick={logout}
                style={{ 
                  background: "none", 
                  border: "none", 
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "inherit"
                }}
              >
                Cerrar Sesión
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/register">Registrarse</Link></li>
            <li><Link to="/login">Iniciar Sesión</Link></li>
            <li><Link to="/confirmarCuenta">Confirmar Cuenta</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
