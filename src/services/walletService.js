import apiClient from "./apiClient";

/**
 * Obtener saldo actual de la billetera del usuario
 */
export const getSaldo = async () => {
  try {
    const res = await apiClient.get("/api/billetera/saldo");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error al obtener saldo");
  }
};

/**
 * Obtener historial de transacciones
 * @param {number} limite - Número de transacciones a obtener (default: 50)
 * @param {number} pagina - Página de resultados (default: 1)
 */
export const getHistorial = async (limite = 50, pagina = 1) => {
  try {
    const res = await apiClient.get("/api/billetera/historial", {
      params: { limite, pagina }
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error al obtener historial");
  }
};

/**
 * Recargar saldo de forma manual (para testing)
 * @param {number} monto - Monto a recargar en HNL
 * @param {string} moneda - "HNL" o "USD" (opcional)
 */
export const recargarSaldo = async (monto, moneda = "HNL") => {
  try {
    const res = await apiClient.post("/api/billetera/recargar", {
      monto,
      moneda
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error al recargar saldo");
  }
};

/**
 * Crear orden de pago con PayPal
 * @param {number} monto - Monto a recargar
 */
export const crearOrdenPayPal = async (monto) => {
  try {
    const res = await apiClient.post("/api/billetera/paypal/crear", {
      monto
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error al crear orden PayPal");
  }
};

/**
 * Capturar orden de PayPal después de la aprobación
 * @param {string} ordenId - ID de la orden de PayPal
 */
export const capturarOrdenPayPal = async (ordenId) => {
  try {
    const res = await apiClient.post("/api/billetera/paypal/capturar", {
      orden: ordenId
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Error al capturar pago");
  }
};
