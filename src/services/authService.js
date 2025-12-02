import api from "./api";

export const loginUser = async (useremail, userpswd) => {
  try {
    const res = await api.post("/auth/login", { useremail, userpswd });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error de conexión");
  }
};

export const registerUser = async (userData) => {
  try {
    const res = await api.post("/auth/register", userData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al registrar");
  }
};

export const activateAccount = async (email, pin) => {
  try {
    const res = await api.post("/auth/confirmarCuenta", { email, pin });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error al activar cuenta");
  }
};
