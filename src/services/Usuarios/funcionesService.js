import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/apiFunciones`;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("Token enviado:", token);
  if (!token) throw new Error("No hay token en localStorage");
  return { Authorization: `Bearer ${token}` };
};
const listar = () => axios.get(`${API_URL}/listar`, { headers: getHeaders() });
const crear = (data) => axios.post(`${API_URL}/guardar`, data, { headers: getHeaders() });
const editar = (data) => axios.put(`${API_URL}/editar`, data, { headers: getHeaders() });
const eliminar = (fncod) =>
  axios.delete(`${API_URL}/eliminar`, {
    headers: getHeaders(),
    data: { fncod }, // 🔹 aquí va el body
  });

export default { listar, crear, editar, eliminar };