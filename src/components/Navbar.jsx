import React from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Casino LL</Link>

        <div className="navbar-links">
          <Link to="/login" className="btn-login">Iniciar sesión</Link>
          <Link to="/register" className="btn-register">Registrarse</Link>
        </div>
      </div>
    </nav>
  );
}
