import { useState, useEffect } from "react";
import { Card, CardBody, Alert, Button, Badge, Input, Spinner } from "../components/ui";
import { TicketDetail } from "../components/tickets/TicketDetail";
import { useTickets } from "../hooks/useTickets";
import { useJuegos } from "../hooks/useJuegos";
import { useSorteos } from "../hooks/useSorteos";
import { Eye, Trash2, Ticket, TrendingUp, Calendar, DollarSign, Search, RefreshCw } from "lucide-react";

export default function MisTickets() {
  const { tickets, loading, error, obtenerNumerosTicket, eliminarTicket, recargar } = useTickets(false);
  const { juegos } = useJuegos();
  const { sorteos } = useSorteos();

  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const getJuego = (idJuego) => juegos.find((j) => j.Id === idJuego);
  const getSorteo = (idSorteo) => sorteos.find((s) => s.Id === idSorteo);

  const handleRefresh = async () => {
    setRefreshing(true);
    await recargar();
    setRefreshing(false);
  };

  const handleDeleteConfirm = async () => {
    const resultado = await eliminarTicket(confirmDelete);
    if (resultado.success) {
      setConfirmDelete(null);
      await recargar();
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
      minimumFractionDigits: 2,
    }).format(monto);
  };

  const getEstadoBadge = (estado) => {
    const estadoLower = (estado || "").toLowerCase();
    if (estadoLower === "pagado") return { variant: "success", label: "Pagado" };
    if (estadoLower === "pendiente") return { variant: "warning", label: "Pendiente" };
    if (estadoLower === "ganador") return { variant: "success", label: "Ganador" };
    if (estadoLower === "cancelado") return { variant: "danger", label: "Cancelado" };
    return { variant: "default", label: estado };
  };

  const filteredTickets = tickets.filter((t) => {
    const sorteo = getSorteo(t.IdSorteo);
    const juego = sorteo ? getJuego(sorteo.IdJuego) : null;
    const searchLower = searchTerm.toLowerCase();

    return (
      t.IdTicket.toString().includes(searchLower) ||
      (juego?.Nombre || "").toLowerCase().includes(searchLower) ||
      t.Estado.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 px-6 flex items-center justify-center">
        <Spinner center size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">Mis boletos</h1>
            <p className="text-zinc-400">Administra tus boletos de lotería</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-blue-400" />
              </div>
              <Badge variant="default">Total</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{tickets.length}</div>
            <div className="text-sm text-zinc-500">Boletos comprados</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <Badge variant="success">Activos</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">
              {tickets.filter((t) => t.Estado !== "cancelado").length}
            </div>
            <div className="text-sm text-zinc-500">Boletos activos</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-400" />
              </div>
              <Badge variant="default">Invertido</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">
              {formatearMoneda(tickets.reduce((sum, t) => sum + parseFloat(t.Total || 0), 0))}
            </div>
            <div className="text-sm text-zinc-500">Total gastado</div>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Search Bar */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-zinc-500" size={20} />
            <Input
              type="text"
              placeholder="Buscar por ID, juego o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-zinc-600" />
              </div>
              <p className="text-zinc-400 font-semibold mb-2">No tienes boletos comprados</p>
              <p className="text-sm text-zinc-500 mb-6">
                {searchTerm
                  ? "No se encontraron boletos con ese criterio"
                  : "¡Compra tu primer boleto en la sección de Sorteos!"}
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const sorteo = getSorteo(ticket.IdSorteo);
              const juego = sorteo ? getJuego(sorteo.IdJuego) : null;
              const numeros = obtenerNumerosTicket(ticket.IdTicket);
              const badge = getEstadoBadge(ticket.Estado);

              return (
                <Card key={ticket.IdTicket} className="hover:border-zinc-700 transition">
                  <CardBody className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Información principal */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-amber-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-zinc-100">Boleto #{ticket.IdTicket}</h3>
                            <p className="text-sm text-zinc-400">{juego?.Nombre || "Desconocido"}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <Calendar className="w-4 h-4" />
                            {formatearFecha(ticket.FechaCompra)}
                          </div>
                          <div className="flex items-center gap-2 text-amber-400 font-bold">
                            {formatearMoneda(parseFloat(ticket.Total || 0))}
                          </div>
                        </div>
                      </div>

                      {/* Números */}
                      <div className="shrink-0">
                        <p className="text-xs text-zinc-500 mb-2 font-medium">Números:</p>
                        <div className="flex flex-wrap gap-2">
                          {numeros.slice(0, 5).map((num, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center justify-center w-8 h-8 bg-amber-500 text-black text-xs font-bold"
                            >
                              {num}
                            </span>
                          ))}
                          {numeros.length > 5 && (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-zinc-800 text-zinc-400 text-xs font-bold">
                              +{numeros.length - 5}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Estado y acciones */}
                      <div className="flex flex-col gap-3 items-end">
                        <Badge variant={badge.variant} className="text-sm px-4 py-2">
                          {badge.label}
                        </Badge>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setTicketSeleccionado(ticket)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition"
                            title="Ver detalles"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(ticket.IdTicket)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
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
            juego={
              getSorteo(ticketSeleccionado.IdSorteo) ? getJuego(getSorteo(ticketSeleccionado.IdSorteo).IdJuego) : null
            }
            sorteo={getSorteo(ticketSeleccionado.IdSorteo)}
            onClose={() => setTicketSeleccionado(null)}
          />
        )}

        {/* Confirmación Eliminar */}
        {confirmDelete !== null && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-zinc-900 border border-zinc-800">
              <CardBody className="p-6">
                <h3 className="text-xl font-bold text-zinc-100 mb-4">¿Eliminar este boleto?</h3>
                <p className="text-zinc-400 mb-6">
                  Esta acción no se puede deshacer. El boleto #{confirmDelete} será eliminado permanentemente.
                </p>
                <div className="flex gap-4">
                  <Button variant="secondary" onClick={() => setConfirmDelete(null)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button variant="danger" onClick={handleDeleteConfirm} className="flex-1">
                    Eliminar
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
