import { useState } from 'react';
import { Card, CardBody, Alert, Button, Badge } from '../components/ui';
import { TicketDetail } from '../components/tickets/TicketDetail';
import { useTickets } from '../hooks/useTickets';
import { useJuegos } from '../hooks/useJuegos';
import { useSorteos } from '../hooks/useSorteos';
import { Eye, Trash2, Edit2 } from 'lucide-react';

export default function GestionarTickets() {
  const { tickets, loading, error, filtro, setFiltro, filtroEstado, setFiltroEstado, obtenerNumerosTicket, eliminarTicket, editarTicket, recargar } = useTickets(true);
  const { juegos } = useJuegos();
  const { sorteos } = useSorteos();

  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editandoEstado, setEditandoEstado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');

  const getJuego = (idJuego) => juegos.find(j => j.Id === idJuego);
  const getSorteo = (idSorteo) => sorteos.find(s => s.Id === idSorteo);

  const handleDeleteConfirm = async () => {
    const resultado = await eliminarTicket(confirmDelete);
    if (resultado.success) {
      setConfirmDelete(null);
      await recargar();
    }
  };

  const handleEditarEstado = async (ticketId, nuevoEst) => {
    const resultado = await editarTicket(ticketId, { Estado: nuevoEst });
    if (resultado.success) {
      setEditandoEstado(null);
      await recargar();
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 2
    }).format(monto);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg font-medium">Cargando boletos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Gestionar Boletos 🎫</h1>
          <p className="text-gray-400 mt-2">Panel de administración de todos los boletos</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border border-gray-700">
            <CardBody className="text-center">
              <p className="text-gray-400 text-sm font-medium">Total de Boletos</p>
              <p className="text-3xl font-bold text-yellow-400">{tickets.length}</p>
            </CardBody>
          </Card>
          <Card className="bg-gray-900 border border-gray-700">
            <CardBody className="text-center">
              <p className="text-gray-400 text-sm font-medium">Pagados</p>
              <p className="text-3xl font-bold text-green-400">
                {tickets.filter(t => t.Estado === 'pagado').length}
              </p>
            </CardBody>
          </Card>
          <Card className="bg-gray-900 border border-gray-700">
            <CardBody className="text-center">
              <p className="text-gray-400 text-sm font-medium">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-400">
                {tickets.filter(t => t.Estado === 'pendiente').length}
              </p>
            </CardBody>
          </Card>
          <Card className="bg-gray-900 border border-gray-700">
            <CardBody className="text-center">
              <p className="text-gray-400 text-sm font-medium">Ganadores</p>
              <p className="text-3xl font-bold text-blue-400">
                {tickets.filter(t => t.Estado === 'ganador').length}
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

        {/* Filtros */}
        <Card className="mb-6 bg-gray-900 border border-gray-700">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Buscar por ID, usuario, sorteo..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Todos los estados</option>
                <option value="pagado">Pagado</option>
                <option value="pendiente">Pendiente</option>
                <option value="ganador">Ganador</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </CardBody>
        </Card>

        {/* Tabla */}
        {tickets.length === 0 ? (
          <Alert variant="info" className="bg-blue-900/20 border border-blue-700 text-blue-400">
            <p className="font-semibold">No hay boletos registrados</p>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <Card className="bg-gray-900 border border-gray-700">
              <table className="w-full">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-yellow-400">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-yellow-400">Usuario</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-yellow-400">Juego</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-yellow-400">Fecha</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-yellow-400">Monto</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-yellow-400">Estado</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-yellow-400">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, idx) => {
                    const sorteo = getSorteo(ticket.IdSorteo);
                    const juego = sorteo ? getJuego(sorteo.IdJuego) : null;

                    return (
                      <tr key={ticket.IdTicket} className={idx % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}>
                        <td className="px-6 py-4 text-sm font-semibold text-white">#{ticket.IdTicket}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{ticket.IdUsuario}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{juego?.Nombre || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{formatearFecha(ticket.FechaCompra)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-yellow-400">{formatearMoneda(parseFloat(ticket.Total || 0))}</td>
                        <td className="px-6 py-4 text-sm">
                          {editandoEstado === ticket.IdTicket ? (
                            <select
                              value={nuevoEstado}
                              onChange={(e) => setNuevoEstado(e.target.value)}
                              className="px-2 py-1 border border-gray-600 rounded text-sm bg-gray-700 text-white"
                            >
                              <option value="">Seleccionar...</option>
                              <option value="pagado">Pagado</option>
                              <option value="pendiente">Pendiente</option>
                              <option value="ganador">Ganador</option>
                              <option value="cancelado">Cancelado</option>
                            </select>
                          ) : (
                            <Badge variant={ticket.Estado === 'pagado' ? 'success' : 'warning'}>
                              {ticket.Estado}
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2 justify-center">
                            {editandoEstado === ticket.IdTicket ? (
                              <>
                                <button
                                  onClick={() => handleEditarEstado(ticket.IdTicket, nuevoEstado)}
                                  className="px-2 py-1 bg-green-600 text-white text-xs rounded font-bold hover:bg-green-700"
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={() => setEditandoEstado(null)}
                                  className="px-2 py-1 bg-gray-600 text-white text-xs rounded font-bold hover:bg-gray-700"
                                >
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                                  onClick={() => setTicketSeleccionado(ticket)}
                                >
                                  <Eye size={16} />
                                </Button>
                                <Button
                                  variant="warning"
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => {
                                    setEditandoEstado(ticket.IdTicket);
                                    setNuevoEstado(ticket.Estado);
                                  }}
                                >
                                  <Edit2 size={16} />
                                </Button>
                                <Button
                                  variant="error"
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => setConfirmDelete(ticket.IdTicket)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
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