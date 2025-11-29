import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import "../styles/Forms.css";
import { Axios } from "axios";

export default function ActivateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    pin: ""
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/confirmarCuenta", formData); // ruta de tu backend para confirmar usuario
      alert(res.data.message);
      navigate("/login"); // redirige al login luego de activar
    } catch (err) {
      alert(err.response?.data?.error || "Error al activar cuenta");
    }
  };

  return (
    <div className="form-container">
      <h2>Activar Cuenta</h2>
      <form className="form-box" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="pin"
          placeholder="Código PIN"
          value={formData.pin}
          onChange={handleChange}
        />
        <button type="submit">Activar Cuenta</button>
      </form>
    </div>
  );
}
