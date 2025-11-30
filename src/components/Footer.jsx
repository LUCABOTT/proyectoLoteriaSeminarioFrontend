import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white text-2xl font-extrabold mb-4">Lotería</h3>
            <p className="text-base leading-relaxed">
              La plataforma de sorteos más transparente y segura. Cumple tus sueños hoy.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Loterías</h4>
            <ul className="space-y-3 text-base">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  La Diaria
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pega 3
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Ayuda</h4>
            <ul className="space-y-3 text-base">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Soporte
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de privacidad
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-base">
          <p>&copy; 2025 Lotería. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
