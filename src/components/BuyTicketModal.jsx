import { useState, useEffect } from "react";
import { X, Ticket, AlertCircle, CheckCircle, Loader, Sparkles, Calendar, DollarSign, Hash } from "lucide-react";
import { Card, CardBody, Alert, Button, Badge } from "./ui";
import { useTickets } from "../hooks/useTickets";

export default function BuyTicketModal({ sorteo, juego, isOpen, onClose, onSuccess }) {
  const { comprarTicket } = useTickets(false);
  const [numeros, setNumeros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log("BuyTicketModal abierto:", { sorteo, juego });
      setNumeros([]);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, sorteo, juego]);

  if (!isOpen) return null;

  // Validar que sorteo y juego existan
  if (!sorteo) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-zinc-900 border border-zinc-800">
          <CardBody className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">Error</h3>
            <p className="text-zinc-400 mb-6">No se pudo cargar la información del sorteo.</p>
            <Button onClick={onClose} variant="secondary" className="w-full">
              Cerrar
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!juego) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-zinc-900 border border-zinc-800">
          <CardBody className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">Error de Configuración</h3>
            <p className="text-zinc-400 mb-6">
              El juego no está configurado correctamente. Por favor contacta al administrador.
            </p>
            <Button onClick={onClose} variant="secondary" className="w-full">
              Cerrar
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Validar campos del juego
  if (!juego.PrecioJuego || !juego.CantidadNumeros || juego.RangoMin === undefined || juego.RangoMax === undefined) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-zinc-900 border border-zinc-800">
          <CardBody className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">Configuración Incompleta</h3>
            <p className="text-zinc-400 mb-6">Faltan datos del juego (precio, cantidad de números o rango).</p>
            <Button onClick={onClose} variant="secondary" className="w-full">
              Cerrar
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Validar estado del sorteo
  const sorteoValido = sorteo.Estado === "abierto";
  const fechaCierre = new Date(sorteo.Cierre);
  const ahora = new Date();
  const tiempoRestante = fechaCierre - ahora;
  const sorteoExpirado = tiempoRestante <= 0;

  const handleNumeroChange = (index, valor) => {
    const num = parseInt(valor, 10);

    if (isNaN(num) || num < juego.RangoMin || num > juego.RangoMax) {
      return;
    }

    const nuevosNumeros = [...numeros];
    nuevosNumeros[index] = num;
    setNumeros(nuevosNumeros);
    setError(null);
  };

  const handleRandomizar = () => {
    const nuevosNumeros = [];
    for (let i = 0; i < juego.CantidadNumeros; i++) {
      const random = Math.floor(Math.random() * (juego.RangoMax - juego.RangoMin + 1)) + juego.RangoMin;
      nuevosNumeros.push(random);
    }
    setNumeros(nuevosNumeros);
    setError(null);
  };

  const handleComprar = async () => {
    if (numeros.length !== juego.CantidadNumeros) {
      setError(`Debes seleccionar ${juego.CantidadNumeros} números`);
      return;
    }

    if (numeros.some((n) => isNaN(n) || n < juego.RangoMin || n > juego.RangoMax)) {
      setError(`Todos los números deben estar entre ${juego.RangoMin} y ${juego.RangoMax}`);
      return;
    }

    if (!juego.PermiteRepetidos) {
      const unicos = new Set(numeros);
      if (unicos.size !== numeros.length) {
        setError("No se permiten números duplicados en este juego");
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const resultado = await comprarTicket(sorteo.Id, numeros);

      if (resultado.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess && onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(resultado.error || "Error al comprar boleto");
      }
    } catch (err) {
      setError(err.message || "Error inesperado al comprar boleto");
    } finally {
      setLoading(false);
    }
  };

  const getJuegoColors = () => {
    const nombre = (juego?.Nombre || "").toLowerCase();
    if (nombre.includes("pega 3")) return "from-yellow-400 to-yellow-600";
    if (nombre.includes("diaria")) return "from-red-400 to-red-600";
    if (nombre.includes("pegados") || nombre.includes("pega 2")) return "from-blue-400 to-blue-600";
    if (nombre.includes("super premio")) return "from-green-400 to-green-600";
    return "from-purple-400 to-purple-600";
  };

  const colors = getJuegoColors();
  const total = parseFloat(juego.PrecioJuego) || 0;
  const numerosCompletos = numeros.length === juego.CantidadNumeros && numeros.every((n) => !isNaN(n));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800">
        <CardBody className="p-0">
          {/* Header con gradiente */}
          <div className={`bg-linear-to-r ${colors} p-6 relative`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition text-white"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Ticket className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">Comprar Boleto</h2>
                <p className="text-white/90 font-medium">{juego.Nombre}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Validaciones */}
            {!sorteoValido && (
              <Alert variant="error" className="mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Sorteo no disponible</p>
                    <p className="text-sm">Este sorteo está en estado: {sorteo.Estado}</p>
                  </div>
                </div>
              </Alert>
            )}

            {sorteoExpirado && (
              <Alert variant="warning" className="mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Sorteo cerrado</p>
                    <p className="text-sm">La fecha de cierre ya pasó</p>
                  </div>
                </div>
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-green-400">¡Boleto comprado exitosamente! 🎉</p>
                    <p className="text-sm text-green-300">Redirigiendo...</p>
                  </div>
                </div>
              </Alert>
            )}

            {error && (
              <Alert variant="error" className="mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              </Alert>
            )}

            {/* Información del juego */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-zinc-800 border-zinc-700">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <p className="text-xs text-zinc-400 font-medium">Precio</p>
                </div>
                <p className="text-amber-400 text-xl font-bold">L {total.toFixed(2)}</p>
              </Card>

              <Card className="p-4 bg-zinc-800 border-zinc-700">
                <div className="flex items-center gap-3 mb-2">
                  <Hash className="w-4 h-4 text-blue-400" />
                  <p className="text-xs text-zinc-400 font-medium">Números</p>
                </div>
                <p className="text-zinc-100 text-xl font-bold">{juego.CantidadNumeros}</p>
              </Card>

              <Card className="p-4 bg-zinc-800 border-zinc-700">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <p className="text-xs text-zinc-400 font-medium">Rango</p>
                </div>
                <p className="text-zinc-100 text-xl font-bold">
                  {juego.RangoMin}-{juego.RangoMax}
                </p>
              </Card>

              <Card className="p-4 bg-zinc-800 border-zinc-700">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <p className="text-xs text-zinc-400 font-medium">Cierre</p>
                </div>
                <p className="text-zinc-100 text-sm font-bold">
                  {new Date(sorteo.Cierre).toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </Card>
            </div>

            {juego.Descripcion && (
              <Card className="p-4 bg-zinc-800/50 border-zinc-700 mb-6">
                <p className="text-zinc-300 text-sm">{juego.Descripcion}</p>
              </Card>
            )}

            {/* Selección de números */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-zinc-100">Selecciona tus números</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRandomizar}
                  disabled={loading || !sorteoValido || sorteoExpirado}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Aleatorio
                </Button>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {Array.from({ length: juego.CantidadNumeros }).map((_, index) => (
                  <div key={index} className="relative">
                    <input
                      type="number"
                      min={juego.RangoMin}
                      max={juego.RangoMax}
                      value={numeros[index] || ""}
                      onChange={(e) => handleNumeroChange(index, e.target.value)}
                      placeholder={`#${index + 1}`}
                      disabled={loading || !sorteoValido || sorteoExpirado}
                      className="w-full px-3 py-3 text-center text-lg font-bold bg-zinc-800 border-2 border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {numeros[index] && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="text-white" size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-zinc-400 text-sm mt-3 text-center">
                {numerosCompletos
                  ? "✅ Todos los números seleccionados"
                  : `Faltan ${juego.CantidadNumeros - numeros.filter((n) => !isNaN(n)).length} números`}
              </p>
            </div>

            {/* Resumen */}
            <Card className="p-6 bg-zinc-800 border-zinc-700 mb-6">
              <h4 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                Resumen de Compra
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Juego:</span>
                  <span className="text-zinc-100 font-bold">{juego.Nombre}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Números seleccionados:</span>
                  <Badge variant={numerosCompletos ? "success" : "warning"}>
                    {numeros.filter((n) => !isNaN(n)).length} / {juego.CantidadNumeros}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-zinc-700">
                  <span className="text-zinc-400 font-medium">Total a pagar:</span>
                  <span className="text-amber-400 font-bold text-2xl">L {total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Botones */}
            <div className="flex gap-4">
              <Button variant="secondary" onClick={onClose} disabled={loading} className="flex-1">
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleComprar}
                disabled={loading || !numerosCompletos || !sorteoValido || sorteoExpirado}
                isLoading={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Ticket className="mr-2" size={20} />
                    Comprar por L {total.toFixed(2)}
                  </>
                )}
              </Button>
            </div>

            <p className="text-zinc-500 text-xs text-center mt-4">
              🔒 El monto será debitado automáticamente de tu billetera
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
