import { Card, Badge } from '../ui';
import { Edit2, Trash2, DollarSign, Hash } from 'lucide-react';

export const JuegosList = ({ juegos, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <Card>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando juegos...</p>
        </div>
      </Card>
    );
  }

  if (juegos.length === 0) {
    return (
      <Card>
        <div className="p-6 text-center">
          <p className="text-gray-600">No hay juegos disponibles</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descripción</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rango</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cantidad</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Repetidos</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {juegos.map((juego) => (
            <tr key={juego.Id} className="border-b border-gray-200 hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{juego.Id}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{juego.Nombre}</td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                {juego.Descripcion || '-'}
              </td>
              <td className="px-6 py-4 text-sm">
                <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit">
                  <DollarSign size={14} />
                  {parseFloat(juego.PrecioJuego).toFixed(2)}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {juego.RangoMin} - {juego.RangoMax}
              </td>
              <td className="px-6 py-4 text-sm">
                <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
                  <Hash size={14} />
                  {juego.CantidadNumeros}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm">
                <Badge className={juego.PermiteRepetidos ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {juego.PermiteRepetidos ? 'Sí' : 'No'}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => onEdit(juego)}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(juego.Id)}
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