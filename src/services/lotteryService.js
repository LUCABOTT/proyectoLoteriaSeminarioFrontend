import apiClient from "./apiClient";

/**
 * Transformar datos de Sorteo+Juego del backend al formato esperado por el frontend
 */
const transformSorteoToLottery = (sorteo, juego) => {
  if (!juego) return null;
  
  return {
    id: sorteo.Id,
    name: juego.Nombre,
    type: sorteo.Estado === 'abierto' ? 'active' : 'closed',
    description: juego.Descripcion || `Sorteo de ${juego.Nombre}`,
    prize: 250000, // TODO: Esto debería venir del backend o calcularse
    ticketPrice: juego.PrecioJuego,
    drawTime: new Date(sorteo.Cierre).toLocaleTimeString('es-HN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    numbersFormat: `${juego.CantidadNumeros} números (${juego.RangoMin}-${juego.RangoMax})`,
    numbersCount: juego.CantidadNumeros,
    maxNumber: juego.RangoMax,
    minNumber: juego.RangoMin,
    frequency: "Según programación",
    nextDraw: sorteo.Cierre,
    active: sorteo.Estado === 'abierto',
    sorteoId: sorteo.Id,
    juegoId: juego.Id
  };
};

/**
 * Obtener todos los sorteos activos con sus juegos
 */
export const getAllLotteries = async () => {
  const sorteosRes = await apiClient.get("/api/sorteos/listar");
  const sorteos = sorteosRes.data;
  const juegosRes = await apiClient.get("/api/juegos/listar");
  const juegos = juegosRes.data;

  const lotteries = sorteos
    .map(sorteo => {
      const juego = juegos.find(j => j.Id === sorteo.IdJuego);
      return transformSorteoToLottery(sorteo, juego);
    })
    .filter(lottery => lottery !== null);

  return {
    lotteries: lotteries.filter(l => l.active),
    totalActive: lotteries.filter(l => l.active).length
  };
};

/**
 * Obtener un sorteo específico por ID
 */
export const getLottery = async (id) => {
  const sorteosRes = await apiClient.get(`/api/sorteos/listar`);
  const sorteos = sorteosRes.data;
  const sorteo = sorteos.find(s => s.Id === parseInt(id));
  if (!sorteo) throw new Error("Sorteo no encontrado");

  const juegosRes = await apiClient.get("/api/juegos/listar");
  const juego = juegosRes.data.find(j => j.Id === sorteo.IdJuego);

  return {
    lottery: transformSorteoToLottery(sorteo, juego)
  };
};

/**
 * Comprar un ticket (crea ticket + detalles de números)
 */
export const buyTicket = async (userId, lotteryId, numbers) => {
  const juegosRes = await apiClient.get("/api/juegos/listar");
  const sorteosRes = await apiClient.get("/api/sorteos/listar");
  const sorteo = sorteosRes.data.find(s => s.Id === parseInt(lotteryId));
  const juego = juegosRes.data.find(j => j.Id === sorteo?.IdJuego);
  if (!juego) throw new Error("Juego no encontrado");

  const total = juego.PrecioJuego;
  const ticketRes = await apiClient.post("/api/tickets/comprar", {
    IdSorteo: parseInt(lotteryId),
    Total: total,
    FechaCompra: new Date().toISOString()
  });
  const ticket = ticketRes.data.ticket;

  const subtotal = total / numbers.length;
  for (const numero of numbers) {
    await apiClient.post("/api/detalle-tickets/guardar", {
      IdTicket: ticket.IdTicket,
      NumeroComprado: numero,
      Subtotal: subtotal
    });
  }

  return {
    message: "Ticket comprado exitosamente",
    ticket: {
      id: ticket.IdTicket,
      userId: ticket.IdUsuario,
      lotteryId: ticket.IdSorteo,
      lotteryName: juego.Nombre,
      numbers,
      purchaseDate: ticket.FechaCompra,
      ticketNumber: `TK-${ticket.IdTicket}`,
      price: parseFloat(ticket.Total || 0),
      drawDate: sorteo.Cierre,
      status: ticket.Estado
    }
  };
};

/**
 * Obtener tickets del usuario autenticado
 */
export const getMyTickets = async (userId) => {
  const res = await apiClient.get("/api/tickets/mis-tickets");
  const ticketsData = res.data;

  const juegosRes = await apiClient.get("/api/juegos/listar");
  const sorteosRes = await apiClient.get("/api/sorteos/listar");
  const juegos = juegosRes.data;
  const sorteos = sorteosRes.data;

  const detallesRes = await apiClient.get("/api/detalle-tickets/listar");
  const detalles = detallesRes.data;

  const purchases = ticketsData.tickets.map(ticket => {
    const sorteo = sorteos.find(s => s.Id === ticket.IdSorteo);
    const juego = juegos.find(j => j.Id === sorteo?.IdJuego);
    const ticketDetalles = detalles.filter(d => d.IdTicket === ticket.IdTicket);
    const numbers = ticketDetalles.map(d => d.NumeroComprado);

    return {
      id: ticket.IdTicket,
      userId: ticket.IdUsuario,
      lotteryId: ticket.IdSorteo,
      lotteryName: juego?.Nombre || "Desconocido",
      numbers,
      purchaseDate: ticket.FechaCompra,
      ticketNumber: `TK-${ticket.IdTicket}`,
      price: parseFloat(ticket.Total || 0),
      drawDate: sorteo?.Cierre,
      status: ticket.Estado
    };
  });

  return {
    purchases,
    total: ticketsData.total,
    totalSpent: purchases.reduce((sum, p) => sum + p.price, 0),
    activePurchases: purchases.filter(p => p.status === 'pagado' || p.status === 'pendiente').length
  };
};

/**
 * Obtener resultados de sorteos
 */
export const getLotteryResults = async (lotteryId = null) => {
  const res = await apiClient.get("/api/sorteos/listar");
  const sorteos = res.data;

  const results = sorteos
    .filter(s => s.Estado === 'sorteado' && s.NumerosGanadores)
    .filter(s => !lotteryId || s.Id === parseInt(lotteryId))
    .map(s => ({
      lotteryId: s.Id,
      drawDate: s.Cierre,
      winningNumbers: s.NumerosGanadores,
      winners: []
    }));

  return { results };
};