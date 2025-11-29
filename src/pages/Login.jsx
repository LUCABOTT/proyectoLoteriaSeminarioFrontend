import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../services/api";
import "../styles/Forms.css";

export default function Login() {
  const [data, setData] = useState({ useremail: "", userpswd: "" });
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", data);
      login(res.data.token); // actualiza el contexto y redirige
      alert("Inicio exitoso");
    } catch (err) {
      alert(err.response?.data?.message || "Datos incorrectos");
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>

      <form className="form-box" onSubmit={handleSubmit}>
        <input
          type="email"
          name="useremail"
          placeholder="Correo"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="userpswd"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />
        <button type="submit">Ingresar</button>

        <button
          type="button"
          onClick={() => window.location.href = "http://localhost:3001/api/auth/google"}
          className="btn-google"
        >
          Iniciar sesión con Google
        </button>
      </form>
    </div>
  );
}