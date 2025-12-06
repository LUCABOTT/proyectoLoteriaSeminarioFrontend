import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function GoogleCallback() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userJson = params.get("user");

    if (token && userJson) {
      const user = JSON.parse(decodeURIComponent(userJson));
      login(token, user); // guardar token + usuario real
      navigate("/dashboard"); // ahora sí debería quedarse en dashboard
    } else {
      navigate("/login");
    }
  }, []);

  return <p>Iniciando sesión con Google...</p>;
}
