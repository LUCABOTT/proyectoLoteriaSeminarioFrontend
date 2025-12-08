"use client";

import { Calendar, Clock, CreditCard, DollarSign, Gift, Tag, Ticket, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Card, Badge, Spinner } from "../components/ui";
import { sorteoService } from "../services/sorteoService";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!targetDate) return { hours: 0, minutes: 0, seconds: 0 };
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {timeUnits.map((unit, index) => (
        <div key={index} className="flex flex-col items-center bg-zinc-900 border border-zinc-800 px-8 py-6 w-36">
          <div className="text-4xl md:text-5xl font-semibold text-amber-400 tabular-nums">
            {String(unit.value).padStart(2, "0")}
          </div>
          <p className="text-zinc-400 text-xs font-medium mt-3 uppercase tracking-widest">{unit.label}</p>
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const [particles, setParticles] = useState([]);
  const [lotteryData, setLotteryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Inicio - Lotería";
    
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 20 + 15,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      type: Math.random() > 0.5 ? "ticket" : "money",
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);

    const fetchLotteryData = async () => {
      try {
        const data = await sorteoService.getProximoSorteo();
        setLotteryData(data);
      } catch (error) {
        console.error('Error al cargar sorteo:', error);
        setLotteryData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLotteryData();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.06; }
          50% { transform: translateY(-20px) translateX(10px) rotate(10deg); opacity: 0.12; }
          100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.06; }
        }
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <section className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden pt-16">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-amber-400 pointer-events-none"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              opacity: 0.06,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          >
            {particle.type === "ticket" ? <Ticket size={particle.size} /> : <DollarSign size={particle.size} />}
          </div>
        ))}

        <div className="container mx-auto px-6 max-w-5xl relative z-20 text-center py-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-zinc-100 mb-6 leading-tight tracking-tight">
            Tu momento de <span className="block text-amber-400">ganar</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Millones en premios. Compra segura. Sin complicaciones.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Button
              onClick={() => (window.location.hash = "#contador")}
              variant="primary"
              size="xl"
              className="w-full sm:w-auto"
            >
              Ver sorteos activos
            </Button>
            <Button
              onClick={() => (window.location.href = "/login")}
              variant="outline"
              size="xl"
              className="w-full sm:w-auto"
            >
              Iniciar sesión
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { value: "L. 3M", label: "En premios" },
              { value: "500+", label: "Sorteos realizados" },
              { value: "100%", label: "Seguro" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-amber-400 mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contador" className="py-24 bg-zinc-900">
        <div className="container mx-auto px-6 max-w-5xl">
          {loading ? (
            <Spinner center size="xl" />
          ) : lotteryData ? (
            <>
              <div className="text-center mb-16">
                <Badge variant="primary" className="mb-6 inline-flex items-center gap-2">
                  <Clock size={16} />
                  Cierra pronto
                </Badge>
                <h2 className="text-3xl md:text-5xl font-semibold text-zinc-100 mb-4">
                  {lotteryData.juego?.Nombre || 'Sorteo'}
                </h2>
                <p className="text-zinc-400 text-base max-w-xl mx-auto">
                  {lotteryData.juego?.Descripcion || 'Sorteo disponible'}
                </p>
              </div>

              <div className="mb-16">
                <CountdownTimer targetDate={lotteryData.Cierre} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <Card hover className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center shrink-0">
                      <Tag className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-sm font-medium mb-1">Precio por boleto</p>
                      <p className="text-lg text-zinc-100 font-semibold tabular-nums">
                        L. {lotteryData.juego?.PrecioJuego || '0.00'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card hover className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center shrink-0">
                      <Ticket className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-sm font-medium mb-1">Números a elegir</p>
                      <p className="text-lg text-zinc-100 font-semibold">
                        {lotteryData.juego?.CantidadNumeros || 0} números
                      </p>
                    </div>
                  </div>
                </Card>

                <Card hover className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-sm font-medium mb-1">Fecha de cierre</p>
                      <p className="text-lg text-zinc-100 font-semibold">
                        {new Date(lotteryData.Cierre).toLocaleDateString('es-HN')}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="text-center">
                <Button variant="primary" size="xl" onClick={() => window.location.href = '/juegos'}>
                  Comprar boleto ahora
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6 rounded-full">
                <Ticket className="w-12 h-12 text-zinc-600" />
              </div>
              <h3 className="text-2xl font-semibold text-zinc-100 mb-4">
                No hay sorteos disponibles
              </h3>
              <p className="text-zinc-400 text-base max-w-md mx-auto mb-8">
                Por el momento no hay sorteos activos. Vuelve pronto para participar en los próximos sorteos.
              </p>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/juegos'}>
                Ver todos los juegos
              </Button>
            </div>
          )}
        </div>
      </section>

      <section id="como-funciona" className="py-24 bg-zinc-950 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold text-zinc-100 mb-4">¿Cómo participar?</h2>
            <p className="text-zinc-400 text-base">Es tan fácil como contar hasta tres.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
                <UserCheck className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">1. Regístrate</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Crea tu cuenta gratuita en segundos. Solo necesitamos tus datos básicos.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">2. Elige tus números</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Selecciona el juego, escoge tus números de la suerte y realiza el pago seguro.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
                <Gift className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">3. ¡Cobra tu premio!</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Si tus números coinciden, te acreditaremos el premio a tu billetera digital.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
