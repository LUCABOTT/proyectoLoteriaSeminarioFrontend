import { Ticket, Eye, EyeOff, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { registerUser } from "../services/authService";
import { AuthLayout, AuthSideContent } from "../layouts";
import { Button, Input, Alert } from "../components/ui";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    document.title = "Registrarse - Lotería";
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    lastName: "",
    secondLastName: "",
    dni: "",
    birthDate: "",
    email: "",
    phone: "",
    password: ""
  });

  const isPasswordValid = formData.password.length >= 8;

  const isDniValid = /^\d{13}$/.test(formData.dni);

  const isPhoneValid = /^\d{8}$/.test(formData.phone);

  const validateAge = (dateString) => {
    if (!dateString) return { isValid: false, message: "" };

    const today = new Date();
    const birth = new Date(dateString);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 18) {
      return { isValid: false, message: "Debes tener al menos 18 años para registrarte" };
    }
    if (age > 100) {
      return { isValid: false, message: "Por favor ingresa una fecha de nacimiento válida" };
    }
    return { isValid: true, message: "" };
  };

  const birthDateValidation = validateAge(formData.birthDate);

  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split("T")[0];
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()).toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!birthDateValidation.isValid) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await registerUser(formData);
      setSuccess(response.message);
      setTimeout(() => {
        navigate("/confirmarCuenta");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDni = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 13);
    if (digits.length <= 4) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
  };

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AuthLayout
      side="left"
      title="Crear una cuenta"
      subtitle="Completa el formulario para comenzar a participar"
      sideContent={
        <AuthSideContent
          icon={Ticket}
          title="Comienza a ganar hoy"
          description="Únete a miles de ganadores y participa en sorteos con premios de hasta L. 3 millones."
          stats={[
            { value: "10K+", label: "Usuarios activos" },
            { value: "L. 5M", label: "Premios entregados" }
          ]}
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="firstName"
            type="text"
            label="Primer nombre"
            placeholder="Juan"
            required
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
          <Input
            id="secondName"
            type="text"
            label="Segundo nombre"
            placeholder="Carlos"
            value={formData.secondName}
            onChange={(e) => handleInputChange("secondName", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="lastName"
            type="text"
            label="Primer apellido"
            placeholder="Pérez"
            required
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
          <Input
            id="secondLastName"
            type="text"
            label="Segundo apellido"
            placeholder="García"
            value={formData.secondLastName}
            onChange={(e) => handleInputChange("secondLastName", e.target.value)}
          />
        </div>

        <Input
          id="dni"
          type="text"
          label="DNI"
          placeholder="0000-0000-00000"
          required
          value={formatDni(formData.dni)}
          onChange={(e) => handleInputChange("dni", e.target.value.replace(/\D/g, ""))}
          helperText={formData.dni.length > 0 && !isDniValid ? "El DNI debe tener 13 dígitos" : ""}
        />

        <Input
          id="birthDate"
          type="date"
          label="Fecha de nacimiento"
          required
          value={formData.birthDate}
          onChange={(e) => handleInputChange("birthDate", e.target.value)}
          min={minDate}
          max={maxDate}
          error={formData.birthDate && !birthDateValidation.isValid ? birthDateValidation.message : ""}
          className="scheme-dark"
        />

        <Input
          id="email"
          type="email"
          label="Correo electrónico"
          placeholder="usuario@correo.com"
          required
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />

        <Input
          id="phone"
          type="tel"
          label="Teléfono"
          placeholder="0000-0000"
          required
          value={formatPhone(formData.phone)}
          onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, ""))}
          helperText={formData.phone.length > 0 && !isPhoneValid ? "El teléfono debe tener 8 dígitos" : ""}
        />

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 transition-colors pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {formData.password.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`w-3 h-3 flex items-center justify-center ${
                    isPasswordValid ? "bg-green-500/20 text-green-400" : "bg-zinc-800 text-zinc-600"
                  }`}
                >
                  {isPasswordValid && <Check className="w-2 h-2" />}
                </div>
                <span className={isPasswordValid ? "text-green-400" : "text-zinc-500"}>Mínimo 8 caracteres</span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-0.5 w-4 h-4 bg-zinc-900 border border-zinc-700 checked:bg-amber-400 checked:border-amber-400 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-sm text-zinc-400">
              Acepto los{" "}
              <a href="#" className="text-amber-400 hover:text-amber-300">
                términos y condiciones
              </a>{" "}
              y la{" "}
              <a href="#" className="text-amber-400 hover:text-amber-300">
                política de privacidad
              </a>
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-zinc-950 px-4 text-sm text-zinc-500">o regístrate con</span>
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

      <p className="mt-6 text-center text-sm text-zinc-400">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
          Iniciar sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
