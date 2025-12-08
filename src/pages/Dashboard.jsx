import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Ticket, User, Mail, Calendar, TrendingUp, Award, ShoppingCart, Clock, ArrowUpCircle, ArrowDownCircle, RefreshCw, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { getHistorial, getSaldo } from "../services/walletService";
import { getUserProfile } from "../services/authService";
import dashboardService from "../services/dashboardService";
import { Card, CardBody, Button, Badge, Spinner } from "../components/ui";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const userRoles = user?.roles || [];
  const isAdmin = userRoles.includes('ADM');

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <JugadorDashboard />;
}

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    sorteosActivos: 0,
    ticketsVendidos: 0,
    usuariosRegistrados: 0,
    ventasTotales: 0,
    actividadReciente: []
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [profileData, statsData] = await Promise.all([
        getUserProfile(),
        dashboardService.getAdminStats()
      ]);
      setUserProfile(profileData);
      setStats(statsData);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAdminData();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">Panel de Administración</h1>
            <p className="text-zinc-400">
              Bienvenido, {userProfile?.primerNombre || user?.firstName || 'Administrador'}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-blue-400" />
              </div>
              <Badge variant="default">Sorteos</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{loading ? "..." : stats.sorteosActivos}</div>
            <div className="text-sm text-zinc-500">Sorteos activos</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-amber-400" />
              </div>
              <Badge variant="default">Tickets</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{loading ? "..." : stats.ticketsVendidos}</div>
            <div className="text-sm text-zinc-500">Tickets vendidos</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <Badge variant="default">Usuarios</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{loading ? "..." : stats.usuariosRegistrados}</div>
            <div className="text-sm text-zinc-500">Usuarios registrados</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-400" />
              </div>
              <Badge variant="default">Ingresos</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{loading ? "..." : formatCurrency(stats.ventasTotales)}</div>
            <div className="text-sm text-zinc-500">Ventas totales</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {userProfile?.primerNombre || user?.firstName} {userProfile?.primerApellido || user?.lastName}
                  </h3>
                  <p className="text-sm text-zinc-500">Administrador</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-zinc-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Email</p>
                    <p className="text-sm text-zinc-300 break-all">{userProfile?.useremail || user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-zinc-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Miembro desde</p>
                    <p className="text-sm text-zinc-300">
                      {userProfile?.userfching ? new Date(userProfile.userfching).toLocaleDateString("es-HN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : new Date().toLocaleDateString("es-HN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={logout} variant="danger" className="w-full mt-6">
                Cerrar sesión
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Acciones rápidas</h3>
              <div className="space-y-2">
                <Link
                  to="/admin/sorteos"
                  className="flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm transition-colors"
                >
                  <Ticket className="w-5 h-5 text-amber-400" />
                  Gestionar sorteos
                </Link>
                <Link
                  to="/admin/juegos"
                  className="flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm transition-colors"
                >
                  <Award className="w-5 h-5 text-amber-400" />
                  Gestionar juegos
                </Link>
                <Link
                  to="/usuarios"
                  className="flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm transition-colors"
                >
                  <Users className="w-5 h-5 text-amber-400" />
                  Ver usuarios
                </Link>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Actividad reciente</h3>
              {loading ? (
                <Spinner center />
              ) : stats.actividadReciente && stats.actividadReciente.length > 0 ? (
                <div className="space-y-3">
                  {stats.actividadReciente.map((ticket) => (
                    <div
                      key={ticket.IdTicket}
                      className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-100">
                            {ticket.usuario?.primerNombre} {ticket.usuario?.primerApellido}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {ticket.sorteo?.juego?.Nombre || 'Sorteo'} - {new Date(ticket.FechaCompra).toLocaleDateString("es-HN")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-400">
                          {formatCurrency(ticket.Total)}
                        </p>
                        <p className="text-xs text-zinc-500 capitalize">{ticket.Estado}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500 mb-2">No hay actividad reciente</p>
                  <p className="text-sm text-zinc-600">Las ventas de tickets aparecerán aquí</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function JugadorDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [saldo, setSaldo] = useState(0);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalIncome: 0,
    totalExpense: 0,
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Cargar datos en paralelo
      const [profileData, saldoData, historialData] = await Promise.all([
        getUserProfile(),
        getSaldo(),
        getHistorial(50, 1)
      ]);

      // Actualizar perfil
      setUserProfile(profileData);

      // Actualizar saldo
      setSaldo(saldoData.saldo || 0);
      
      // Calcular estadísticas
      const income = historialData.transacciones
        .filter(t => t.tipo === 'Recarga')
        .reduce((sum, t) => sum + parseFloat(t.monto), 0);
      
      const expense = historialData.transacciones
        .filter(t => t.tipo === 'Pago' || t.tipo === 'Compra de ticket')
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.monto)), 0);

      setStats({
        totalTransactions: historialData.total,
        totalIncome: income,
        totalExpense: expense,
        transactions: historialData.transacciones,
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTransactionIcon = (tipo) => {
    switch (tipo) {
      case 'Recarga':
        return <ArrowUpCircle className="w-5 h-5 text-green-400" />;
      case 'Pago':
      case 'Compra de ticket':
        return <ArrowDownCircle className="w-5 h-5 text-red-400" />;
      default:
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTransactionColor = (tipo) => {
    switch (tipo) {
      case 'Recarga':
        return 'text-green-400';
      case 'Pago':
      case 'Compra de ticket':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">Dashboard</h1>
            <p className="text-zinc-400">
              Bienvenido de nuevo, {userProfile?.primerNombre || user?.firstName || 'Usuario'}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
              </div>
              <Badge variant="default">Balance</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{loading ? "..." : formatCurrency(saldo)}</div>
            <div className="text-sm text-zinc-500">Saldo disponible</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </div>
              <Badge variant="default">Total</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{loading ? "..." : stats.totalTransactions}</div>
            <div className="text-sm text-zinc-500">Transacciones</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <ArrowUpCircle className="w-6 h-6 text-green-400" />
              </div>
              <Badge variant="default">Ingresos</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{loading ? "..." : formatCurrency(stats.totalIncome)}</div>
            <div className="text-sm text-zinc-500">Recargado</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <ArrowDownCircle className="w-6 h-6 text-red-400" />
              </div>
              <Badge variant="default">Gastos</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">
              {loading ? "..." : formatCurrency(stats.totalExpense)}
            </div>
            <div className="text-sm text-zinc-500">Gastado</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {userProfile?.primerNombre || user?.firstName} {userProfile?.primerApellido || user?.lastName}
                  </h3>
                  <p className="text-sm text-zinc-500">Usuario activo</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-zinc-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Email</p>
                    <p className="text-sm text-zinc-300 break-all">{userProfile?.useremail || user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShoppingCart className="w-5 h-5 text-zinc-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Saldo actual</p>
                    <p className="text-lg font-bold text-amber-400">{formatCurrency(saldo)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-zinc-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Miembro desde</p>
                    <p className="text-sm text-zinc-300">
                      {userProfile?.userfching ? new Date(userProfile.userfching).toLocaleDateString("es-HN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : new Date().toLocaleDateString("es-HN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={logout} variant="danger" className="w-full mt-6">
                Cerrar sesión
              </Button>
            </Card>

            <Card className="p-6">
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
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Actividad reciente</h3>
              {loading ? (
                <Spinner center />
              ) : stats.transactions.length > 0 ? (
                <div className="space-y-3">
                  {stats.transactions.slice(0, 10).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                          {getTransactionIcon(transaction.tipo)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-100">{transaction.tipo}</p>
                          <p className="text-xs text-zinc-500">
                            {new Date(transaction.creada).toLocaleString("es-HN", {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${getTransactionColor(transaction.tipo)}`}>
                          {transaction.tipo === 'Recarga' ? '+' : '-'}{formatCurrency(Math.abs(transaction.monto))}
                        </p>
                        <p className="text-xs text-zinc-500 capitalize">{transaction.estado}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500 mb-2">No hay actividad reciente</p>
                  <p className="text-sm text-zinc-600">Tus transacciones aparecerán aquí</p>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-100">Resumen del mes</h3>
                <Badge variant="default">{new Date().toLocaleDateString('es-HN', { month: 'long', year: 'numeric' })}</Badge>
              </div>
              {loading ? (
                <Spinner center />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <ArrowUpCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-100">Total recargado</p>
                        <p className="text-xs text-zinc-500">Ingresos</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-green-400">+{formatCurrency(stats.totalIncome)}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <ArrowDownCircle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-100">Total gastado</p>
                        <p className="text-xs text-zinc-500">Compras y pagos</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-red-400">-{formatCurrency(stats.totalExpense)}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-amber-400/5 border border-amber-400/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-100">Balance neto</p>
                        <p className="text-xs text-zinc-500">Diferencia</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-amber-400">
                      {formatCurrency(stats.totalIncome - stats.totalExpense)}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
