import { useState, useContext } from "react";
import { X, Ticket } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { buyTicket } from "../services/lotteryService";

export default function BuyTicketModal({ lottery, onClose, onSuccess }) {
  const { user } = useContext(AuthContext);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const minNum = lottery.minNumber || 0;
  const maxNum = lottery.maxNumber;
  const numbersNeeded = lottery.numbersCount;

  const toggleNumber = (num) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      if (selectedNumbers.length < numbersNeeded) {
        setSelectedNumbers([...selectedNumbers, num]);
      }
    }
  };

  const generateRandomNumbers = () => {
    const numbers = [];
    while (numbers.length < numbersNeeded) {
      const randomNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b));
  };

  const handlePurchase = async () => {
    if (selectedNumbers.length !== numbersNeeded) {
      setError(`Debes seleccionar ${numbersNeeded} números`);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await buyTicket(user.id, lottery.id, selectedNumbers);
      onSuccess(result.ticket);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-zinc-900 border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
              <Ticket className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-100">{lottery.name}</h2>
              <p className="text-sm text-zinc-400">{lottery.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Prize Info */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Premio Mayor</p>
                <p className="text-2xl font-bold text-amber-400">{formatCurrency(lottery.prize)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Precio del Ticket</p>
                <p className="text-2xl font-bold text-zinc-100">{formatCurrency(lottery.ticketPrice)}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Selecciona tus números</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Elige {numbersNeeded} números del {minNum} al {maxNum}
            </p>
            
            <button
              onClick={generateRandomNumbers}
              className="px-4 py-2 bg-zinc-800 text-zinc-100 text-sm font-medium hover:bg-zinc-700 transition-colors"
            >
              Generar Números Aleatorios
            </button>
          </div>

          {/* Selected Numbers Display */}
          <div className="mb-6">
            <div className="bg-zinc-950 border border-zinc-800 p-4">
              <p className="text-xs text-zinc-500 mb-2">
                Tus números ({selectedNumbers.length}/{numbersNeeded})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedNumbers.length > 0 ? (
                  selectedNumbers.map((num, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 bg-amber-400 text-zinc-950 flex items-center justify-center text-lg font-bold"
                    >
                      {num}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">No has seleccionado números aún</p>
                )}
              </div>
            </div>
          </div>

          {/* Number Grid */}
          <div className="mb-6">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: maxNum - minNum + 1 }, (_, i) => minNum + i).map((num) => (
                <button
                  key={num}
                  onClick={() => toggleNumber(num)}
                  disabled={selectedNumbers.length >= numbersNeeded && !selectedNumbers.includes(num)}
                  className={`
                    aspect-square flex items-center justify-center text-sm font-semibold transition-colors
                    ${selectedNumbers.includes(num)
                      ? 'bg-amber-400 text-zinc-950'
                      : 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
                    }
                    ${selectedNumbers.length >= numbersNeeded && !selectedNumbers.includes(num)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                    }
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-zinc-800 text-zinc-100 text-sm font-medium hover:bg-zinc-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handlePurchase}
              disabled={isLoading || selectedNumbers.length !== numbersNeeded}
              className="flex-1 px-6 py-3 bg-amber-400 text-zinc-950 text-sm font-medium hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Procesando..." : `Comprar por ${formatCurrency(lottery.ticketPrice)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
