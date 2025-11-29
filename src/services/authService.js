import api from "./api"; // tu api.js con baseURL

export const loginUser = async (useremail, userpswd) => {
  try {
    const res = await api.post("/auth/login", { useremail, userpswd });
    return res.data.token; // devuelve JWT
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error de conexión");
  }
};
