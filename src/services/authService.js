import apiClient from "./apiClient";


export const loginUser = async (useremail, userpswd) => {
  try {
    const res = await apiClient.post("/api/auth/login", {
      useremail,
      userpswd
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error de conexión");
  }
};

export const registerUser = async (userData) => {
  try {
    // Mapear campos del frontend al formato del backend
    const backendData = {
      primerNombre: userData.firstName,
      segundoNombre: userData.secondName || "",
      primerApellido: userData.lastName,
      segundoApellido: userData.secondLastName || "",
      identidad: userData.dni,
      fechaNacimiento: userData.birthDate,
      useremail: userData.email,
      userpswd: userData.password,
      telefono: userData.phone
    };
    
    const res = await apiClient.post("/api/auth/register", backendData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al registrar");
  }
};

export const activateAccount = async (email, pin) => {
  try {
    const res = await apiClient.post("/api/auth/confirmarCuenta", {
      email,
      pin
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error al activar cuenta");
  }
};

export const getUserProfile = async () => {
  try {
    const res = await apiClient.get("/api/apiUsuarios/perfil");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.msj || "Error al obtener perfil");
  }
};

export const generarPinReactivacion = async (data) => {
  try {
    const res = await apiClient.post("/api/auth/pinreactivacion", data);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Error enviando PIN de reactivación"
    );
  }
};



export const reactivarCuenta = async (data) => {
  try {
    const res = await apiClient.post("/api/auth/reactivarCuenta", data);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Error al reactivar la cuenta"
    );
  }
};

export const solicitarResetPassword = async (useremail) => {
  try {
    const res = await apiClient.post("/api/auth/solicitar-reset", { useremail });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error solicitando PIN de recuperación");
  }
};

export const cambiarContrasena = async ({ useremail, pin, nuevaContrasena }) => {
  try {
    const res = await apiClient.post("/api/auth/cambiar-contrasena", { useremail, pin, nuevaContrasena });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error al cambiar la contraseña");
  }
};