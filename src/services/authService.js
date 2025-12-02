import { mockAuthAPI } from "./mockAPI";

export const loginUser = async (useremail, userpswd) => {
  try {
    const res = await mockAuthAPI.login(useremail, userpswd);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error de conexión");
  }
};

export const registerUser = async (userData) => {
  try {
    const res = await mockAuthAPI.register(userData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al registrar");
  }
};

export const activateAccount = async (email, pin) => {
  try {
    const res = await mockAuthAPI.activateAccount(email, pin);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error al activar cuenta");
  }
};

