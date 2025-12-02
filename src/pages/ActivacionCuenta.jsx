import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { activateAccount } from "../services/authService";

export default function ActivacionCuenta() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await activateAccount(email, pin);
      alert(response.message);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2>Confirmar Cuenta</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Ingresa el código PIN que se mostró en la consola al registrarte
      </p>

      {error && (
        <div style={{ 
          backgroundColor: "#fee", 
          border: "1px solid #fcc", 
          padding: "10px", 
          marginBottom: "15px",
          borderRadius: "4px",
          color: "#c00"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleConfirm}>
        <div style={{ marginBottom: "15px" }}>
          <label>Correo electrónico</label>
          <input 
            type="email" 
            placeholder="usuario@correo.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={{ 
              width: "100%", 
              padding: "8px", 
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Código PIN</label>
          <input 
            type="text" 
            placeholder="123456" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)} 
            required
            maxLength={6}
            style={{ 
              width: "100%", 
              padding: "8px", 
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: "100%", 
            padding: "10px", 
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Confirmando..." : "Confirmar Cuenta"}
        </button>
      </form>
    </div>
  );
}