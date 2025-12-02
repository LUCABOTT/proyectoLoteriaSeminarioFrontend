import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Ticket, User, Mail, Calendar, TrendingUp, Award, ShoppingCart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { getMyTickets } from "../services/lotteryService";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalSpent: 0,
    activePurchases: 0,
    purchases: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard - Lotería";
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user?.id) return;

    try {
      const data = await getMyTickets(user.id);
      setStats({
        totalPurchases: data.total,
        totalSpent: data.totalSpent,
        activePurchases: data.activePurchases,
        purchases: data.purchases,
      });
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">Dashboard</h1>
          <p className="text-zinc-400">Bienvenido de nuevo, {user?.firstName}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-xs text-zinc-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{loading ? "..." : stats.activePurchases}</div>
            <div className="text-sm text-zinc-500">Tickets activos</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-zinc-500">Premios</span>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{formatCurrency(0)}</div>
            <div className="text-sm text-zinc-500">Ganado</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs text-zinc-500">Inversión</span>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">
              {loading ? "..." : formatCurrency(stats.totalSpent)}
            </div>
            <div className="text-sm text-zinc-500">Gastado</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs text-zinc-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{loading ? "..." : stats.totalPurchases}</div>
            <div className="text-sm text-zinc-500">Participaciones</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-zinc-500">Usuario activo</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-zinc-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Email</p>
                    <p className="text-sm text-zinc-300 break-all">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-zinc-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Miembro desde</p>
                    <p className="text-sm text-zinc-300">
                      {new Date().toLocaleDateString("es-HN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full mt-6 px-4 py-2 bg-red-600 text-zinc-100 text-sm font-medium hover:bg-red-500 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Acciones rápidas</h3>
              <div className="space-y-2">
                <Link
                  to="/sorteos"
                  className="flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm transition-colors"
                >
                  <Ticket className="w-5 h-5 text-amber-400" />
                  Ver sorteos disponibles
                </Link>
                <button
                  disabled
                  className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800/50 text-zinc-500 text-sm cursor-not-allowed"
                >
                  <Clock className="w-5 h-5" />
                  Mis boletos
                </button>
                <button
                  disabled
                  className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800/50 text-zinc-500 text-sm cursor-not-allowed"
                >
                  <TrendingUp className="w-5 h-5" />
                  Historial
                </button>
              </div>
            </div>
          </div>

          {/* Activity Area */}
          <div className="lg:col-span-2">
            {/* Recent Activity */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 mb-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Actividad reciente</h3>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-zinc-500">Cargando...</p>
                </div>
              ) : stats.purchases.length > 0 ? (
                <div className="space-y-3">
                  {stats.purchases.slice(0, 5).map((purchase) => (
                    <div
                      key={purchase.id}
                      className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                          <Ticket className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-100">{purchase.lotteryName}</p>
                          <p className="text-xs text-zinc-500">
                            {new Date(purchase.purchaseDate).toLocaleDateString("es-HN")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-zinc-100">{formatCurrency(purchase.price)}</p>
                        <p className="text-xs text-zinc-500">{purchase.numbers.join("-")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Ticket className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500 mb-2">No hay actividad reciente</p>
                  <p className="text-sm text-zinc-600">Compra tu primer boleto para comenzar</p>
                </div>
              )}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-100">Boletos activos</h3>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1">
                  {loading ? "..." : `${stats.activePurchases} boletos`}
                </span>
              </div>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-zinc-500">Cargando...</p>
                </div>
              ) : stats.activePurchases > 0 ? (
                <div className="space-y-3">
                  {stats.purchases
                    .filter((p) => p.status === "pending")
                    .slice(0, 3)
                    .map((purchase) => (
                      <div key={purchase.id} className="p-4 bg-zinc-950 border border-zinc-800">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-zinc-100">{purchase.lotteryName}</h4>
                          <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1">Pendiente</span>
                        </div>
                        <p className="text-xs text-zinc-500 mb-2">Ticket: {purchase.ticketNumber}</p>
                        <div className="flex gap-1">
                          {purchase.numbers.map((num, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-8 bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xs font-bold text-amber-400"
                            >
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500 mb-2">No tienes boletos activos</p>
                  <Link
                    to="/sorteos"
                    className="inline-block mt-4 px-6 py-2 bg-amber-400 text-zinc-950 text-sm font-medium hover:bg-amber-300 transition-colors"
                  >
                    Comprar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
