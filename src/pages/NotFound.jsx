import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search, Frown } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Página no encontrada - Lotería";
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="text-[200px] font-bold text-transparent bg-clip-text bg-linear-to-b from-zinc-800 to-zinc-950 leading-none select-none">
              404
            </h1>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-zinc-100 mb-4">Página no encontrada</h2>
          <p className="text-zinc-400 text-lg mb-2">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
          <p className="text-zinc-500 text-sm">Puede que hayas escrito mal la URL o que el enlace esté roto.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 mb-8 text-left">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-zinc-100">¿Qué puedes hacer?</h3>
          </div>
          <ul className="space-y-3 text-zinc-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>Verifica que la URL esté escrita correctamente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>Vuelve a la página de inicio y navega desde ahí</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>Explora nuestros sorteos disponibles</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 text-zinc-950 font-medium hover:bg-amber-300 transition-colors"
          >
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
