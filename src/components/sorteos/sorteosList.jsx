import { Card, CardBody, Badge } from '../ui';
import { Edit2, Trash2 } from 'lucide-react';

const estadoColores = {
  abierto: 'bg-green-100 text-green-800',
  cerrado: 'bg-yellow-100 text-yellow-800',
  sorteado: 'bg-blue-100 text-blue-800',
  anulado: 'bg-red-100 text-red-800'
};

export const SorteosList = ({ sorteos, juegos, onEdit, onDelete, loading }) => {
  const getNombreJuego = (idJuego) => {
    return juegos.find(j => j.Id === idJuego)?.Nombre || 'Desconocido';
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES');
  };

  if (loading) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando sorteos...</p>
        </CardBody>
      </Card>
    );
  }

  if (sorteos.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <p className="text-gray-600">No hay sorteos disponibles</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-100 border border-gray-200 rounded-lg shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200 border-b border-gray-300">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Juego</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cierre</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Números Ganadores</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sorteos.map((sorteo) => (
            <tr key={sorteo.Id} className="border-b border-gray-200 odd:bg-gray-50 even:bg-gray-100 hover:bg-gray-200 transition">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{sorteo.Id}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{getNombreJuego(sorteo.IdJuego)}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{formatearFecha(sorteo.Cierre)}</td>
              <td className="px-6 py-4 text-sm">
                <Badge className={estadoColores[sorteo.Estado]}>
                  {sorteo.Estado}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {sorteo.NumerosGanadores ? (
                  <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                    {sorteo.NumerosGanadores.join(', ')}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => onEdit(sorteo)}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(sorteo.Id)}
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};