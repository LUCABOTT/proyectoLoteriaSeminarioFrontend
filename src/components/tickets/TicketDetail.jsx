import { Card, CardBody, Badge } from "../ui";
import { X, Printer, Calendar, DollarSign, Hash, Award, Download, ReceiptText } from "lucide-react";

export const TicketDetail = ({ ticket, numeros, juego, sorteo, onClose }) => {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
      minimumFractionDigits: 2,
    }).format(monto);
  };

  const getEstadoColor = (estado) => {
    const estadoLower = (estado || "").toLowerCase();
    if (estadoLower === "pagado") return "success";
    if (estadoLower === "pendiente") return "warning";
    if (estadoLower === "ganador") return "success";
    return "default";
  };

  const getJuegoColors = (nombreJuego) => {
    const nombre = (nombreJuego || "").toLowerCase();
    if (nombre.includes("pega 3")) return "from-yellow-400 to-yellow-600";
    if (nombre.includes("diaria")) return "from-red-400 to-red-600";
    if (nombre.includes("pegados") || nombre.includes("pega 2")) return "from-blue-400 to-blue-600";
    if (nombre.includes("super premio")) return "from-green-400 to-green-600";
    return "from-purple-400 to-purple-600";
  };

  const colors = getJuegoColors(juego?.Nombre);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800">
        <CardBody className="p-0">
          {/* Header con gradiente */}
          <div className={`bg-linear-to-r ${colors} p-6 relative`}>
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 transition text-white">
              <X size={24} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Award className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white drop">Boleto #{ticket.IdTicket}</h2>
                <p className="text-white/90 font-medium">{juego?.Nombre || "Desconocido"}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Estado del boleto */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Estado del boleto</p>
                <Badge variant={getEstadoColor(ticket.Estado)} className="text-base px-4 py-2">
                  {ticket.Estado === "pagado"
                    ? "Pagado"
                    : ticket.Estado === "pendiente"
                    ? "Pendiente"
                    : ticket.Estado === "ganador"
                    ? "Ganador"
                    : ticket.Estado}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-400 mb-1">Precio total</p>
                <p className="text-amber-400 font-bold text-2xl">{formatearMoneda(parseFloat(ticket.Total || 0))}</p>
              </div>
            </div>

            {/* Números comprados */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-amber-400" />
                Números comprados
              </h4>
              <div className="flex flex-wrap gap-3 p-4 bg-zinc-800 border border-zinc-700">
                {numeros.map((num, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-center w-14 h-14 bg-amber-600 border border-amber-700 text-amber-100 text-xl font-bold`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            {/* Grid de información */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Información de compra */}
              <Card className="p-4 bg-zinc-800 border-zinc-700">
                <h5 className="text-sm font-bold text-zinc-400 mb-3 flex items-center gap-2 uppercase">
                  <Calendar className="w-4 h-4" />
                  Información de compra
                </h5>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Fecha de compra</p>
                    <p className="text-zinc-100 font-medium text-sm">{formatearFecha(ticket.FechaCompra)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Monto pagado</p>
                    <p className="text-amber-400 font-bold text-lg">{formatearMoneda(parseFloat(ticket.Total || 0))}</p>
                  </div>
                </div>
              </Card>

              {/* Información del sorteo */}
              <Card className="p-4 bg-zinc-800 border-zinc-700">
                <h5 className="text-sm font-bold text-zinc-400 mb-3 flex items-center gap-2 uppercase">
                  <Award className="w-4 h-4" />
                  Información del sorteo
                </h5>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Fecha de cierre</p>
                    <p className="text-zinc-100 font-medium text-sm">
                      {sorteo ? formatearFecha(sorteo.Cierre) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Estado del sorteo</p>
                    <Badge variant={sorteo?.Estado === "sorteado" ? "success" : "default"}>
                      {sorteo?.Estado || "N/A"}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            {/* Detalles del juego */}
            {juego && (
              <Card className="p-4 bg-blue-500/5 border-blue-500/20 mb-6">
                <h5 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2 uppercase">
                  <ReceiptText className="w-4 h-4" />
                  Detalles del juego
                </h5>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Precio por número</p>
                    <p className="text-zinc-100 font-bold">{formatearMoneda(juego.PrecioJuego)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Cantidad de números</p>
                    <p className="text-zinc-100 font-bold">{juego.CantidadNumeros}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Rango</p>
                    <p className="text-zinc-100 font-bold">
                      {juego.RangoMin} - {juego.RangoMax}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Números ganadores si el sorteo está sorteado */}
            {sorteo?.Estado === "sorteado" && sorteo?.NumerosGanadores && (
              <Card className="p-4 bg-green-500/5 border-green-500/20 mb-6">
                <h5 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2 uppercase">
                  <Award className="w-4 h-4" />
                  Números ganadores
                </h5>
                <div className="flex flex-wrap gap-3">
                  {sorteo.NumerosGanadores.map((num, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-center w-12 h-12 bg-green-600 border border-green-700 text-green-100 text-lg font-bold"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Acciones */}
            <div className="flex gap-4">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
              >
                <Printer size={20} />
                Imprimir
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-zinc-800 text-zinc-100 font-bold hover:bg-zinc-700 border border-zinc-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
