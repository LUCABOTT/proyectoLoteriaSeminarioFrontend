import apiClient from './apiClient';

export const juegoService = {
  // Listar todos los juegos
  getAllJuegos: async () => {
    const response = await apiClient.get('/api/juegos/listar');
    return response.data;
  },

  // Crear nuevo juego
  createJuego: async (data) => {
    const response = await apiClient.post('/api/juegos/guardar', data);
    return response.data;
  },

  // Editar juego
  updateJuego: async (id, data) => {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) throw new Error('ID inválido: ' + id);
    const response = await apiClient.put(`/api/juegos/editar?id=${numId}`, data);
    return response.data;
  },

  // Eliminar juego
  deleteJuego: async (id) => {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) throw new Error('ID inválido: ' + id);
    const response = await apiClient.delete(`/api/juegos/eliminar?id=${numId}`);
    return response.data;
  },
};