import { useState, useEffect } from 'react';
import { ticketService } from '../services/ticketService';

export const useTickets = (isAdmin = false) => {
  const [tickets, setTickets] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  // Cargar tickets
  const cargarTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('useTickets.cargarTickets - Iniciando carga...');
      
      // Cargar tickets
      const ticketsData = isAdmin 
        ? await ticketService.getAllTickets()
        : await ticketService.getMyTickets();

      console.log('useTickets.cargarTickets - Datos recibidos:', ticketsData);

      // Procesar tickets
      let ticketsList = [];
      if (Array.isArray(ticketsData)) {
        ticketsList = ticketsData;
      } else if (ticketsData && typeof ticketsData === 'object') {
        ticketsList = ticketsData.tickets || ticketsData.data || [];
      }

      setTickets(Array.isArray(ticketsList) ? ticketsList : []);

      // Cargar detalles de tickets
      try {
        const detallesData = await ticketService.getAllDetalles();
        let detallesList = [];
        if (Array.isArray(detallesData)) {
          detallesList = detallesData;
        } else if (detallesData && typeof detallesData === 'object') {
          detallesList = detallesData.detalles || detallesData.data || [];
        }
        setDetalles(Array.isArray(detallesList) ? detallesList : []);
      } catch (detallesErr) {
        console.warn('Error al cargar detalles:', detallesErr.message);
        setDetalles([]);
      }
    } catch (err) {
      console.error('useTickets.cargarTickets - Error completo:', err);
      const mensaje = err.response?.data?.error || 
                     err.response?.data?.message || 
                     err.message || 
                     'Error al cargar tickets';
      setError(mensaje);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Comprar ticket
  const comprarTicket = async (idSorteo, numeros) => {
    try {
      console.log('useTickets.comprarTicket - Iniciando...');
      console.log('  IdSorteo:', idSorteo);
      console.log('  Números:', numeros);

      const resultado = await ticketService.buyTicket(idSorteo, numeros);
      console.log('useTickets.comprarTicket - Ticket comprado:', resultado);

      // Recargar tickets
      await cargarTickets();
      setError(null);

      return { success: true, ticket: resultado };
    } catch (err) {
      console.error('useTickets.comprarTicket - Error:', err);

      let mensaje = 'Error al comprar ticket';

      if (Array.isArray(err.response?.data)) {
        mensaje = err.response.data
          .map(e => e.msg || e.message || String(e))
          .join(', ');
      } else if (err.response?.data?.error) {
        mensaje = err.response.data.error;
      } else if (err.response?.data?.message) {
        mensaje = err.response.data.message;
      } else if (err.message) {
        mensaje = err.message;
      }

      // Manejo especial para saldo insuficiente
      if (err.response?.status === 402) {
        mensaje = 'Saldo insuficiente. Por favor recarga tu billetera.';
      }

      return { success: false, error: mensaje };
    }
  };

  // Editar ticket
  const editarTicket = async (id, data) => {
    try {
      console.log('useTickets.editarTicket - ID:', id, 'Datos:', data);

      const numId = parseInt(id, 10);
      if (isNaN(numId)) {
        return { success: false, error: 'ID de ticket inválido' };
      }

      const actualizado = await ticketService.updateTicket(numId, data);
      console.log('useTickets.editarTicket - Respuesta:', actualizado);

      setTickets(tickets.map(t => t.IdTicket === numId ? actualizado : t));
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('useTickets.editarTicket - Error:', err);

      let mensaje = 'Error al editar ticket';

      if (Array.isArray(err.response?.data)) {
        mensaje = err.response.data
          .map(e => e.msg || e.message || String(e))
          .join(', ');
      } else if (err.response?.data?.error) {
        mensaje = err.response.data.error;
      } else if (err.response?.data?.message) {
        mensaje = err.response.data.message;
      } else if (err.message) {
        mensaje = err.message;
      }

      return { success: false, error: mensaje };
    }
  };

  // Eliminar ticket
  const eliminarTicket = async (id) => {
    try {
      console.log('useTickets.eliminarTicket - ID:', id);

      const numId = parseInt(id, 10);
      if (isNaN(numId)) {
        return { success: false, error: 'ID de ticket inválido' };
      }

      await ticketService.deleteTicket(numId);
      console.log('useTickets.eliminarTicket - Ticket eliminado');

      setTickets(tickets.filter(t => t.IdTicket !== numId));
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('useTickets.eliminarTicket - Error:', err);

      let mensaje = 'Error al eliminar ticket';

      if (Array.isArray(err.response?.data)) {
        mensaje = err.response.data
          .map(e => e.msg || e.message || String(e))
          .join(', ');
      } else if (err.response?.data?.error) {
        mensaje = err.response.data.error;
      } else if (err.response?.data?.message) {
        mensaje = err.response.data.message;
      } else if (err.message) {
        mensaje = err.message;
      }

      return { success: false, error: mensaje };
    }
  };

  // Obtener números de un ticket
  const obtenerNumerosTicket = (idTicket) => {
    return detalles
      .filter(d => d.IdTicket === idTicket)
      .map(d => d.NumeroComprado)
      .sort((a, b) => a - b);
  };

  // Filtrar tickets
  const ticketsFiltrados = tickets.filter(t => {
    if (!t) return false;

    const id = (t.IdTicket || '').toString().includes(filtro);
    const usuario = (t.IdUsuario || '').toString().includes(filtro);
    const sorteo = (t.IdSorteo || '').toString().includes(filtro);

    const estadoMatch = !filtroEstado || (t.Estado || '').toLowerCase() === filtroEstado.toLowerCase();

    return (id || usuario || sorteo) && estadoMatch;
  });

  useEffect(() => {
    cargarTickets();
  }, [isAdmin]);

  return {
    tickets: ticketsFiltrados,
    ticketsTodos: tickets,
    detalles,
    loading,
    error,
    filtro,
    setFiltro,
    filtroEstado,
    setFiltroEstado,
    comprarTicket,
    editarTicket,
    eliminarTicket,
    obtenerNumerosTicket,
    recargar: cargarTickets
  };
};