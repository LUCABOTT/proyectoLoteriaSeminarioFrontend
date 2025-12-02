import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Ticket, User, Mail, Calendar, TrendingUp, Award, ShoppingCart, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">
            Dashboard
          </h1>
          <p className="text-zinc-400">
            Bienvenido de nuevo, {user?.firstName}
          </p>
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
            <div className="text-3xl font-bold text-zinc-100 mb-1">0</div>
            <div className="text-sm text-zinc-500">Tickets activos</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-zinc-500">Premios</span>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">L. 0</div>
            <div className="text-sm text-zinc-500">Ganado</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs text-zinc-500">Inversión</span>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">L. 0</div>
            <div className="text-sm text-zinc-500">Gastado</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs text-zinc-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">0</div>
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
                      {new Date().toLocaleDateString('es-HN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full mt-6 px-4 py-2 bg-red-600 text-zinc-100 text-sm font-medium hover:bg-red-500 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <Link
                  to="/sorteos"
                  className="flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm transition-colors"
                >
                  <Ticket className="w-5 h-5 text-amber-400" />
                  Ver Sorteos Disponibles
                </Link>
                <button
                  disabled
                  className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800/50 text-zinc-500 text-sm cursor-not-allowed"
                >
                  <Clock className="w-5 h-5" />
                  Mis Tickets (Próximamente)
                </button>
                <button
                  disabled
                  className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800/50 text-zinc-500 text-sm cursor-not-allowed"
                >
                  <TrendingUp className="w-5 h-5" />
                  Historial (Próximamente)
                </button>
              </div>
            </div>
          </div>

          {/* Activity Area */}
          <div className="lg:col-span-2">
            {/* Recent Activity */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 mb-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Actividad Reciente</h3>
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 mb-2">No hay actividad reciente</p>
                <p className="text-sm text-zinc-600">Compra tu primer ticket para comenzar</p>
              </div>
            </div>

            {/* Active Tickets */}
            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-100">Tickets Activos</h3>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1">0 tickets</span>
              </div>
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 mb-2">No tienes tickets activos</p>
                <Link 
                  to="/sorteos"
                  className="inline-block mt-4 px-6 py-2 bg-amber-400 text-zinc-950 text-sm font-medium hover:bg-amber-300 transition-colors"
                >
                  Comprar Ticket
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
