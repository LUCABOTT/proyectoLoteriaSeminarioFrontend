import { Ticket, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { AuthLayout, AuthSideContent } from "../layouts";
import { Button, Input, Alert } from "../components/ui";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const [capsWarning, setCapsWarning] = useState(false);

  useEffect(() => {
    document.title = "Iniciar Sesión - Lotería";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(email, password);
      login(response.token, response.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      side="right"
      title="Bienvenido de vuelta"
      subtitle="Ingresa tus credenciales para acceder a tu cuenta"
      sideContent={
        <AuthSideContent
          icon={Ticket}
          title="Tu suerte te espera"
          description="Accede a tu cuenta y participa en los mejores sorteos con premios millonarios."
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          id="email"
          type="email"
          label="Correo electrónico"
          placeholder="usuario@correo.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

       <div>
  <label
    htmlFor="password"
    className="block text-sm font-medium text-zinc-300 mb-2"
  >
    Contraseña
  </label>
  <div className="relative">
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      required
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      onKeyDown={(e) => setCapsWarning(e.getModifierState("CapsLock"))}
      onKeyUp={(e) => setCapsWarning(e.getModifierState("CapsLock"))}
      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 transition-colors pr-12"
      placeholder="••••••••"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
    >
      {showPassword ? (
        <EyeOff className="w-4 h-4" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
    </button>
  </div>

  {/* ⚠️ Advertencia de mayúsculas activadas */}
  {capsWarning && (
    <p className="text-red-400 text-xs mt-1">
      ⚠️ Bloq Mayús está activado
    </p>
  )}
</div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 bg-zinc-900 border border-zinc-700 checked:bg-amber-400 checked:border-amber-400 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-sm text-zinc-400">Recordarme</span>
          </label>
          <Link
            to="/restablecer-contrasena"
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
              >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-zinc-950 px-4 text-sm text-zinc-500">o continúa con</span>
        </div>
      </div>

      <Button
  variant="google"
  className="w-full flex items-center justify-center gap-2"
  onClick={() => window.location.href = "http://localhost:3001/api/auth/google"}
>
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
  Continuar con Google
</Button>

      <p className="mt-8 text-center text-sm text-zinc-400">
        ¿No tienes una cuenta?{" "}
        <Link to="/register" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
          Regístrate
        </Link>
        <br />

  ¿Tu cuenta está desactivada?{" "}
  <Link to="/reactivar-cuenta" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
    Reactivar cuenta
  </Link>
      </p>
    </AuthLayout>
  );
}
