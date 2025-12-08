import { Card, CardBody, Badge } from '../ui';
import { X, Printer } from 'lucide-react';

export const TicketDetail = ({ ticket, numeros, juego, sorteo, onClose }) => {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 2
    }).format(monto);
  };

  const getEstadoColor = (estado) => {
    const estadoLower = (estado || '').toLowerCase();
    if (estadoLower === 'pagado') return 'bg-green-500';
    if (estadoLower === 'pendiente') return 'bg-yellow-500';
    if (estadoLower === 'ganador') return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const getJuegoColors = (nombreJuego) => {
    const nombre = (nombreJuego || '').toLowerCase();
    if (nombre.includes('pega 3')) return 'from-yellow-400 to-yellow-600';
    if (nombre.includes('diaria')) return 'from-red-400 to-red-600';
    if (nombre.includes('pegados') || nombre.includes('pega 2')) return 'from-blue-400 to-blue-600';
    if (nombre.includes('super premio')) return 'from-green-400 to-green-600';
    return 'from-purple-400 to-purple-600';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-screen overflow-y-auto">
        <CardBody className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Detalle del Boleto
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Información Principal */}
          <div className={`bg-gradient-to-r ${getJuegoColors(juego?.Nombre)} p-6 rounded-lg mb-6 text-white`}>
            <h3 className="text-2xl font-bold mb-2">{juego?.Nombre || 'Desconocido'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-90">Número de Boleto</p>
                <p className="text-lg font-bold">#{ticket.IdTicket}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Estado</p>
                <Badge className="mt-1" variant={ticket.Estado === 'pagado' ? 'success' : 'warning'}>
                  {ticket.Estado}
                </Badge>
              </div>
            </div>
          </div>

          {/* Números Ganadores */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              Números Comprados
            </h4>
            <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg">
              {numeros.map((num, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${getJuegoColors(juego?.Nombre)} text-white font-bold rounded-full text-lg shadow-md`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Información del Sorteo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="text-sm font-bold text-gray-600 mb-3">INFORMACIÓN DE COMPRA</h5>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Fecha de Compra</p>
                  <p className="text-gray-900 font-medium">{formatearFecha(ticket.FechaCompra)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Monto Pagado</p>
                  <p className="text-gray-900 font-bold text-lg">{formatearMoneda(ticket.Total)}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="text-sm font-bold text-gray-600 mb-3">INFORMACIÓN DEL SORTEO</h5>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Fecha de Cierre</p>
                  <p className="text-gray-900 font-medium">
                    {sorteo ? formatearFecha(sorteo.Cierre) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estado del Sorteo</p>
                  <p className="text-gray-900 font-medium capitalize">{sorteo?.Estado || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles Adicionales */}
          {juego && (
            <div className="p-4 bg-blue-50 rounded-lg mb-6">
              <h5 className="text-sm font-bold text-blue-900 mb-3">DETALLES DEL JUEGO</h5>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-blue-700">Precio por Número</p>
                  <p className="text-blue-900 font-bold">{formatearMoneda(juego.PrecioJuego)}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700">Cantidad de Números</p>
                  <p className="text-blue-900 font-bold">{juego.CantidadNumeros}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700">Rango</p>
                  <p className="text-blue-900 font-bold">{juego.RangoMin} - {juego.RangoMax}</p>
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-4">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              <Printer size={20} />
              Imprimir
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition"
            >
              Cerrar
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};