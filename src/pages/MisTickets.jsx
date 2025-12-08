import { useState, useEffect, useContext } from 'react';
import { Card, CardBody, Alert, Button, Badge } from '../components/ui';
import { TicketDetail } from '../components/tickets/TicketDetail';
import { useTickets } from '../hooks/useTickets';
import { useJuegos } from '../hooks/useJuegos';
import { useSorteos } from '../hooks/useSorteos';
import { AuthContext } from '../context/AuthContext';
import { Eye, Download, Trash2 } from 'lucide-react';

export default function MisTickets() {
  const { user } = useContext(AuthContext);
  const { tickets, loading, error, filtro, setFiltro, obtenerNumerosTicket, eliminarTicket, recargar } = useTickets(false);
  const { juegos } = useJuegos();
  const { sorteos } = useSorteos();

  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const getJuego = (idJuego) => juegos.find(j => j.Id === idJuego);
  const getSorteo = (idSorteo) => sorteos.find(s => s.Id === idSorteo);

  const handleDeleteConfirm = async () => {
    const resultado = await eliminarTicket(confirmDelete);
    if (resultado.success) {
      setConfirmDelete(null);
      await recargar();
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
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

  const getEstadoBadge = (estado) => {
    const estadoLower = (estado || '').toLowerCase();
    if (estadoLower === 'pagado') return { variant: 'success', label: '✓ Pagado' };
    if (estadoLower === 'pendiente') return { variant: 'warning', label: '⏳ Pendiente' };
    if (estadoLower === 'ganador') return { variant: 'success', label: '🏆 Ganador' };
    if (estadoLower === 'cancelado') return { variant: 'error', label: '✗ Cancelado' };
    return { variant: 'info', label: estado };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg font-medium">Cargando tus boletos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Mis Boletos 🎫</h1>
          <p className="text-gray-400 mt-2">Aquí están todos tus boletos comprados</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-900 border border-gray-700">
            <CardBody className="text-center">
              <p className="text-gray-400 text-sm font-medium">Total de Boletos</p>
              <p className="text-3xl font-bold text-yellow-400">{tickets.length}</p>
            </CardBody>
          </Card>
          <Card className="bg-gray-900 border border-gray-700">
            <CardBody className="text-center">
              <p className="text-gray-400 text-sm font-medium">Boletos Activos</p>
              <p className="text-3xl font-bold text-green-400">
                {tickets.filter(t => t.Estado !== 'cancelado').length}
              </p>
            </CardBody>
          </Card>
          <Card className="bg-gray-900 border border-gray-700">
            <CardBody className="text-center">
              <p className="text-gray-400 text-sm font-medium">Total Gastado</p>
              <p className="text-3xl font-bold text-blue-400">
                {formatearMoneda(tickets.reduce((sum, t) => sum + (t.Total || 0), 0))}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Errores */}
        {error && (
          <Alert variant="error" className="mb-6 bg-red-900/20 border border-red-700 text-red-400">
            {error}
          </Alert>
        )}

        {/* Búsqueda */}
        <Card className="mb-6 bg-gray-900 border border-gray-700">
          <CardBody>
            <input
              type="text"
              placeholder="Buscar por ID de boleto, sorteo..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </CardBody>
        </Card>

        {/* Lista de Boletos */}
        {tickets.length === 0 ? (
          <Alert variant="info" className="bg-blue-900/20 border border-blue-700 text-blue-400">
            <p className="font-semibold">No tienes boletos comprados</p>
            <p className="text-sm mt-1">¡Compra un boleto en la sección de Sorteos y comienza a participar!</p>
          </Alert>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => {
              const sorteo = getSorteo(ticket.IdSorteo);
              const juego = sorteo ? getJuego(sorteo.IdJuego) : null;
              const numeros = obtenerNumerosTicket(ticket.IdTicket);
              const badge = getEstadoBadge(ticket.Estado);

              return (
                <Card key={ticket.IdTicket} className="bg-gray-900 border border-gray-700 hover:border-yellow-500 transition">
                  <CardBody>
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      {/* Información Principal */}
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-white mb-2">
                          Boleto #{ticket.IdTicket}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                          <span className="font-semibold text-gray-300">Juego:</span> {juego?.Nombre || 'Desconocido'}
                        </p>
                        <p className="text-gray-400 text-sm mb-2">
                          <span className="font-semibold text-gray-300">Fecha:</span> {formatearFecha(ticket.FechaCompra)}
                        </p>
                        <p className="text-yellow-400 font-bold text-lg">
                          {formatearMoneda(ticket.Total)}
                        </p>
                      </div>

                      {/* Números */}
                      <div className="md:col-span-1">
                        <p className="text-gray-400 text-sm font-semibold mb-2">Números:</p>
                        <div className="flex flex-wrap gap-2">
                          {numeros.slice(0, 3).map((num, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 text-black text-xs font-bold rounded-full"
                            >
                              {num}
                            </span>
                          ))}
                          {numeros.length > 3 && (
                            <span className="text-xs text-gray-400 self-center">
                              +{numeros.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Estado */}
                      <div className="md:col-span-1 text-center">
                        <Badge variant={badge.variant}>
                          {badge.label}
                        </Badge>
                      </div>

                      {/* Acciones */}
                      <div className="md:col-span-1 flex gap-2 justify-end">
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                          onClick={() => setTicketSeleccionado(ticket)}
                        >
                          <Eye size={16} />
                          Ver
                        </Button>
                        <Button
                          variant="error"
                          size="sm"
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700"
                          onClick={() => setConfirmDelete(ticket.IdTicket)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal de Detalle */}
        {ticketSeleccionado && (
          <TicketDetail
            ticket={ticketSeleccionado}
            numeros={obtenerNumerosTicket(ticketSeleccionado.IdTicket)}
            juego={getSorteo(ticketSeleccionado.IdSorteo) ? getJuego(getSorteo(ticketSeleccionado.IdSorteo).IdJuego) : null}
            sorteo={getSorteo(ticketSeleccionado.IdSorteo)}
            onClose={() => setTicketSeleccionado(null)}
          />
        )}

        {/* Confirmación Eliminar */}
        {confirmDelete !== null && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-gray-900 border border-gray-700">
              <CardBody>
                <h3 className="text-xl font-bold text-white mb-4">
                  ¿Eliminar este boleto?
                </h3>
                <p className="text-gray-300 mb-6 font-medium text-base">
                  Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 px-4 py-2 border-2 border-gray-600 text-white font-bold rounded-lg hover:bg-gray-800 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}