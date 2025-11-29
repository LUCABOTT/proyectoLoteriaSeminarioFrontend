import { useState } from "react";
import axios from "../services/api";
import "../styles/Forms.css";

export default function Login() {
  const [data, setData] = useState({ useremail: "", userpswd: "" });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", data);
      alert("Inicio exitoso");
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Datos incorrectos");
      console.log(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>

      <form className="form-box" onSubmit={login}>
        <input
          type="email"
          name="useremail"
          placeholder="Correo"
          onChange={handleChange}
        />

        <input
          type="password"
          name="userpswd"
          placeholder="Contraseña"
          onChange={handleChange}
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
