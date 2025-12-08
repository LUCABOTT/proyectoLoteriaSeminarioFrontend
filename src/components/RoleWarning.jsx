import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { AlertTriangle, X } from "lucide-react";

export default function RoleWarning() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Verificar si el usuario tiene roles
      const hasValidRoles = user.roles && Array.isArray(user.roles) && user.roles.length > 0;
      setShow(!hasValidRoles);
    } else {
      setShow(false);
    }
  }, [user, isAuthenticated]);

  if (!show) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-amber-500 text-zinc-950 p-4 rounded-lg shadow-xl border-2 border-amber-600 animate-pulse">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">⚠️ Sesión desactualizada</h3>
            <p className="text-sm mb-3">
              Tu sesión no tiene información de roles. Esto ocurre cuando el sistema se actualizó. Por favor, cierra
              sesión y vuelve a iniciar sesión.
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-zinc-950 text-amber-400 px-4 py-2 rounded font-semibold hover:bg-zinc-800 transition-colors"
            >
              Cerrar sesión ahora
            </button>
          </div>
          <button onClick={() => setShow(false)} className="text-zinc-950 hover:text-zinc-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
