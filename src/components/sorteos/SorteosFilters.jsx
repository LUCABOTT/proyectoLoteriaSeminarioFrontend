import { Input } from '../ui';
import { Search } from 'lucide-react';

export const SorteoFilters = ({ filtro, setFiltro, onNuevo }) => {
  return (
    <div className="flex gap-4 items-center mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Buscar por ID, juego o estado..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="pl-10"
        />
      </div>
      <button
        onClick={onNuevo}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium"
      >
        + Nuevo Sorteo
      </button>
    </div>
  );
};