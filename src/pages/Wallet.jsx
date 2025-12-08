import { useState, useEffect, useContext } from "react";
import {
  Wallet,
  Plus,
  History,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getSaldo, getHistorial, crearOrdenPayPal } from "../services/walletService";
import { Card, Button, Alert, Input, Spinner } from "../components/ui";
import { useSearchParams } from "react-router-dom";

export default function WalletPage() {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
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

    // Verificar si hay parámetros de PayPal en la URL
    checkPayPalCallback();
  }, []);

  const checkPayPalCallback = () => {
    const exito = searchParams.get("exito");
    const cancelado = searchParams.get("cancelado");
    const errorParam = searchParams.get("error");
    const monto = searchParams.get("monto");

    if (exito === "true") {
      setSuccess(`¡Recarga exitosa! Se agregaron ${formatCurrency(parseFloat(monto || 0))} a tu billetera.`);
      // Recargar datos de la billetera para mostrar el nuevo saldo
      loadWalletData();
      // Limpiar parámetros de la URL después de 8 segundos
      setTimeout(() => {
        setSearchParams({});
        setSuccess("");
      }, 8000);
    } else if (cancelado === "true") {
      setError("Cancelaste la recarga. Intenta nuevamente cuando estés listo.");
      setTimeout(() => {
        setSearchParams({});
        setError("");
      }, 8000);
    } else if (errorParam) {
      setError(`Error en la recarga: ${decodeURIComponent(errorParam)}`);
      setTimeout(() => {
        setSearchParams({});
        setError("");
      }, 8000);
    }
  };

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

  const handleRecargarPayPal = async (e) => {
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
      const response = await crearOrdenPayPal(monto);

      // Redirigir a PayPal para aprobar el pago
      if (response.approveUrl) {
        window.location.href = response.approveUrl;
      } else {
        throw new Error("No se pudo generar la URL de PayPal");
      }
    } catch (err) {
      setError(err.message);
      setLoadingRecarga(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("es-HN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (tipo) => {
    switch (tipo) {
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
    switch (tipo) {
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
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">Billetera</h1>
          <p className="text-zinc-400">Administra tu saldo y transacciones</p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6 flex items-center gap-3">
            <XCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </Alert>
        )}

        {/* Saldo actual */}
        <Card className="p-8 mb-8 bg-linear-to-br from-amber-400/10 to-amber-600/5 border-amber-400/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Saldo disponible</p>
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
            <h2 className="text-xl font-bold text-zinc-100">Recargar</h2>
          </div>

          <form onSubmit={handleRecargarPayPal} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Monto a recargar</label>
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
              <p className="text-xs text-zinc-500 mt-1">Mínimo: L. 10 | Máximo: L. 10,000</p>
            </div>

            <div className="flex gap-2 flex-wrap">
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
              className="w-full flex items-center justify-center gap-2"
              isLoading={loadingRecarga}
              disabled={loadingRecarga || !montoRecarga}
            >
              {loadingRecarga ? (
                "Redirigiendo a PayPal..."
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.805.805 0 01-.794.68H7.72a.483.483 0 01-.477-.558L7.418 21h1.518l.95-6.02h1.385c4.678 0 7.75-2.203 8.796-6.502zm-2.96-5.09c.762.868.983 1.81.752 3.285-.019.123-.04.24-.062.36-.735 3.773-3.089 5.446-6.956 5.446H8.957c-.63 0-1.174.414-1.354 1.002l-.014-.002-.93 5.894H3.121a.051.051 0 01-.05-.06l2.598-16.49A.95.95 0 016.607 2h5.976c2.183 0 3.716.469 4.524 1.388z" />
                  </svg>
                  Recargar con PayPal
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="text-xs text-blue-300">
              💳 Serás redirigido a PayPal para completar el pago de forma segura. Los fondos se acreditarán
              automáticamente a tu billetera.
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
                      <p className="text-xs text-zinc-500">{formatDate(transaccion.creada)}</p>
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
