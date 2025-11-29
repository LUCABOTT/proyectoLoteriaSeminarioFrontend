import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← agregar
import axios from "../services/api";
import "../styles/Forms.css";

export default function Register() {
     const navigate = useNavigate(); // ← agregar
  const [formData, setFormData] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    identidad: "",
    useremail: "",
    userpswd: "",
    fechaNacimiento: ""
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
   try {
        const res = await axios.post("/auth/register", formData);
        alert("Usuario registrado con éxito. Revisa tu correo para activar la cuenta.");
        navigate("/confirmarCuenta"); // ← redirige a la página de activación
} catch (err) {
    alert(err.response?.data?.error || "Error al registrar");
}
  };

  return (
    <div className="form-container">
      <h2>Registro de Usuario</h2>

      <form className="form-box" onSubmit={handleSubmit}>
        <input type="text" name="primerNombre" placeholder="Primer Nombre" onChange={handleChange} />
        <input type="text" name="segundoNombre" placeholder="Segundo Nombre" onChange={handleChange} />
        <input type="text" name="primerApellido" placeholder="Primer Apellido" onChange={handleChange} />
        <input type="text" name="segundoApellido" placeholder="Segundo Apellido" onChange={handleChange} />
        <input type="text" name="identidad" placeholder="Identidad" onChange={handleChange} />
        <input type="email" name="useremail" placeholder="Correo" onChange={handleChange} />
        <input type="password" name="userpswd" placeholder="Contraseña" onChange={handleChange} />
        <input type="date" name="fechaNacimiento" onChange={handleChange} />

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
