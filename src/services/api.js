// Mock database in memory
const mockDB = {
  users: [],
  pendingActivations: new Map(),
};

// Helper to generate mock token
const generateToken = (email) => {
  return btoa(JSON.stringify({ email, exp: Date.now() + 86400000 }));
};

// Helper to generate activation PIN
const generatePIN = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Simulate API delay
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API methods
const api = {
  async post(endpoint, data) {
    await delay();

    // Login
    if (endpoint === "/auth/login") {
      const { useremail, userpswd } = data;
      const user = mockDB.users.find(
        u => u.email === useremail && u.password === userpswd && u.isActive
      );

      if (!user) {
        throw {
          response: {
            data: { message: "Credenciales inválidas o cuenta no activada" }
          }
        };
      }

      return {
        data: {
          token: generateToken(user.email),
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        }
      };
    }

    // Register
    if (endpoint === "/auth/register") {
      const { email, password, firstName, secondName, lastName, secondLastName, dni, phone, birthDate } = data;

      // Check if user exists
      if (mockDB.users.find(u => u.email === email)) {
        throw {
          response: {
            data: { message: "El correo ya está registrado" }
          }
        };
      }

      if (mockDB.users.find(u => u.dni === dni)) {
        throw {
          response: {
            data: { message: "El DNI ya está registrado" }
          }
        };
      }

      // Generate activation PIN
      const pin = generatePIN();

      // Store pending activation
      mockDB.pendingActivations.set(email, {
        email,
        password,
        firstName,
        secondName,
        lastName,
        secondLastName,
        dni,
        phone,
        birthDate,
        pin,
        createdAt: Date.now()
      });

      console.log(`[MOCK API] Activation PIN for ${email}: ${pin}`);

      return {
        data: {
          message: "Cuenta creada. Revisa tu correo para el código de activación.",
          email
        }
      };
    }

    // Account activation
    if (endpoint === "/auth/confirmarCuenta") {
      const { email, pin } = data;

      const pending = mockDB.pendingActivations.get(email);

      if (!pending) {
        throw {
          response: {
            data: { error: "No hay activación pendiente para este correo" }
          }
        };
      }

      if (pending.pin !== pin) {
        throw {
          response: {
            data: { error: "PIN incorrecto" }
          }
        };
      }

      // Activate user
      const newUser = {
        id: mockDB.users.length + 1,
        email: pending.email,
        password: pending.password,
        firstName: pending.firstName,
        secondName: pending.secondName,
        lastName: pending.lastName,
        secondLastName: pending.secondLastName,
        dni: pending.dni,
        phone: pending.phone,
        birthDate: pending.birthDate,
        isActive: true,
        createdAt: Date.now()
      };

      mockDB.users.push(newUser);
      mockDB.pendingActivations.delete(email);

      console.log(`[MOCK API] User activated: ${email}`);

      return {
        data: {
          message: "Cuenta activada exitosamente"
        }
      };
    }

    throw {
      response: {
        data: { message: "Endpoint no implementado" }
      }
    };
  }
};

// Export mock DB for debugging
export const getMockDB = () => mockDB;

export default api;
