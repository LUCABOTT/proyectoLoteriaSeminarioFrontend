import { useState, useEffect } from "react";
import { Clock, Trophy, Ticket } from "lucide-react";
import { Card, CardBody, Alert, Button, Badge } from "../components/ui";
import BuyTicketModal from "../components/BuyTicketModal";
import { useSorteos } from "../hooks/useSorteos";
import { useJuegos } from "../hooks/useJuegos";

const CountdownTimer = ({ targetDate, colors }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const getBgColor = () => {
    if (colors.timerBg === "bg-yellow-100") return "bg-yellow-100";
    if (colors.timerBg === "bg-red-100") return "bg-red-100";
    if (colors.timerBg === "bg-blue-100") return "bg-blue-100";
    if (colors.timerBg === "bg-green-100") return "bg-green-100";
    return "bg-purple-100";
  };

  const getTextColor = () => {
    if (colors.timerBg === "bg-yellow-100") return "text-yellow-900";
    if (colors.timerBg === "bg-red-100") return "text-red-900";
    if (colors.timerBg === "bg-blue-100") return "text-blue-900";
    if (colors.timerBg === "bg-green-100") return "text-green-900";
    return "text-purple-900";
  };

  return (
    <div className="flex gap-2">
      {timeLeft.days > 0 && (
        <div className={`flex flex-col items-center ${getBgColor()} px-3 py-2 rounded shadow`}>
          <span className={`text-lg font-bold ${getTextColor()}`}>
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className={`text-xs font-semibold ${getTextColor()}`}>d</span>
        </div>
      )}
      <div className={`flex flex-col items-center ${getBgColor()} px-3 py-2 rounded shadow`}>
        <span className={`text-lg font-bold ${getTextColor()}`}>
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className={`text-xs font-semibold ${getTextColor()}`}>h</span>
      </div>
      <div className={`flex flex-col items-center ${getBgColor()} px-3 py-2 rounded shadow`}>
        <span className={`text-lg font-bold ${getTextColor()}`}>
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className={`text-xs font-semibold ${getTextColor()}`}>m</span>
      </div>
      <div className={`flex flex-col items-center ${getBgColor()} px-3 py-2 rounded shadow`}>
        <span className={`text-lg font-bold ${getTextColor()}`}>
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className={`text-xs font-semibold ${getTextColor()}`}>s</span>
      </div>
    </div>
  );
};

// Función para obtener los colores del juego
const getJuegoColors = (nombreJuego) => {
  const nombre = (nombreJuego || "").toLowerCase();
  
  if (nombre.includes("pega 3") || nombre.includes("pega3")) {
    return {
      gradientFrom: "from-yellow-400",
      gradientTo: "to-yellow-600",
      border: "border-yellow-500",
      bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      badge: "bg-yellow-500",
      numberBg: "from-yellow-500 to-yellow-600",
      iconBg: "from-yellow-400 to-yellow-600",
      timerBg: "bg-yellow-100",
      resultBg: "from-yellow-50",
      resultTo: "to-yellow-100"
    };
  }
  
  if (nombre.includes("diaria") || nombre.includes("la diaria")) {
    return {
      gradientFrom: "from-red-400",
      gradientTo: "to-red-600",
      border: "border-red-500",
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      badge: "bg-red-500",
      numberBg: "from-red-500 to-red-600",
      iconBg: "from-red-400 to-red-600",
      timerBg: "bg-red-100",
      resultBg: "from-red-50",
      resultTo: "to-red-100"
    };
  }
  
  if (nombre.includes("pegados") || nombre.includes("pega dos") || nombre.includes("pega 2")) {
    return {
      gradientFrom: "from-blue-400",
      gradientTo: "to-blue-600",
      border: "border-blue-500",
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      badge: "bg-blue-500",
      numberBg: "from-blue-500 to-blue-600",
      iconBg: "from-blue-400 to-blue-600",
      timerBg: "bg-blue-100",
      resultBg: "from-blue-50",
      resultTo: "to-blue-100"
    };
  }
  
  if (nombre.includes("super premio")) {
    return {
      gradientFrom: "from-green-400",
      gradientTo: "to-green-600",
      border: "border-green-500",
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      badge: "bg-green-500",
      numberBg: "from-green-500 to-green-600",
      iconBg: "from-green-400 to-green-600",
      timerBg: "bg-green-100",
      resultBg: "from-green-50",
      resultTo: "to-green-100"
    };
  }
  
  // Color por defecto (púrpura) para juegos nuevos
  return {
    gradientFrom: "from-purple-400",
    gradientTo: "to-purple-600",
    border: "border-purple-500",
    bg: "bg-gradient-to-br from-purple-50 to-purple-100",
    badge: "bg-purple-500",
    numberBg: "from-purple-500 to-purple-600",
    iconBg: "from-purple-400 to-purple-600",
    timerBg: "bg-purple-100",
    resultBg: "from-purple-50",
    resultTo: "to-purple-100"
  };
};

export default function Lotteries() {
  const { sorteos, loading: loadingSorteos, error: errorSorteos, recargar } = useSorteos();
  const { juegos } = useJuegos();

  // Estado para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [sorteoSeleccionado, setSorteoSeleccionado] = useState(null);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);

  // Separar sorteos por estado
  const sorteosPróximos = sorteos.filter((s) => s.Estado === "abierto" || s.Estado === "cerrado");
  const sorteosRealizados = sorteos.filter((s) => s.Estado === "sorteado");

  // Agrupar sorteos realizados por juego y obtener el más reciente de cada uno
  const últimoSorteoPorJuego = {};
  sorteosRealizados.forEach((sorteo) => {
    const juegoId = sorteo.IdJuego;
    if (
      !últimoSorteoPorJuego[juegoId] ||
      new Date(sorteo.Cierre) > new Date(últimoSorteoPorJuego[juegoId].Cierre)
    ) {
      últimoSorteoPorJuego[juegoId] = sorteo;
    }
  });

  const getJuego = (idJuego) => {
    return juegos.find((j) => j.Id === idJuego);
  };

  const handleComprarClick = (sorteo) => {
    const juego = getJuego(sorteo.IdJuego);
    setSorteoSeleccionado(sorteo);
    setJuegoSeleccionado(juego);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSorteoSeleccionado(null);
    setJuegoSeleccionado(null);
  };

  const handleCompraExitosa = () => {
    recargar();
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-ES", {
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

  if (loadingSorteos) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg font-medium">Cargando sorteos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Principal */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            🎰 Sorteos en Vivo
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Próximos sorteos con premios increíbles y resultados de los últimos sorteos realizados
          </p>
        </div>

        {errorSorteos && (
          <Alert variant="error" className="mb-8 shadow-lg">
            <p className="font-semibold">Error al cargar sorteos</p>
            <p className="text-sm mt-1">{errorSorteos}</p>
          </Alert>
        )}

        {/* SECCIÓN: PRÓXIMOS SORTEOS */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Clock className="text-yellow-400" size={32} />
              Próximos Sorteos
            </h2>
            <Badge variant="warning" className="text-lg px-4 py-2">
              {sorteosPróximos.length} {sorteosPróximos.length === 1 ? "sorteo" : "sorteos"} disponibles
            </Badge>
          </div>

          {sorteosPróximos.length === 0 ? (
            <Alert variant="info" className="shadow-md bg-gray-800 border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📅</span>
                <div>
                  <p className="font-bold text-lg text-white">No hay sorteos próximamente</p>
                  <p className="text-sm mt-1 text-gray-300">
                    Los sorteos estarán disponibles pronto. ¡Mantente atento para no perderte los próximos premios!
                  </p>
                </div>
              </div>
            </Alert>
          ) : (
            <div className="grid gap-6">
              {sorteosPróximos.map((sorteo) => {
                const juego = getJuego(sorteo.IdJuego);
                if (!juego) return null;

                const colors = getJuegoColors(juego.Nombre);

                return (
                  <Card
                    key={sorteo.Id}
                    className={`hover:shadow-2xl transition-all duration-300 border-l-8 ${colors.border} bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo}`}
                  >
                    <CardBody className="p-8">
                      <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* COLUMNA 1: Información del Juego */}
                        <div className="md:col-span-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${colors.iconBg} rounded-full flex items-center justify-center shadow-lg`}>
                              <Ticket className="text-white" size={28} />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white drop-shadow-md">{juego.Nombre}</h3>
                              <p className="text-sm text-white/80">ID: {sorteo.Id}</p>
                            </div>
                          </div>

                          <p className="text-white/95 mb-4 font-medium">
                            {juego.Descripcion || "Sorteo de lotería emocionante"}
                          </p>

                          <div className="space-y-2 text-sm bg-white/20 backdrop-blur-sm rounded-lg p-4">
                            <div className="flex justify-between">
                              <span className="text-white/90 font-medium">💰 Precio:</span>
                              <span className="font-bold text-white">{formatearMoneda(juego.PrecioJuego)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/90 font-medium">🎯 Números:</span>
                              <span className="font-semibold text-white">{juego.CantidadNumeros}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/90 font-medium">📊 Rango:</span>
                              <span className="font-semibold text-white">
                                {juego.RangoMin} - {juego.RangoMax}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* COLUMNA 2: Fecha y Estado */}
                        <div className="md:col-span-1 text-center border-l border-r border-white/30 px-6">
                          <p className="text-sm text-white/90 mb-2 font-semibold uppercase tracking-wide">
                            Cierre del Sorteo
                          </p>
                          <p className="text-white font-medium mb-6 capitalize text-shadow">
                            {formatearFecha(sorteo.Cierre)}
                          </p>

                          <Badge
                            variant={sorteo.Estado === "abierto" ? "success" : "warning"}
                            className="text-base px-6 py-3 shadow-lg bg-white/90 text-gray-900 font-bold"
                          >
                            {sorteo.Estado === "abierto" ? "✅ Abierto para compras" : "⏸️ Cerrado"}
                          </Badge>
                        </div>

                        {/* COLUMNA 3: Cronómetro y Acción */}
                        <div className="md:col-span-1 text-center">
                          <p className="text-sm text-white/90 mb-3 font-semibold uppercase tracking-wide">
                            ⏰ Tiempo Restante
                          </p>
                          <div className="flex justify-center mb-6">
                            <CountdownTimer targetDate={sorteo.Cierre} colors={colors} />
                          </div>

                         {/* Botón de compra con animación mejorada */}
                          <button
                            onClick={() => handleComprarClick(sorteo)}
                            disabled={sorteo.Estado !== "abierto"}
                            className={`
                              w-full relative overflow-hidden
                              bg-white text-gray-900
                              font-bold py-4 px-6 rounded-xl
                              transform transition-all duration-300
                              hover:scale-105 hover:shadow-2xl
                              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                              group
                              shadow-lg
                            `}
                          >
                            {/* Brillo animado al hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-shimmer"></div>
                            
                            {/* Contenido del botón */}
                            <div className="relative flex items-center justify-center gap-3">
                              {sorteo.Estado === "abierto" ? (
                                <>
                                  <svg 
                                    className="w-6 h-6 group-hover:animate-bounce" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" 
                                    />
                                  </svg>
                                  <span className="text-lg">Comprar Boleto</span>
                                  <svg 
                                    className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M9 5l7 7-7 7" 
                                    />
                                  </svg>
                                </>
                              ) : (
                                <>
                                  <svg 
                                    className="w-6 h-6" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                    />
                                  </svg>
                                  <span className="text-lg">Sorteo Cerrado</span>
                                </>
                              )}
                            </div>

                            {/* Efecto de pulso al hover (solo si está abierto) */}
                            {sorteo.Estado === "abierto" && (
                              <div className="absolute inset-0 rounded-xl bg-yellow-400 opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
                            )}
                          </button>
                          
                          {sorteo.Estado !== "abierto" && (
                            <p className="text-xs text-white/80 mt-2 font-medium">
                              Las ventas han finalizado
                            </p>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* SECCIÓN: ÚLTIMOS RESULTADOS */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Trophy className="text-yellow-400" size={32} />
              Últimos Resultados
            </h2>
            <Badge variant="success" className="text-lg px-4 py-2">
              {Object.keys(últimoSorteoPorJuego).length}{" "}
              {Object.keys(últimoSorteoPorJuego).length === 1 ? "resultado" : "resultados"}
            </Badge>
          </div>

          {Object.keys(últimoSorteoPorJuego).length === 0 ? (
            <Alert variant="info" className="shadow-md bg-gray-800 border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎲</span>
                <div>
                  <p className="font-bold text-lg text-white">Aún no hay sorteos realizados</p>
                  <p className="text-sm mt-1 text-gray-300">
                    Los resultados aparecerán aquí cuando se realicen los primeros sorteos. ¡Participa ahora!
                  </p>
                </div>
              </div>
            </Alert>
          ) : (
            <div className="grid gap-6">
              {Object.values(últimoSorteoPorJuego).map((sorteo) => {
                const juego = getJuego(sorteo.IdJuego);
                if (!juego) return null;

                const colors = getJuegoColors(juego.Nombre);

                return (
                  <Card
                    key={sorteo.Id}
                    className={`bg-gradient-to-br ${colors.resultBg} ${colors.resultTo} border-l-8 ${colors.border} hover:shadow-2xl transition-all duration-300`}
                  >
                    <CardBody className="p-8">
                      <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* COLUMNA 1: Info del Juego */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${colors.iconBg} rounded-full flex items-center justify-center shadow-lg`}>
                              <Trophy className="text-white" size={28} />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{juego.Nombre}</h3>
                              <p className="text-sm text-gray-600">ID: {sorteo.Id}</p>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-700 font-medium">📅 Realizado:</span>
                              <span className="font-medium text-gray-900">
                                {new Date(sorteo.Cierre).toLocaleDateString("es-ES")}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700 font-medium">⏰ Hora:</span>
                              <span className="font-medium text-gray-900">
                                {new Date(sorteo.Cierre).toLocaleTimeString("es-ES", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* COLUMNA 2: Números Ganadores */}
                        <div className="md:col-span-2">
                          {sorteo.NumerosGanadores && sorteo.NumerosGanadores.length > 0 ? (
                            <div>
                              <p className="text-lg font-bold text-gray-900 mb-4 text-center md:text-left">
                                🎯 Números Ganadores
                              </p>
                              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                {sorteo.NumerosGanadores.map((num, idx) => (
                                  <div
                                    key={idx}
                                    className="relative group"
                                  >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.numberBg} rounded-full blur-md opacity-50 group-hover:opacity-75 transition`}></div>
                                    <div className={`relative flex items-center justify-center w-16 h-16 bg-gradient-to-br ${colors.numberBg} text-white font-bold rounded-full text-xl shadow-lg hover:scale-110 transition-transform`}>
                                      {num}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-600 italic">
                              Números ganadores no disponibles
                            </div>
                          )}

                          <div className="mt-6 flex justify-center md:justify-end">
                            <Badge className={`${colors.badge} text-white text-base px-6 py-3 shadow-md`}>
                              ✅ Sorteo Completado
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Call to Action Final (solo si hay sorteos activos) */}
        {sorteosPróximos.length > 0 && (
          <div className="mt-16 text-center bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-12 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-md">
              ¡No te pierdas la oportunidad de ganar!
            </h3>
            <p className="text-white text-lg mb-6">
              Participa en nuestros sorteos y sé el próximo ganador
            </p>
            <Button variant="primary" size="lg" className="bg-white text-orange-600 hover:bg-gray-100 shadow-xl font-bold">
              <Ticket className="mr-2" size={24} />
              Ver Sorteos Disponibles
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Compra */}
      <BuyTicketModal
        sorteo={sorteoSeleccionado}
        juego={juegoSeleccionado}
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleCompraExitosa}
      />
    </div>
  );
}
