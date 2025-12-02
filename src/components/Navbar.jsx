import { Menu, Ticket, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const navLinks = [
  { label: "Sorteos", href: "#contador" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Resultados", href: "#resultados" },
  { label: "Contacto", href: "#contacto" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 flex items-center justify-center">
              <Ticket className="w-4 h-4 text-zinc-950" />
            </div>
            <span className="text-zinc-100 font-semibold text-lg">Lotería</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
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
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-zinc-800 mt-2 pt-4 flex flex-col gap-2">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
