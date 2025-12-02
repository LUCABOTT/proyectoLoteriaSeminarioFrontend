import { useState, useContext, useEffect } from "react";
import { Ticket, Wallet } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { buyTicket } from "../services/lotteryService";
import { getSaldo } from "../services/walletService";
import { Modal, ModalHeader, ModalBody, Button, Alert, Card } from "./ui";

export default function BuyTicketModal({ lottery, onClose, onSuccess }) {
  const { user } = useContext(AuthContext);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [saldo, setSaldo] = useState(null);
  const [loadingSaldo, setLoadingSaldo] = useState(true);

  const minNum = lottery.minNumber || 0;
  const maxNum = lottery.maxNumber;
  const numbersNeeded = lottery.numbersCount;

  useEffect(() => {
    loadSaldo();
  }, []);

  const loadSaldo = async () => {
    try {
      const data = await getSaldo();
      setSaldo(data.saldo);
    } catch (err) {
      console.error("Error al cargar saldo:", err);
      setSaldo(0);
    } finally {
      setLoadingSaldo(false);
    }
  };

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

    // Verificar saldo
    if (saldo < lottery.ticketPrice) {
      setError(`Saldo insuficiente. Tu saldo: ${formatCurrency(saldo)} - Necesitas: ${formatCurrency(lottery.ticketPrice)}`);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await buyTicket(user.id, lottery.id, selectedNumbers);
      
      // Actualizar saldo después de compra
      await loadSaldo();
      
      onSuccess(result.ticket);
    } catch (err) {
      setError(err.message);
      // Recargar saldo en caso de error también
      await loadSaldo();
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
    <Modal isOpen={true} onClose={onClose} size="md">
      <ModalHeader onClose={onClose}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <Ticket className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">{lottery.name}</h2>
            <p className="text-sm text-zinc-400">{lottery.description}</p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        {/* Saldo del usuario */}
        <Card className="p-4 mb-6 bg-zinc-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-green-400" />
              <span className="text-sm text-zinc-400">Tu saldo:</span>
            </div>
            <span className="text-lg font-bold text-green-400">
              {loadingSaldo ? "..." : formatCurrency(saldo || 0)}
            </span>
          </div>
          {!loadingSaldo && saldo < lottery.ticketPrice && (
            <div className="mt-2 text-xs text-red-400">
              ⚠️ Saldo insuficiente. Necesitas recargar {formatCurrency(lottery.ticketPrice - saldo)} más.
            </div>
          )}
        </Card>

        <Card className="p-6 mb-6">
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
        </Card>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">Selecciona tus números</h3>
          <p className="text-sm text-zinc-400 mb-4">
            Elige {numbersNeeded} números del {minNum} al {maxNum}
          </p>
          
          <Button onClick={generateRandomNumbers} variant="secondary" size="md">
            Generar Números Aleatorios
          </Button>
        </div>

        <div className="mb-6">
          <Card className="p-4">
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
          </Card>
        </div>

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

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <div className="flex gap-4">
          <Button onClick={onClose} variant="secondary" className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handlePurchase}
            variant="primary"
            className="flex-1"
            isLoading={isLoading}
            disabled={isLoading || selectedNumbers.length !== numbersNeeded || saldo < lottery.ticketPrice}
          >
            {isLoading ? "Procesando..." : `Comprar por ${formatCurrency(lottery.ticketPrice)}`}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}
