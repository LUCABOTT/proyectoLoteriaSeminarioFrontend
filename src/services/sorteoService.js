import apiClient from './apiClient';

export const sorteoService = {
  // Listar todos los sorteos
  getAllSorteos: async () => {
    const response = await apiClient.get('/api/sorteos/listar');
    return response.data;
  },

  // Crear nuevo sorteo
  createSorteo: async (data) => {
    const response = await apiClient.post('/api/sorteos/guardar', data);
    return response.data;
  },

  // Editar sorteo
  updateSorteo: async (id, data) => {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) throw new Error('ID inválido: ' + id);
    const response = await apiClient.put(`/api/sorteos/editar?id=${numId}`, data);
    return response.data;
  },

  // Eliminar sorteo
  deleteSorteo: async (id) => {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) throw new Error('ID inválido: ' + id);
    const response = await apiClient.delete(`/api/sorteos/eliminar?id=${numId}`);
    return response.data;
  },
};