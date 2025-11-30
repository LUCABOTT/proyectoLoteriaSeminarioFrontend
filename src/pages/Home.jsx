"use client";

import { Calendar, Clock, CreditCard, DollarSign, Gift, Tag, Ticket, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";

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

  useEffect(() => {
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      const apiResponse = {
        id: "diaria-2025-11-30",
        name: "La Diaria",
        description: "Sorteo diario con premios garantizados",
        prize: "L. 250,000",
        closeDate: "2025-11-30T18:00:00",
        drawDate: "30/11/2025",
        ticketsSold: 3247,
        minPurchase: "L. 20",
        numbersFormat: "4 números de 0-9",
      };
      setLotteryData(apiResponse);
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
            <button
              onClick={() => (window.location.hash = "#contador")}
              className="px-8 py-4 bg-amber-400 text-zinc-950 text-base font-medium hover:bg-amber-300 transition-colors w-full sm:w-auto"
            >
              Ver sorteos activos
            </button>
            <button
              onClick={() => (window.location.hash = "#login")}
              className="px-8 py-4 bg-transparent text-zinc-100 text-base font-medium border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 transition-colors w-full sm:w-auto"
            >
              Iniciar sesión
            </button>
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

      {/* Countdown Section */}
      <section id="contador" className="py-24 bg-zinc-900">
        <div className="container mx-auto px-6 max-w-5xl">
          {lotteryData ? (
            <>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-400 px-4 py-2 text-sm font-medium mb-6 border border-amber-400/20">
                  <Clock size={16} />
                  Cierra pronto
                </div>
                <h2 className="text-3xl md:text-5xl font-semibold text-zinc-100 mb-4">{lotteryData.name}</h2>
                <p className="text-zinc-400 text-base max-w-xl mx-auto">{lotteryData.description}</p>
              </div>

              <div className="mb-16">
                <CountdownTimer targetDate={lotteryData.closeDate} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-zinc-950 p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-sm font-medium mb-1">Boletos vendidos</p>
                      <p className="text-lg text-zinc-100 font-semibold tabular-nums">
                        {lotteryData.ticketsSold.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center shrink-0">
                      <Tag className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-sm font-medium mb-1">Precio por boleto</p>
                      <p className="text-lg text-zinc-100 font-semibold tabular-nums">{lotteryData.minPurchase}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-sm font-medium mb-1">Fecha del sorteo</p>
                      <p className="text-lg text-zinc-100 font-semibold">{lotteryData.drawDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button className="px-12 py-4 bg-amber-400 text-zinc-950 hover:bg-amber-300 transition-colors text-base font-medium">
                  Comprar boleto ahora
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="animate-spin h-12 w-12 border-2 border-amber-400 border-t-transparent mx-auto"></div>
              <p className="text-zinc-500 mt-4 text-base">Cargando sorteo...</p>
            </div>
          )}
        </div>
      </section>

      {/* How it works Section */}
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
