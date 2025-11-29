import { useState } from "react";
import api from "../services/api";

export default function ActivateAccount() {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/confirmarCuenta", { email, pin });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error al activar cuenta");
    }
  };

  return (
    <div className="form-container">
      <h2>Activar Cuenta</h2>
      <form onSubmit={handleSubmit} className="form-box">
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="PIN de activación"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button type="submit">Activar Cuenta</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
