import apiClient from './apiClient';

export const ticketService = {
  // Listar todos los tickets (admin)
  getAllTickets: async () => {
    const response = await apiClient.get('/api/tickets/listar');
    return response.data;
  },

  // Obtener mis tickets (usuario)
  getMyTickets: async () => {
    const response = await apiClient.get('/api/tickets/mis-tickets');
    return response.data;
  },

  // Obtener ticket por ID con detalles
  getTicketById: async (id) => {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) throw new Error('ID inválido: ' + id);
    const response = await apiClient.get(`/api/tickets/${numId}`);
    return response.data;
  },

  // Comprar ticket (crear ticket + detalles de números)
  buyTicket: async (idSorteo, numeros) => {
    const response = await apiClient.post('/api/tickets/comprar', {
      IdSorteo: parseInt(idSorteo, 10),
      numeros,
    });
    return response.data;
  },

  // Editar ticket (cambiar estado, etc.)
  updateTicket: async (id, data) => {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) throw new Error('ID inválido: ' + id);
    const response = await apiClient.put(`/api/tickets/editar?id=${numId}`, data);
    return response.data;
  },

  // Eliminar ticket
  deleteTicket: async (id) => {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) throw new Error('ID inválido: ' + id);
    const response = await apiClient.delete(`/api/tickets/eliminar?id=${numId}`);
    return response.data;
  },

  // Listar detalles de tickets (números comprados)
  getAllDetalles: async () => {
    const response = await apiClient.get('/api/detalle-tickets/listar');
    return response.data;
  },
};