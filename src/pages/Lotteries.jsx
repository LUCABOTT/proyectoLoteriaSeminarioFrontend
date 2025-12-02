import { useEffect, useState, useContext } from "react";
import { Ticket } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getAllLotteries } from "../services/lotteryService";
import BuyTicketModal from "../components/BuyTicketModal";
import { Card, Alert, Button, Badge } from "../components/ui";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    document.title = "Sorteos - Lotería";

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

  return (
    <div className="flex gap-2">
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center bg-zinc-800 px-3 py-2 rounded">
          <div className="text-xl font-bold text-amber-400">{String(timeLeft.days).padStart(2, "0")}</div>
          <div className="text-xs text-zinc-400">Días</div>
        </div>
      )}
      <div className="flex flex-col items-center bg-zinc-800 px-3 py-2 rounded">
        <div className="text-xl font-bold text-amber-400">{String(timeLeft.hours).padStart(2, "0")}</div>
        <div className="text-xs text-zinc-400">Hrs</div>
      </div>
      <div className="flex flex-col items-center bg-zinc-800 px-3 py-2 rounded">
        <div className="text-xl font-bold text-amber-400">{String(timeLeft.minutes).padStart(2, "0")}</div>
        <div className="text-xs text-zinc-400">Min</div>
      </div>
      <div className="flex flex-col items-center bg-zinc-800 px-3 py-2 rounded">
        <div className="text-xl font-bold text-amber-400">{String(timeLeft.seconds).padStart(2, "0")}</div>
        <div className="text-xs text-zinc-400">Seg</div>
      </div>
    </div>
  );
};

const LotteryCard = ({ lottery, onSelectLottery }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 hover:border-amber-400 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-zinc-100 mb-1">{lottery.name}</h3>
          <p className="text-sm text-zinc-400">{lottery.description}</p>
        </div>
        <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
          <Ticket className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-zinc-400 mb-1">Premio Mayor</div>
        <div className="text-3xl font-bold text-amber-400">{formatCurrency(lottery.prize)}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="text-xs text-zinc-500 mb-1">Formato</div>
          <div className="text-sm text-zinc-300">{lottery.numbersFormat}</div>
        </div>
        <div>
          <div className="text-xs text-zinc-500 mb-1">Frecuencia</div>
          <div className="text-sm text-zinc-300">{lottery.frequency}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-zinc-500 mb-2">Próximo Sorteo</div>
        <CountdownTimer targetDate={lottery.nextDraw} />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">Desde {formatCurrency(lottery.ticketPrice)}</div>
        <Button onClick={() => onSelectLottery(lottery)} variant="primary" size="md">
          Comprar
        </Button>
      </div>
    </div>
  );
};

export default function Lotteries() {
  const { user } = useContext(AuthContext);
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLottery, setSelectedLottery] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchasedTicket, setPurchasedTicket] = useState(null);

  useEffect(() => {
    loadLotteries();
  }, []);

  const loadLotteries = async () => {
    try {
      setLoading(true);
      const data = await getAllLotteries();
      setLotteries(data.lotteries);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLottery = (lottery) => {
    setSelectedLottery(lottery);
  };

  const handlePurchaseSuccess = (ticket) => {
    setPurchasedTicket(ticket);
    setSelectedLottery(null);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setPurchasedTicket(null);
    }, 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-zinc-400 py-20">Cargando sorteos...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-zinc-950 pt-20 px-6 pb-12">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-zinc-100 mb-2">Sorteos</h1>
            <p className="text-zinc-400">Bienvenido, {user?.firstName}. Selecciona un sorteo y prueba tu suerte</p>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          {showSuccess && purchasedTicket && (
            <Alert variant="success">
              <p className="font-semibold mb-2">¡Ticket comprado exitosamente!</p>
              <p className="text-sm">
                Número de ticket: <span className="font-mono font-bold">{purchasedTicket.ticketNumber}</span>
              </p>
              <p className="text-sm">Números: {purchasedTicket.numbers.join(" - ")}</p>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lotteries.map((lottery) => (
              <LotteryCard key={lottery.id} lottery={lottery} onSelectLottery={handleSelectLottery} />
            ))}
          </div>

          {lotteries.length === 0 && !loading && (
            <div className="text-center py-20">
              <Ticket className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">No hay sorteos disponibles en este momento</p>
            </div>
          )}
        </div>
      </div>

      {selectedLottery && (
        <BuyTicketModal
          lottery={selectedLottery}
          onClose={() => setSelectedLottery(null)}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </>
  );
}
