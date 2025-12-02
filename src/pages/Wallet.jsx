import { useState, useEffect, useContext } from "react";
import { Wallet, Plus, History, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getSaldo, getHistorial, recargarSaldo } from "../services/walletService";
import { Card, Button, Alert, Input, Spinner } from "../components/ui";

export default function WalletPage() {
  const { user } = useContext(AuthContext);
  const [saldo, setSaldo] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecarga, setLoadingRecarga] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [montoRecarga, setMontoRecarga] = useState("");

  useEffect(() => {
    document.title = "Billetera - Lotería";
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      setError("");

      const saldoData = await getSaldo();
      setSaldo(saldoData.saldo);

      try {
        const historialData = await getHistorial();
        setHistorial(historialData.transacciones || []);
      } catch (err) {
        console.log("Historial no disponible");
        setHistorial([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecargar = async (e) => {
    e.preventDefault();
    
    const monto = parseFloat(montoRecarga);
    
    if (!monto || monto <= 0) {
      setError("Ingresa un monto válido");
      return;
    }

    if (monto < 10) {
      setError("El monto mínimo de recarga es L. 10");
      return;
    }

    if (monto > 10000) {
      setError("El monto máximo de recarga es L. 10,000");
      return;
    }

    setLoadingRecarga(true);
    setError("");
    setSuccess("");

    try {
      await recargarSaldo(monto);
      setSuccess(`¡Recarga exitosa! Se agregaron ${formatCurrency(monto)} a tu billetera.`);
      setMontoRecarga("");
      
      // Recargar datos
      await loadWalletData();

      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingRecarga(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("es-HN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTransactionIcon = (tipo) => {
    switch(tipo) {
      case "Recarga":
      case "Acreditación":
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case "Pago":
      case "Compra de ticket":
      case "Débito":
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <DollarSign className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getTransactionColor = (tipo) => {
    switch(tipo) {
      case "Recarga":
      case "Acreditación":
        return "text-green-400";
      case "Pago":
      case "Compra de ticket":
      case "Débito":
        return "text-red-400";
      default:
        return "text-zinc-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Spinner center />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">Mi Billetera</h1>
          <p className="text-zinc-400">Administra tu saldo y transacciones</p>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}
        {success && <Alert variant="success" className="mb-6">{success}</Alert>}

        {/* Saldo actual */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-amber-400/10 to-amber-600/5 border-amber-400/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Saldo Disponible</p>
                <p className="text-4xl font-bold text-amber-400">{formatCurrency(saldo)}</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            Usuario: {user?.firstName} {user?.lastName}
          </p>
        </Card>

        {/* Formulario de recarga */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100">Recargar Saldo</h2>
          </div>

          <form onSubmit={handleRecargar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Monto a recargar (HNL)
              </label>
              <Input
                type="number"
                placeholder="100.00"
                value={montoRecarga}
                onChange={(e) => setMontoRecarga(e.target.value)}
                min="10"
                max="10000"
                step="0.01"
                disabled={loadingRecarga}
              />
              <p className="text-xs text-zinc-500 mt-1">
                Mínimo: L. 10 | Máximo: L. 10,000
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setMontoRecarga("50")}
                disabled={loadingRecarga}
              >
                + L. 50
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setMontoRecarga("100")}
                disabled={loadingRecarga}
              >
                + L. 100
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setMontoRecarga("500")}
                disabled={loadingRecarga}
              >
                + L. 500
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setMontoRecarga("1000")}
                disabled={loadingRecarga}
              >
                + L. 1,000
              </Button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loadingRecarga}
              disabled={loadingRecarga || !montoRecarga}
            >
              {loadingRecarga ? "Procesando..." : "Recargar Ahora"}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="text-xs text-blue-300">
              ℹ️ Esta es una recarga manual para desarrollo. En producción se integraría con PayPal u otro procesador de pagos.
            </p>
          </div>
        </Card>

        {/* Historial de transacciones */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <History className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100">Historial de Transacciones</h2>
          </div>

          {historial.length > 0 ? (
            <div className="space-y-3">
              {historial.map((transaccion) => (
                <div
                  key={transaccion.id || transaccion.createdAt}
                  className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      {getTransactionIcon(transaccion.tipo)}
                    </div>
                    <div>
                      <p className="font-medium text-zinc-100">{transaccion.tipo}</p>
                      <p className="text-xs text-zinc-500">
                        {formatDate(transaccion.fecha || transaccion.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getTransactionColor(transaccion.tipo)}`}>
                      {transaccion.tipo === "Recarga" || transaccion.tipo === "Acreditación" ? "+" : "-"}
                      {formatCurrency(Math.abs(transaccion.monto))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 mb-2">No hay transacciones aún</p>
              <p className="text-sm text-zinc-600">Realiza tu primera recarga para comenzar</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
