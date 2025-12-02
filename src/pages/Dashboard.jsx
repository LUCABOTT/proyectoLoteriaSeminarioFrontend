import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Bienvenido al panel de control</p>

      {user && (
        <div style={{ 
          marginTop: "30px", 
          padding: "20px", 
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9"
        }}>
          <h2>Información del Usuario</h2>
          <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      <button
        onClick={logout}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
