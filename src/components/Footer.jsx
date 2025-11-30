import { Ticket } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-zinc-950" />
            </div>
            <span className="text-zinc-100 font-semibold text-lg">Lotería</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors">
              Términos
            </a>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors">
              Privacidad
            </a>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors">
              Contacto
            </a>
          </nav>

          <p className="text-zinc-500 text-sm">© 2025 Lotería. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
