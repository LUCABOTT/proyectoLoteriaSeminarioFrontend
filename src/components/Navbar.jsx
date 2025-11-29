import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/NavBar.css";

export default function Navbar() {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo a la izquierda */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">Casino LL</Link>
        </div>

        {/* Botones a la derecha */}
        <div className="navbar-right">
          <Link to="/perfil" className="btn-nav">Perfil</Link>
          <button onClick={logout} className="btn-nav btn-logout">Cerrar sesión</button>
        </div>
      </div>
    </nav>
  );
}