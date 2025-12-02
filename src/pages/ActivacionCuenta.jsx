import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { activateAccount } from "../services/authService";
import { CheckCircle, Mail, Lock } from "lucide-react";
import { useEffect } from "react";

export default function ActivacionCuenta() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Activar Cuenta - Lotería";
  }, []);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await activateAccount(email, pin);
      alert(response.message);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-400/10 border border-amber-400/20 mb-4">
            <CheckCircle className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">
            Activar Cuenta
          </h1>
          <p className="text-zinc-400">
            Ingresa el código PIN que se mostró en la consola
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900 border border-zinc-800 p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleConfirm} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="usuario@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* PIN Input */}
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-zinc-300 mb-2">
                Código PIN (6 dígitos)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="pin"
                  type="text"
                  placeholder="123456"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors font-mono text-lg tracking-widest"
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Revisa la consola del navegador (F12) para encontrar tu PIN
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-amber-400 text-zinc-950 font-semibold hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Confirmando..." : "Activar Cuenta"}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500">
            ¿Ya activaste tu cuenta?{" "}
            <a href="/login" className="text-amber-400 hover:text-amber-300 transition-colors">
              Iniciar Sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}