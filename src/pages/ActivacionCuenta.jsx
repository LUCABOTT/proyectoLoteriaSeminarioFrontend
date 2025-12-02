import { useState } from "react";
import api from "../services/api";

export default function ActivacionCuenta() {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/confirmarCuenta", { email, pin });
      alert(res.data.message);
      window.location.href = "/login"; // redirige al login
    } catch (err) {
      alert(err.response?.data?.error || "Error al confirmar usuario");
    }
  };

  return (
    <div className="form-container">
      <h2>Confirmar Cuenta</h2>
      <form onSubmit={handleConfirm} className="form-box">
        <input 
          type="email" 
          placeholder="Correo" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Código PIN" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)} 
          required 
        />
        <button type="submit">Confirmar</button>
      </form>
    </div>
  );
}