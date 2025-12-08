import { useState } from "react";
import { Link } from "react-router-dom";
import {
  generarPinReactivacion,
  reactivarCuenta
} from "../services/authService"; 
import { Spinner } from "../components/ui/Spinner";

export default function ReactivarCuentaPage() {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [pinEnviado, setPinEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // -----------------------------
  // 1) ENVIAR PIN DE REACTIVACIÓN
  // -----------------------------
  const handleEnviarPin = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);

    try {
      const res = await generarPinReactivacion({ useremail: email });
      setPinEnviado(true);
      setMensaje(res.message || "Se ha enviado un PIN a tu correo.");
    } catch (err) {
      setError(err.response?.data?.message || "Error enviando PIN.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // 2) REACTIVAR CUENTA
  // -----------------------------
  const handleReactivarCuenta = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);

    try {
      const res = await reactivarCuenta({
        useremail: email,
        pin,
        nuevaContrasena: newPassword,
      });

      setMensaje(res.message || "Tu cuenta ha sido reactivada exitosamente.");
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo reactivar la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-700">

        <h1 className="text-2xl font-bold text-amber-400 text-center mb-6">
          Reactivar Cuenta
        </h1>

        {/* MENSAJES */}
        {mensaje && (
          <div className="mb-4 text-green-400 text-center font-medium">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="mb-4 text-red-400 text-center font-medium">
            {error}
          </div>
        )}

        {/* -----------------------------
            FORM 1: ENVIAR PIN
        ----------------------------- */}
        {!pinEnviado && (
          <form onSubmit={handleEnviarPin} className="space-y-4">
            <div>
              <label className="text-zinc-300 text-sm">Correo electrónico</label>
              <input
                type="email"
                className="w-full mt-1 px-3 py-2 rounded-md bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:border-amber-400"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 transition-colors py-2 rounded-md font-semibold text-zinc-900"
            >
              {loading ? <Spinner /> : "Enviar PIN de reactivación"}
            </button>
          </form>
        )}

        {/* -----------------------------
            FORM 2: INGRESAR PIN + NUEVA CONTRASEÑA
        ----------------------------- */}
        {pinEnviado && (
          <form onSubmit={handleReactivarCuenta} className="space-y-4 mt-4">

            <div>
              <label className="text-zinc-300 text-sm">PIN recibido</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 rounded-md bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:border-amber-400"
                placeholder="Escribe el PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-zinc-300 text-sm">Nueva contraseña</label>
              <input
                type="password"
                className="w-full mt-1 px-3 py-2 rounded-md bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:border-amber-400"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 transition-colors py-2 rounded-md font-semibold text-zinc-900"
            >
              {loading ? <Spinner /> : "Reactivar Cuenta"}
            </button>
          </form>
        )}

        {/* VOLVER */}
        <p className="mt-8 text-center text-sm text-zinc-400">
          <Link
            to="/login"
            className="text-amber-300 hover:text-amber-200 transition-colors"
          >
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}