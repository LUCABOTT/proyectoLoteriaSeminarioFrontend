import { useState, useEffect } from 'react';
import { X, Ticket, AlertCircle, CheckCircle, Loader, Sparkles } from 'lucide-react';
import { Card, CardBody, Alert, Button } from './ui';
import { useTickets } from '../hooks/useTickets';

export default function BuyTicketModal({ sorteo, juego, isOpen, onClose, onSuccess }) {
  const { comprarTicket } = useTickets(false);
  const [numeros, setNumeros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Debug: Ver qué datos llegan
  useEffect(() => {
    if (isOpen) {
      console.log('BuyTicketModal abierto:', { sorteo, juego });
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
        <Card className="w-full max-w-md bg-gray-900 border-2 border-red-500">
          <CardBody className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Error</h3>
            <p className="text-gray-300 mb-6">
              No se pudo cargar la información del sorteo.
            </p>
            <Button onClick={onClose} className="bg-gray-700 hover:bg-gray-600">
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
        <Card className="w-full max-w-md bg-gray-900 border-2 border-red-500">
          <CardBody className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Error de Configuración</h3>
            <p className="text-gray-300 mb-6">
              El juego no está configurado correctamente. Por favor contacta al administrador.
            </p>
            <Button onClick={onClose} className="bg-gray-700 hover:bg-gray-600">
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
        <Card className="w-full max-w-md bg-gray-900 border-2 border-red-500">
          <CardBody className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Configuración Incompleta</h3>
            <p className="text-gray-300 mb-6">
              Faltan datos del juego (precio, cantidad de números o rango).
            </p>
            <Button onClick={onClose} className="bg-gray-700 hover:bg-gray-600">
              Cerrar
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Validar estado del sorteo
  const sorteoValido = sorteo.Estado === 'abierto';
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

    if (numeros.some(n => isNaN(n) || n < juego.RangoMin || n > juego.RangoMax)) {
      setError(`Todos los números deben estar entre ${juego.RangoMin} y ${juego.RangoMax}`);
      return;
    }

    if (!juego.PermiteRepetidos) {
      const unicos = new Set(numeros);
      if (unicos.size !== numeros.length) {
        setError('No se permiten números duplicados en este juego');
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
        setError(resultado.error || 'Error al comprar boleto');
      }
    } catch (err) {
      setError(err.message || 'Error inesperado al comprar boleto');
    } finally {
      setLoading(false);
    }
  };

  const getJuegoColors = () => {
    const nombre = (juego?.Nombre || '').toLowerCase();
    if (nombre.includes('pega 3')) return { bg: 'from-yellow-400 to-yellow-600', text: 'text-yellow-900', glow: 'shadow-yellow-500/50' };
    if (nombre.includes('diaria')) return { bg: 'from-red-400 to-red-600', text: 'text-red-900', glow: 'shadow-red-500/50' };
    if (nombre.includes('pegados') || nombre.includes('pega 2')) return { bg: 'from-blue-400 to-blue-600', text: 'text-blue-900', glow: 'shadow-blue-500/50' };
    if (nombre.includes('super premio')) return { bg: 'from-green-400 to-green-600', text: 'text-green-900', glow: 'shadow-green-500/50' };
    return { bg: 'from-purple-400 to-purple-600', text: 'text-purple-900', glow: 'shadow-purple-500/50' };
  };

  const colors = getJuegoColors();
  const total = parseFloat(juego.PrecioJuego) || 0;
  const numerosCompletos = numeros.length === juego.CantidadNumeros && numeros.every(n => !isNaN(n));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-2 border-yellow-500 shadow-2xl animate-slideUp">
        <CardBody className="p-8">
          {/* Header */}
          <div className={`bg-gradient-to-r ${colors.bg} p-6 rounded-t-lg -mt-8 -mx-8 mb-6`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                    Comprar Boleto
                  </h2>
                  <p className="text-white/90 font-medium">{juego.Nombre}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition text-white"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Validaciones */}
          {!sorteoValido && (
            <Alert variant="error" className="mb-6 bg-red-900/20 border-red-700">
              <AlertCircle className="mr-2" size={20} />
              <div>
                <p className="font-bold">Sorteo no disponible</p>
                <p className="text-sm">Este sorteo está en estado: {sorteo.Estado}</p>
              </div>
            </Alert>
          )}

          {sorteoExpirado && (
            <Alert variant="warning" className="mb-6 bg-yellow-900/20 border-yellow-700">
              <AlertCircle className="mr-2" size={20} />
              <div>
                <p className="font-bold">Sorteo cerrado</p>
                <p className="text-sm">La fecha de cierre ya pasó</p>
              </div>
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-6 bg-green-900/20 border-green-700 animate-bounce">
              <CheckCircle className="mr-2" size={20} />
              <div>
                <p className="font-bold text-green-400">¡Boleto comprado exitosamente! 🎉</p>
                <p className="text-sm text-green-300">Redirigiendo...</p>
              </div>
            </Alert>
          )}

          {error && (
            <Alert variant="error" className="mb-6 bg-red-900/20 border-red-700">
              <AlertCircle className="mr-2" size={20} />
              <p className="text-red-400">{error}</p>
            </Alert>
          )}

          {/* Información del juego */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-xs font-medium mb-1">Precio</p>
              <p className="text-yellow-400 text-xl font-bold">
                L {total.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-xs font-medium mb-1">Números</p>
              <p className="text-white text-xl font-bold">{juego.CantidadNumeros}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-xs font-medium mb-1">Rango</p>
              <p className="text-white text-xl font-bold">
                {juego.RangoMin}-{juego.RangoMax}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-xs font-medium mb-1">Cierre</p>
              <p className="text-white text-sm font-bold">
                {new Date(sorteo.Cierre).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>

          {juego.Descripcion && (
            <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg mb-6">
              <p className="text-gray-300 text-sm">{juego.Descripcion}</p>
            </div>
          )}

          {/* Selección de números */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Selecciona tus números
              </h3>
              <Button
                variant="warning"
                size="sm"
                onClick={handleRandomizar}
                disabled={loading || !sorteoValido || sorteoExpirado}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              >
                🎲 Aleatorio
              </Button>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {Array.from({ length: juego.CantidadNumeros }).map((_, index) => (
                <div key={index} className="relative">
                  <input
                    type="number"
                    min={juego.RangoMin}
                    max={juego.RangoMax}
                    value={numeros[index] || ''}
                    onChange={(e) => handleNumeroChange(index, e.target.value)}
                    placeholder={`#${index + 1}`}
                    disabled={loading || !sorteoValido || sorteoExpirado}
                    className="w-full px-3 py-3 text-center text-lg font-bold bg-gray-800 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {numeros[index] && (
                    <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${colors.bg} rounded-full flex items-center justify-center shadow-lg animate-bounce`}>
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="text-gray-400 text-sm mt-3 text-center">
              {numerosCompletos
                ? '✅ Todos los números seleccionados'
                : `Faltan ${juego.CantidadNumeros - numeros.filter(n => !isNaN(n)).length} números`}
            </p>
          </div>

          {/* Resumen */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-yellow-500 p-6 rounded-lg mb-6">
            <h4 className="text-lg font-bold text-yellow-400 mb-4">
              📋 Resumen de Compra
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Juego:</span>
                <span className="text-white font-bold">{juego.Nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Números seleccionados:</span>
                <span className="text-white font-bold">
                  {numeros.filter(n => !isNaN(n)).length} / {juego.CantidadNumeros}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Precio del boleto:</span>
                <span className="text-yellow-400 font-bold text-lg">
                  L {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold"
            >
              Cancelar
            </Button>
            <button
              onClick={handleComprar}
              disabled={loading || !numerosCompletos || !sorteoValido || sorteoExpirado}
              className={`
                flex-1 relative overflow-hidden
                bg-gradient-to-r ${colors.bg}
                text-white font-bold py-3 px-6 rounded-lg
                transform transition-all duration-300
                hover:scale-105 hover:shadow-2xl ${colors.glow}
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                group
              `}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="animate-pulse" size={20} />
                    <span>Comprar por L {total.toFixed(2)}</span>
                    <Ticket size={20} />
                  </>
                )}
              </div>
              {!loading && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              )}
            </button>
          </div>

          <p className="text-gray-500 text-xs text-center mt-4">
            🔒 El monto será debitado automáticamente de tu billetera
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
