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
  try {
    // Obtener sorteos
    const sorteosRes = await apiClient.get("/api/sorteos/listar");
    const sorteos = sorteosRes.data;

    // Obtener juegos
    const juegosRes = await apiClient.get("/api/juegos/listar");
    const juegos = juegosRes.data;

    // Combinar sorteos con sus juegos
    const lotteries = sorteos
      .map(sorteo => {
        const juego = juegos.find(j => j.Id === sorteo.IdJuego);
        return transformSorteoToLottery(sorteo, juego);
      })
      .filter(lottery => lottery !== null);

    return {
      lotteries: lotteries.filter(l => l.active), // Solo activos
      totalActive: lotteries.filter(l => l.active).length
    };
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error al obtener loterías");
  }
};

/**
 * Obtener un sorteo específico por ID
 */
export const getLottery = async (id) => {
  try {
    const sorteoRes = await apiClient.get(`/api/sorteos/listar`);
    const sorteos = sorteoRes.data;
    const sorteo = sorteos.find(s => s.Id === parseInt(id));
    
    if (!sorteo) {
      throw new Error("Sorteo no encontrado");
    }

    const juegosRes = await apiClient.get("/api/juegos/listar");
    const juego = juegosRes.data.find(j => j.Id === sorteo.IdJuego);

    return {
      lottery: transformSorteoToLottery(sorteo, juego)
    };
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error al obtener lotería");
  }
};

/**
 * Comprar un ticket (crea ticket + detalles de números)
 */
export const buyTicket = async (userId, lotteryId, numbers) => {
  try {
    // Obtener información del juego para calcular el total
    const juegosRes = await apiClient.get("/api/juegos/listar");
    const sorteosRes = await apiClient.get("/api/sorteos/listar");
    
    const sorteo = sorteosRes.data.find(s => s.Id === parseInt(lotteryId));
    const juego = juegosRes.data.find(j => j.Id === sorteo?.IdJuego);
    
    if (!juego) {
      throw new Error("Juego no encontrado");
    }

    const total = juego.PrecioJuego;

    // 1. Crear el ticket (debita de billetera automáticamente)
    const ticketRes = await apiClient.post("/api/tickets/comprar", {
      IdSorteo: parseInt(lotteryId),
      Total: total,
      FechaCompra: new Date().toISOString()
    });

    const ticket = ticketRes.data.ticket;

    // 2. Agregar cada número como detalle
    const subtotal = total / numbers.length;
    
    for (const numero of numbers) {
      await apiClient.post("/api/detalle-tickets/guardar", {
        IdTicket: ticket.IdTicket,
        NumeroComprado: numero,
        Subtotal: subtotal
      });
    }

    // Retornar en el formato esperado por el frontend
    return {
      message: "Ticket comprado exitosamente",
      ticket: {
        id: ticket.IdTicket,
        userId: ticket.IdUsuario,
        lotteryId: ticket.IdSorteo,
        lotteryName: juego.Nombre,
        numbers: numbers,
        purchaseDate: ticket.FechaCompra,
        ticketNumber: `TK-${ticket.IdTicket}`,
        price: ticket.Total,
        drawDate: sorteo.Cierre,
        status: ticket.Estado
      }
    };
  } catch (err) {
    // Manejar error de saldo insuficiente
    if (err.response?.status === 402) {
      throw new Error("Saldo insuficiente. Por favor recarga tu billetera.");
    }
    throw new Error(err.response?.data?.error || "Error al comprar ticket");
  }
};

/**
 * Obtener tickets del usuario autenticado
 */
export const getMyTickets = async (userId) => {
  try {
    const res = await apiClient.get("/api/tickets/mis-tickets");
    const ticketsData = res.data;

    // Obtener juegos para mapear nombres
    const juegosRes = await apiClient.get("/api/juegos/listar");
    const sorteosRes = await apiClient.get("/api/sorteos/listar");
    const juegos = juegosRes.data;
    const sorteos = sorteosRes.data;

    // Obtener detalles de todos los tickets
    const detallesRes = await apiClient.get("/api/detalle-tickets/listar");
    const detalles = detallesRes.data;

    // Transformar tickets al formato esperado
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
        numbers: numbers,
        purchaseDate: ticket.FechaCompra,
        ticketNumber: `TK-${ticket.IdTicket}`,
        price: ticket.Total,
        drawDate: sorteo?.Cierre,
        status: ticket.Estado
      };
    });

    return {
      purchases: purchases,
      total: ticketsData.total,
      totalSpent: purchases.reduce((sum, p) => sum + p.price, 0),
      activePurchases: purchases.filter(p => p.status === 'pagado' || p.status === 'pendiente').length
    };
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error al obtener tickets");
  }
};

/**
 * Obtener resultados de sorteos
 */
export const getLotteryResults = async (lotteryId = null) => {
  try {
    const res = await apiClient.get("/api/sorteos/listar");
    const sorteos = res.data;

    // Filtrar sorteos sorteados
    const results = sorteos
      .filter(s => s.Estado === 'sorteado' && s.NumerosGanadores)
      .filter(s => !lotteryId || s.Id === parseInt(lotteryId))
      .map(s => ({
        lotteryId: s.Id,
        drawDate: s.Cierre,
        winningNumbers: s.NumerosGanadores,
        winners: [] // TODO: Implementar lógica de ganadores
      }));

    return {
      results
    };
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error al obtener resultados");
  }
};
