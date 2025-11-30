import { Calendar, Clock, CreditCard, DollarSign, Gift, Tag, Ticket, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();

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
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      {timeUnits.map((unit, index) => (
        <div
          key={index}
          className="flex flex-col items-center bg-white border border-gray-100 rounded-2xl px-6 py-4 w-40"
        >
          <div className="text-4xl md:text-6xl text-indigo-900 tabular-nums">{String(unit.value).padStart(2, "0")}</div>
          <p className="text-gray-700 text-sm md:text-base font-semibold mt-3 uppercase tracking-wide">{unit.label}</p>
        </div>
      ))}
    </div>
  );
};

const Home = () => {
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
    <div className="min-h-screen bg-gray-100">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-20px) translateX(10px) rotate(10deg); opacity: 0.3; }
          100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.1; }
        }
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <section className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-800 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-white pointer-events-none"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              opacity: 0.1,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          >
            {particle.type === "ticket" ? <Ticket size={particle.size} /> : <DollarSign size={particle.size} />}
          </div>
        ))}
        <div className="absolute inset-0 bg-linear-to-t from-indigo-900/50 to-transparent" />

        <div className="container mx-auto px-6 max-w-7xl relative z-20 text-center py-20">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-tight tracking-tight">
            Tu momento de <span className="block text-yellow-300">ganar</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Millones en premios. Compra segura. Sin complicaciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button
              onClick={() => (window.location.hash = "#contador")}
              className="px-10 py-4 bg-yellow-400 text-indigo-900 text-lg rounded-xl hover:bg-yellow-300 transition-all duration-200 w-full sm:w-auto"
            >
              Ver sorteos activos
            </button>
            <button
              onClick={() => (window.location.hash = "#login")}
              className="px-10 py-4 bg-white/10 text-white text-lg rounded-xl border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 w-full sm:w-auto"
            >
              Iniciar sesión
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6 sm:gap-12 max-w-4xl mx-auto">
            {[
              { value: "L. 3M", label: "En premios" },
              { value: "500+", label: "Sorteos realizados" },
              { value: "100%", label: "Seguro" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-300 mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contador" className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {lotteryData ? (
            <>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-indigo-900 px-6 py-3 rounded-full font text-sm mb-6">
                  <Clock size={20} />
                  Cierra pronto
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">{lotteryData.name}</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">{lotteryData.description}</p>
              </div>

              <div className="mb-16">
                <CountdownTimer targetDate={lotteryData.closeDate} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                      <Users className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-base font-semibold mb-1">Boletos vendidos</p>
                      <p className="text-xl text-gray-900 tabular-nums mb-1">
                        {lotteryData.ticketsSold.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-green-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
                      <Tag className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-base font-semibold mb-1">Precio por boleto</p>
                      <p className="text-xl text-gray-900 tabular-nums mb-1">{lotteryData.minPurchase}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-purple-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0">
                      <Calendar className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-base font-semibold mb-1">Fecha del sorteo</p>
                      <p className="text-xl text-gray-900 mb-1">{lotteryData.drawDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button className="px-16 py-5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform text-xl">
                  Comprar boleto ahora
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 text-lg">Cargando sorteo...</p>
            </div>
          )}
        </div>
      </section>

      <section id="como-funciona" className="py-24 bg-indigo-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">¿Cómo participar?</h2>
            <p className="text-indigo-200 text-xl">Es tan fácil como contar hasta tres.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative text-center">
              <div className="w-24 h-24 bg-indigo-800 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-3 hover:rotate-6 transition-transform shadow-2xl">
                <UserCheck className="w-12 h-12 text-yellow-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Regístrate</h3>
              <p className="text-indigo-200 text-base leading-relaxed">
                Crea tu cuenta gratuita en segundos. Solo necesitamos tus datos básicos.
              </p>
            </div>
            <div className="relative text-center">
              <div className="w-24 h-24 bg-indigo-800 rounded-3xl flex items-center justify-center mx-auto mb-8 transform -rotate-3 hover:-rotate-6 transition-transform shadow-2xl">
                <CreditCard className="w-12 h-12 text-yellow-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Elige tus números</h3>
              <p className="text-indigo-200 text-base leading-relaxed">
                Selecciona el juego, escoge tus números de la suerte y realiza el pago seguro por tu boleto.
              </p>
            </div>
            <div className="relative text-center">
              <div className="w-24 h-24 bg-indigo-800 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-3 hover:rotate-6 transition-transform shadow-2xl">
                <Gift className="w-12 h-12 text-yellow-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. ¡Cobra tu premio!</h3>
              <p className="text-indigo-200 text-base leading-relaxed">
                Espera la fecha del sorteo. Si tus números coinciden, te acreditaremos el premio a tu billetera digital.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
