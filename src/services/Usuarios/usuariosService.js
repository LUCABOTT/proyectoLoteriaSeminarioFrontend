import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/apiUsuarios`;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

const listar = () => axios.get(`${API_URL}/listar`, { headers: getHeaders() });
const crear = (data) => axios.post(`${API_URL}/guardar`, data, { headers: getHeaders() });
const editar = (data) => axios.put(`${API_URL}/editar`, data, { headers: getHeaders() });
const eliminar = (id) => axios.delete(`${API_URL}/eliminar`, { data: { id }, headers: getHeaders() });
const editarTelefonos = (data) =>
  axios.put(`${API_URL}/editar-telefonos`, data, { headers: getHeaders() });
export default { listar, crear, editar, eliminar, editarTelefonos };
