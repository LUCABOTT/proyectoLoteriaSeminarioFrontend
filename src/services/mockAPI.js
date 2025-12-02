// ============================================
// MOCK DATABASE - MEMORIA LOCAL
// ============================================
// Este archivo simula un backend completo
// Reemplazar con llamadas API reales cuando esté listo

const mockDB = {
  // Usuarios y autenticación
  users: [], // Usuarios registrados y activados
  pendingActivations: new Map(), // Activaciones pendientes { email: { userData, pin } }

  // Sistema de loterías
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
      active: true,
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
      active: true,
    },
  ],

  // Compras de tickets
  purchases: [], // { id, userId, lotteryId, numbers, purchaseDate, ticketNumber, price, drawDate, status }

  // Resultados de sorteos
  results: [], // { lotteryId, drawDate, winningNumbers, winners }
};

// ============================================
// UTILIDADES
// ============================================

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const generateTicketNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `TK-${timestamp}-${random}`;
};

const calculateNextDraw = (lottery) => {
  const now = new Date();
  const today = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.

  if (lottery.type === "daily") {
    const nextDraw = new Date();
    const [hours, minutes] = lottery.drawTime.split(":");
    nextDraw.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    if (now > nextDraw) {
      nextDraw.setDate(nextDraw.getDate() + 1);
    }

    return nextDraw.toISOString();
  }

  if (lottery.type === "weekly") {
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const drawDayNumbers = lottery.drawDays.map((day) => dayNames.indexOf(day));

    let daysUntilDraw = 7;
    for (const drawDay of drawDayNumbers.sort((a, b) => a - b)) {
      const daysAhead = (drawDay - today + 7) % 7;
      if (daysAhead < daysUntilDraw && daysAhead > 0) {
        daysUntilDraw = daysAhead;
      }
    }

    if (daysUntilDraw === 0) {
      const [hours, minutes] = lottery.drawTime.split(":");
      const drawTime = new Date();
      drawTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      if (now > drawTime) {
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

// ============================================
// MOCK API - AUTENTICACIÓN
// ============================================

export const mockAuthAPI = {
  async register(userData) {
    await delay();

    // Validar email único
    if (mockDB.users.find((u) => u.email === userData.email)) {
      throw {
        response: {
          data: { message: "El correo ya está registrado" },
        },
      };
    }

    // Validar DNI único
    if (mockDB.users.find((u) => u.dni === userData.dni)) {
      throw {
        response: {
          data: { message: "El DNI ya está registrado" },
        },
      };
    }

    // Generar PIN de activación
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar en activaciones pendientes
    mockDB.pendingActivations.set(userData.email, {
      userData: {
        ...userData,
        createdAt: Date.now(),
      },
      pin,
    });

    console.log(`[MOCK API] Activation PIN for ${userData.email}: ${pin}`);

    return {
      data: {
        message: "Usuario registrado. Revisa la consola para el PIN de activación.",
        email: userData.email,
      },
    };
  },

  async activateAccount(email, pin) {
    await delay();

    const pending = mockDB.pendingActivations.get(email);

    if (!pending) {
      throw {
        response: {
          data: { error: "No hay activación pendiente para este email" },
        },
      };
    }

    if (pending.pin !== pin) {
      throw {
        response: {
          data: { error: "PIN incorrecto" },
        },
      };
    }

    // Mover a usuarios activos
    const user = {
      id: mockDB.users.length + 1,
      ...pending.userData,
      isActive: true,
    };

    mockDB.users.push(user);
    mockDB.pendingActivations.delete(email);

    console.log("[MOCK API] Account activated:", user.email);

    return {
      data: {
        message: "Cuenta activada exitosamente",
      },
    };
  },

  async login(useremail, userpswd) {
    await delay();

    const user = mockDB.users.find((u) => u.email === useremail);

    if (!user) {
      throw {
        response: {
          data: { message: "Credenciales incorrectas" },
        },
      };
    }

    if (user.password !== userpswd) {
      throw {
        response: {
          data: { message: "Credenciales incorrectas" },
        },
      };
    }

    if (!user.isActive) {
      throw {
        response: {
          data: { message: "Cuenta no activada. Por favor activa tu cuenta primero." },
        },
      };
    }

    // Generar token mock
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email, timestamp: Date.now() }));

    console.log("[MOCK API] User logged in:", user.email);

    return {
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          secondName: user.secondName,
          lastName: user.lastName,
          secondLastName: user.secondLastName,
        },
      },
    };
  },
};

// ============================================
// MOCK API - LOTERÍAS
// ============================================

export const mockLotteryAPI = {
  async getLotteries() {
    await delay();

    const lotteriesWithDates = mockDB.lotteries.map((lottery) => ({
      ...lottery,
      nextDraw: calculateNextDraw(lottery),
    }));

    return {
      data: {
        lotteries: lotteriesWithDates,
        totalActive: lotteriesWithDates.filter((l) => l.active).length,
      },
    };
  },

  async getLotteryById(id) {
    await delay();

    const lottery = mockDB.lotteries.find((l) => l.id === id);

    if (!lottery) {
      throw {
        response: {
          data: { message: "Lotería no encontrada" },
        },
      };
    }

    return {
      data: {
        lottery: {
          ...lottery,
          nextDraw: calculateNextDraw(lottery),
        },
      },
    };
  },

  async purchaseTicket(userId, lotteryId, numbers) {
    await delay();

    const lottery = mockDB.lotteries.find((l) => l.id === lotteryId);

    if (!lottery) {
      throw {
        response: {
          data: { message: "Lotería no encontrada" },
        },
      };
    }

    // Validar cantidad de números
    if (numbers.length !== lottery.numbersCount) {
      throw {
        response: {
          data: { message: `Debes seleccionar ${lottery.numbersCount} números` },
        },
      };
    }

    // Validar rango de números
    const minNum = lottery.minNumber || 0;
    const maxNum = lottery.maxNumber;

    for (const num of numbers) {
      if (num < minNum || num > maxNum) {
        throw {
          response: {
            data: { message: `Los números deben estar entre ${minNum} y ${maxNum}` },
          },
        };
      }
    }

    // Crear ticket
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
      status: "pending", // pending, won, lost
    };

    mockDB.purchases.push(purchase);

    console.log(`[MOCK LOTTERY] Ticket purchased:`, purchase);

    return {
      data: {
        message: "Ticket comprado exitosamente",
        ticket: purchase,
      },
    };
  },

  async getUserPurchases(userId) {
    await delay();

    const userPurchases = mockDB.purchases.filter((p) => p.userId === userId);

    return {
      data: {
        purchases: userPurchases.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)),
        total: userPurchases.length,
        totalSpent: userPurchases.reduce((sum, p) => sum + p.price, 0),
        activePurchases: userPurchases.filter((p) => p.status === "pending").length,
      },
    };
  },

  async getResults(lotteryId) {
    await delay();

    const results = mockDB.results
      .filter((r) => !lotteryId || r.lotteryId === lotteryId)
      .sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate));

    return {
      data: {
        results,
      },
    };
  },
};

// ============================================
// DEBUGGING - Exponer DB en consola
// ============================================

if (typeof window !== "undefined") {
  window.getMockDB = () => ({
    users: mockDB.users,
    pendingActivations: Array.from(mockDB.pendingActivations.entries()),
    lotteries: mockDB.lotteries,
    purchases: mockDB.purchases,
    results: mockDB.results,
    stats: {
      totalUsers: mockDB.users.length,
      pendingActivations: mockDB.pendingActivations.size,
      totalPurchases: mockDB.purchases.length,
      totalSpent: mockDB.purchases.reduce((sum, p) => sum + p.price, 0),
    },
  });

  console.log("[MOCK API] Database disponible en: window.getMockDB()");
}

export default mockDB;
