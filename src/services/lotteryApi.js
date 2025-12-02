// Mock lottery database
const mockLotteryDB = {
  lotteries: [
    {
      id: "la-diaria-001",
      name: "La Diaria",
      type: "daily",
      description: "Sorteo diario con premios garantizados",
      prize: 250000,
      ticketPrice: 20,
      drawTime: "18:00",
      numbersFormat: "4 dígitos (0-9)",
      numbersCount: 4,
      maxNumber: 9,
      frequency: "Diario",
      nextDraw: null, // Se calcula dinámicamente
      active: true
    },
    {
      id: "pega-3-001",
      name: "Pega 3",
      type: "weekly",
      description: "Elige 3 números y gana hasta L. 500,000",
      prize: 500000,
      ticketPrice: 10,
      drawTime: "20:00",
      drawDays: ["Miércoles", "Sábado"],
      numbersFormat: "3 dígitos (0-9)",
      numbersCount: 3,
      maxNumber: 9,
      frequency: "2 veces por semana",
      nextDraw: null,
      active: true
    },
    {
      id: "loto-hn-001",
      name: "Loto HN",
      type: "weekly",
      description: "El premio mayor de Honduras - hasta L. 3,000,000",
      prize: 3000000,
      ticketPrice: 50,
      drawTime: "21:00",
      drawDays: ["Domingo"],
      numbersFormat: "6 números (1-45)",
      numbersCount: 6,
      maxNumber: 45,
      minNumber: 1,
      frequency: "Semanal",
      nextDraw: null,
      active: true
    }
  ],
  purchases: [], // { userId, lotteryId, numbers, purchaseDate, ticketNumber }
  results: [] // { lotteryId, drawDate, winningNumbers, winners }
};

// Calculate next draw date
const calculateNextDraw = (lottery) => {
  const now = new Date();
  const today = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  
  if (lottery.type === "daily") {
    const nextDraw = new Date();
    const [hours, minutes] = lottery.drawTime.split(":");
    nextDraw.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Si ya pasó la hora de hoy, programar para mañana
    if (now > nextDraw) {
      nextDraw.setDate(nextDraw.getDate() + 1);
    }
    
    return nextDraw.toISOString();
  }
  
  if (lottery.type === "weekly") {
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const drawDayNumbers = lottery.drawDays.map(day => dayNames.indexOf(day));
    
    // Encontrar el próximo día de sorteo
    let daysUntilDraw = 7;
    for (const drawDay of drawDayNumbers.sort((a, b) => a - b)) {
      const daysAhead = (drawDay - today + 7) % 7;
      if (daysAhead < daysUntilDraw && daysAhead > 0) {
        daysUntilDraw = daysAhead;
      }
    }
    
    // Si es hoy pero ya pasó la hora
    if (daysUntilDraw === 0) {
      const [hours, minutes] = lottery.drawTime.split(":");
      const drawTime = new Date();
      drawTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      if (now > drawTime) {
        // Buscar el próximo día
        daysUntilDraw = 7;
        for (const drawDay of drawDayNumbers.sort((a, b) => a - b)) {
          const daysAhead = (drawDay - today + 7) % 7;
          if (daysAhead > 0 && daysAhead < daysUntilDraw) {
            daysUntilDraw = daysAhead;
          }
        }
      }
    }
    
    const nextDraw = new Date();
    nextDraw.setDate(nextDraw.getDate() + daysUntilDraw);
    const [hours, minutes] = lottery.drawTime.split(":");
    nextDraw.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    return nextDraw.toISOString();
  }
  
  return null;
};

// Generate ticket number
const generateTicketNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `TK${timestamp}${random}`;
};

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock lottery API
const lotteryApi = {
  async getLotteries() {
    await delay();
    
    // Calculate next draws
    const lotteriesWithDates = mockLotteryDB.lotteries.map(lottery => ({
      ...lottery,
      nextDraw: calculateNextDraw(lottery)
    }));
    
    return {
      data: {
        lotteries: lotteriesWithDates,
        totalActive: lotteriesWithDates.filter(l => l.active).length
      }
    };
  },

  async getLotteryById(id) {
    await delay();
    
    const lottery = mockLotteryDB.lotteries.find(l => l.id === id);
    if (!lottery) {
      throw {
        response: {
          data: { message: "Lotería no encontrada" }
        }
      };
    }
    
    return {
      data: {
        lottery: {
          ...lottery,
          nextDraw: calculateNextDraw(lottery)
        }
      }
    };
  },

  async purchaseTicket(userId, lotteryId, numbers) {
    await delay();
    
    const lottery = mockLotteryDB.lotteries.find(l => l.id === lotteryId);
    if (!lottery) {
      throw {
        response: {
          data: { message: "Lotería no encontrada" }
        }
      };
    }

    // Validate numbers
    if (numbers.length !== lottery.numbersCount) {
      throw {
        response: {
          data: { message: `Debes seleccionar ${lottery.numbersCount} números` }
        }
      };
    }

    const minNum = lottery.minNumber || 0;
    const maxNum = lottery.maxNumber;
    
    for (const num of numbers) {
      if (num < minNum || num > maxNum) {
        throw {
          response: {
            data: { message: `Los números deben estar entre ${minNum} y ${maxNum}` }
          }
        };
      }
    }

    const purchase = {
      id: Date.now(),
      userId,
      lotteryId,
      lotteryName: lottery.name,
      numbers,
      purchaseDate: new Date().toISOString(),
      ticketNumber: generateTicketNumber(),
      price: lottery.ticketPrice,
      drawDate: calculateNextDraw(lottery),
      status: "pending" // pending, won, lost
    };

    mockLotteryDB.purchases.push(purchase);

    console.log(`[MOCK LOTTERY] Ticket purchased:`, purchase);

    return {
      data: {
        message: "Ticket comprado exitosamente",
        ticket: purchase
      }
    };
  },

  async getUserPurchases(userId) {
    await delay();
    
    const userPurchases = mockLotteryDB.purchases.filter(p => p.userId === userId);
    
    return {
      data: {
        purchases: userPurchases.sort((a, b) => 
          new Date(b.purchaseDate) - new Date(a.purchaseDate)
        ),
        total: userPurchases.length
      }
    };
  },

  async getResults(lotteryId) {
    await delay();
    
    const results = mockLotteryDB.results
      .filter(r => !lotteryId || r.lotteryId === lotteryId)
      .sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate));
    
    return {
      data: {
        results
      }
    };
  }
};

// Export mock DB for debugging
export const getMockLotteryDB = () => mockLotteryDB;

export default lotteryApi;
