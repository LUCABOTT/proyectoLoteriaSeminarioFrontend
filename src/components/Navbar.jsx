import { Menu, Ticket, X, User, LogOut, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

const publicNavLinks = [
  { label: "Sorteos", href: "#sorteos" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Resultados", href: "#resultados" },
  { label: "Contacto", href: "#contacto" },
];

// Se agregan Dashboard y se mantiene Loterías
const privateNavLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Loterías", href: "/lotteries" },
  { label: "Sorteos", href: "/admin/sorteos" },
  { label: "Juegos", href: "/admin/juegos" },
  { label: "Boletos", href: "/admin/tickets" },
  { label: "Mis boletos", href: "/mis-boletos" },
  { label: "Billetera", href: "/wallet" },
  { label: "Roles", href: "/roles" },
  { label: "Roles_Usuarios", href: "/roles-usuarios" },
  { label: "Funciones", href: "/funciones" },
  { label: "Funciones_Roles", href: "/funciones-roles" },
  { label: "Usuarios", href: "/usuarios" },
  { label: "Imagenes Usuarios", href: "/imagenes-usuarios" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const userMenuRef = useRef(null);

  const navLinks = isAuthenticated ? privateNavLinks : publicNavLinks;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="w-full px-3 sm:px-6">
        <div className="flex items-center h-16 gap-4">
          <Link to={isAuthenticated ? "/lotteries" : "/"} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-amber-400 flex items-center justify-center">
              <Ticket className="w-4 h-4 text-zinc-950" />
            </div>
            <span className="text-zinc-100 font-semibold text-lg">Lotería</span>
          </Link>

          {/* Enlaces desktop con barra deslizable, ancho extendido */}
          <div className="hidden md:block flex-1 min-w-0 mx-2">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-zinc-400 hover:text-zinc-100 whitespace-nowrap text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-zinc-100 hover:bg-zinc-900 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 shadow-lg">
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 text-sm transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Mi perfil
                    </Link>
                    <Link
                      to="/subir-imagen"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 text-sm transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Subir foto
                    </Link>
                    <Link
                      to="/wallet"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 text-sm transition-colors"
                    >
                      <Wallet className="w-4 h-4" />
                      Mi billetera
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 text-sm transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-amber-400 text-zinc-950 text-sm font-medium hover:bg-amber-300 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-zinc-800 mt-2 pt-4 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-zinc-100 text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Mi perfil
                    </Link>
                    <Link
                      to="/wallet"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Wallet className="w-4 h-4" />
                      Mi billetera
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 text-sm font-medium transition-colors text-left flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 text-sm font-medium text-left transition-colors"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 bg-amber-400 text-zinc-950 text-sm font-medium hover:bg-amber-300 transition-colors text-center"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
