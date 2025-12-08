import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from '../ui';
import { X } from 'lucide-react';

export const SorteoModal = ({ isOpen, sorteo, juegos, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    IdJuego: '',
    Cierre: '',
    Estado: 'abierto'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Bloquear si sorteo está sorteado o anulado
  const esEditable = !sorteo || (sorteo.Estado !== 'sorteado' && sorteo.Estado !== 'anulado');

  useEffect(() => {
    if (sorteo) {
      setFormData({
        IdJuego: sorteo.IdJuego,
        Cierre: sorteo.Cierre.split('T')[0],
        Estado: sorteo.Estado
      });
    } else {
      setFormData({ IdJuego: '', Cierre: '', Estado: 'abierto' });
    }
    setErrors({});
  }, [sorteo, isOpen]);

  const validar = () => {
    const nuevoErrors = {};
    if (!formData.IdJuego) nuevoErrors.IdJuego = 'Selecciona un juego';
    if (!formData.Cierre) nuevoErrors.Cierre = 'La fecha de cierre es requerida';

    const fechaCierre = new Date(formData.Cierre);
    if (fechaCierre <= new Date()) {
      nuevoErrors.Cierre = 'La fecha debe ser futura';
    }

    setErrors(nuevoErrors);
    return Object.keys(nuevoErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setLoading(true);
    const resultado = await onSave(
      {
        ...formData,
        IdJuego: parseInt(formData.IdJuego, 10)
      },
      sorteo?.Id
    );
    setLoading(false);

    if (resultado.success) {
      onClose();
    } else {
      setErrors({ submit: resultado.error });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-100">
            {sorteo ? 'Editar Sorteo' : 'Crear Nuevo Sorteo'}
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-100">
            <X size={24} />
          </button>
        </div>
      </ModalHeader>

      <ModalBody>
        {!esEditable && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm font-medium">
              ⚠️ Este sorteo no puede editarse porque ya ha sido {sorteo.Estado}.
            </p>
          </div>
        )}

        <form id="sorteoForm" className="space-y-4 text-gray-100">
          {/* Juego */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Juego *
            </label>
            <select
              value={formData.IdJuego}
              onChange={(e) => setFormData({ ...formData, IdJuego: e.target.value })}
              disabled={sorteo !== null || !esEditable}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed bg-gray-100 text-gray-900 placeholder-gray-500"
            >
              <option value="">Selecciona un juego</option>
              {juegos.map((juego) => (
                <option key={juego.Id} value={juego.Id}>
                  {juego.Nombre}
                </option>
              ))}
            </select>
            {errors.IdJuego && <p className="text-red-400 text-sm mt-1">{errors.IdJuego}</p>}
          </div>

          {/* Fecha de Cierre */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Fecha de Cierre *
            </label>
            <Input
              type="datetime-local"
              value={formData.Cierre}
              onChange={(e) => setFormData({ ...formData, Cierre: e.target.value })}
              disabled={!esEditable}
              className={`bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed ${errors.Cierre ? 'border-red-500' : ''}`}
              style={{
                accentColor: '#eab308'
              }}
            />
            {errors.Cierre && <p className="text-red-400 text-sm mt-1">{errors.Cierre}</p>}
          </div>

          {/* Estado */}
          {sorteo && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Estado
              </label>
              <select
                value={formData.Estado}
                onChange={(e) => setFormData({ ...formData, Estado: e.target.value })}
                disabled={!esEditable}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-100 text-gray-900 placeholder-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <option value="abierto">Abierto</option>
                <option value="cerrado">Cerrado</option>
                <option value="sorteado">Sorteado</option>
                <option value="anulado">Anulado</option>
              </select>
            </div>
          )}

          {/* Números Ganadores - Solo lectura */}
          {sorteo && sorteo.NumerosGanadores && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Números Ganadores (Solo lectura)
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-900 font-mono text-sm">
                {sorteo.NumerosGanadores.join(', ')}
              </div>
              <p className="text-gray-400 text-xs mt-1">Los números ganadores no se pueden editar una vez generados.</p>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}
        </form>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={loading || !esEditable}
        >
          {loading ? 'Guardando...' : sorteo ? 'Actualizar' : 'Crear'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};