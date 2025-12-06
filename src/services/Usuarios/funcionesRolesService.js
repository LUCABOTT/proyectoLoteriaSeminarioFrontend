import axios from "axios";

const API_URL = "http://localhost:3001/api/apiFuncionesRoles";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export default {
  listar: () => axios.get(`${API_URL}/listar`, { headers: getHeaders() }),
  crear: (data) => axios.post(`${API_URL}/guardar`, data, { headers: getHeaders() }),
  editar: (data) => axios.put(`${API_URL}/editar`, data, { headers: getHeaders() }),
  eliminar: (data) => axios.delete(`${API_URL}/eliminar`, { data, headers: getHeaders() }),
};
