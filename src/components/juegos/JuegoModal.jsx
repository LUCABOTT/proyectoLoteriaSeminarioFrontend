import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from '../ui';
import { X } from 'lucide-react';

export const JuegoModal = ({ isOpen, juego, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    Nombre: '',
    Descripcion: '',
    PrecioJuego: '',
    RangoMin: '0',
    RangoMax: '100',
    CantidadNumeros: '',
    PermiteRepetidos: false,
    ReglasResumen: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (juego) {
      console.log('JuegoModal - Cargando juego:', juego);
      setFormData({
        Nombre: juego.Nombre || '',
        Descripcion: juego.Descripcion || '',
        PrecioJuego: String(juego.PrecioJuego || ''),
        RangoMin: String(juego.RangoMin || '0'),
        RangoMax: String(juego.RangoMax || '100'),
        CantidadNumeros: String(juego.CantidadNumeros || ''),
        PermiteRepetidos: Boolean(juego.PermiteRepetidos) || false,
        ReglasResumen: juego.ReglasResumen || ''
      });
    } else {
      setFormData({
        Nombre: '',
        Descripcion: '',
        PrecioJuego: '',
        RangoMin: '0',
        RangoMax: '100',
        CantidadNumeros: '',
        PermiteRepetidos: false,
        ReglasResumen: ''
      });
    }
    setErrors({});
  }, [juego, isOpen]);

  const validar = () => {
    const nuevoErrors = {};
    
    const nombreTrimmed = (formData.Nombre || '').trim();
    if (!nombreTrimmed || nombreTrimmed.length < 3 || nombreTrimmed.length > 100) {
      nuevoErrors.Nombre = 'El nombre debe tener 3-100 caracteres';
    }
    
    if (formData.Descripcion && formData.Descripcion.length > 255) {
      nuevoErrors.Descripcion = 'La descripción no puede exceder 255 caracteres';
    }
    
    const precioNum = parseFloat(formData.PrecioJuego || 0);
    if (!formData.PrecioJuego || isNaN(precioNum) || precioNum < 1 || precioNum > 1000) {
      nuevoErrors.PrecioJuego = 'El precio debe estar entre 1 y 1000';
    }
    
    const rangoMinNum = parseInt(formData.RangoMin || 0, 10);
    if (isNaN(rangoMinNum) || rangoMinNum < 0 || rangoMinNum > 100) {
      nuevoErrors.RangoMin = 'Rango mínimo debe estar entre 0 y 100';
    }
    
    const rangoMaxNum = parseInt(formData.RangoMax || 100, 10);
    if (isNaN(rangoMaxNum) || rangoMaxNum < 0 || rangoMaxNum > 100) {
      nuevoErrors.RangoMax = 'Rango máximo debe estar entre 0 y 100';
    }
    
    if (!isNaN(rangoMinNum) && !isNaN(rangoMaxNum) && rangoMinNum > rangoMaxNum) {
      nuevoErrors.RangoMin = 'Rango mínimo no puede ser mayor que rango máximo';
    }
    
    const cantNum = parseInt(formData.CantidadNumeros || 0, 10);
    if (!formData.CantidadNumeros || isNaN(cantNum) || cantNum < 1 || cantNum > 20) {
      nuevoErrors.CantidadNumeros = 'Cantidad debe estar entre 1 y 20';
    }
    
    if (formData.ReglasResumen && formData.ReglasResumen.length > 255) {
      nuevoErrors.ReglasResumen = 'Las reglas no pueden exceder 255 caracteres';
    }
    
    setErrors(nuevoErrors);
    return Object.keys(nuevoErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setLoading(true);
    try {
      const datos = {
        Nombre: (formData.Nombre || '').trim(),
        Descripcion: (formData.Descripcion || '').trim(),
        PrecioJuego: parseFloat(formData.PrecioJuego || 0),
        RangoMin: parseInt(formData.RangoMin || 0, 10),
        RangoMax: parseInt(formData.RangoMax || 100, 10),
        CantidadNumeros: parseInt(formData.CantidadNumeros || 0, 10),
        PermiteRepetidos: Boolean(formData.PermiteRepetidos),
        ReglasResumen: (formData.ReglasResumen || '').trim()
      };

      console.log('JuegoModal.handleSubmit - Enviando:', { juegoId: juego?.Id, datos });
      
      const resultado = await onSave(datos, juego?.Id);
      
      if (resultado.success) {
        onClose();
      } else {
        setErrors({ submit: resultado.error });
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      setErrors({ submit: 'Error inesperado: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-100">
            {juego ? 'Editar Juego' : 'Crear Nuevo Juego'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-gray-100"
          >
            <X size={24} />
          </button>
        </div>
      </ModalHeader>

      <ModalBody>
        <form id="juegoForm" className="space-y-4 text-gray-100">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Nombre *
            </label>
            <Input
              type="text"
              value={formData.Nombre}
              onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
              placeholder="Ej: Lotería Nacional"
              maxLength={100}
              className={`bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300 ${errors.Nombre ? 'border-red-500' : ''}`}
            />
            {errors.Nombre && <p className="text-red-400 text-sm mt-1">{errors.Nombre}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.Descripcion}
              onChange={(e) => setFormData({ ...formData, Descripcion: e.target.value })}
              placeholder="Descripción del juego"
              maxLength={255}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-100 text-gray-900 placeholder-gray-500"
            />
            {errors.Descripcion && <p className="text-red-400 text-sm mt-1">{errors.Descripcion}</p>}
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Precio del Juego * (1-1000)
            </label>
            <Input
              type="number"
              step="0.01"
              min="1"
              max="1000"
              value={formData.PrecioJuego}
              onChange={(e) => {
                let val = e.target.value;
                if (val && parseFloat(val) < 1) val = '1';
                if (val && parseFloat(val) > 1000) val = '1000';
                setFormData({ ...formData, PrecioJuego: val });
              }}
              placeholder="Ej: 10.00"
              className={`bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300 ${errors.PrecioJuego ? 'border-red-500' : ''}`}
            />
            {errors.PrecioJuego && <p className="text-red-400 text-sm mt-1">{errors.PrecioJuego}</p>}
          </div>

          {/* Rango Min y Max */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Rango Mínimo * (0-100)
              </label>
              <Input
                type="number"
                inputMode="numeric"
                min="0"
                max="100"
                value={formData.RangoMin}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^\d]/g, '');
                  if (val === '') val = '0';
                  const numVal = parseInt(val, 10);
                  if (numVal < 0) val = '0';
                  if (numVal > 100) val = '100';
                  setFormData({ ...formData, RangoMin: val });
                }}
                placeholder="0"
                className={`bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300 ${errors.RangoMin ? 'border-red-500' : ''}`}
              />
              {errors.RangoMin && <p className="text-red-400 text-sm mt-1">{errors.RangoMin}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Rango Máximo * (0-100)
              </label>
              <Input
                type="number"
                inputMode="numeric"
                min="0"
                max="100"
                value={formData.RangoMax}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^\d]/g, '');
                  if (val === '') val = '100';
                  const numVal = parseInt(val, 10);
                  if (numVal < 0) val = '0';
                  if (numVal > 100) val = '100';
                  setFormData({ ...formData, RangoMax: val });
                }}
                placeholder="100"
                className={`bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300 ${errors.RangoMax ? 'border-red-500' : ''}`}
              />
              {errors.RangoMax && <p className="text-red-400 text-sm mt-1">{errors.RangoMax}</p>}
            </div>
          </div>

          {/* Cantidad de Números */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Cantidad de Números * (1-20)
            </label>
            <Input
              type="number"
              inputMode="numeric"
              min="1"
              max="20"
              value={formData.CantidadNumeros}
              onChange={(e) => {
                let val = e.target.value.replace(/[^\d]/g, '');
                if (val === '') val = '';
                const numVal = parseInt(val, 10);
                if (numVal && numVal < 1) val = '1';
                if (numVal && numVal > 20) val = '20';
                setFormData({ ...formData, CantidadNumeros: val });
              }}
              placeholder="Ej: 2"
              className={`bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300 ${errors.CantidadNumeros ? 'border-red-500' : ''}`}
            />
            {errors.CantidadNumeros && <p className="text-red-400 text-sm mt-1">{errors.CantidadNumeros}</p>}
          </div>

          {/* Permite Repetidos */}
          <div className="flex items-center text-gray-200">
            <input
              type="checkbox"
              id="permitRepetidos"
              checked={formData.PermiteRepetidos}
              onChange={(e) => setFormData({ ...formData, PermiteRepetidos: e.target.checked })}
              className="w-4 h-4 text-yellow-500 rounded focus:ring-2 focus:ring-yellow-500 cursor-pointer"
            />
            <label htmlFor="permitRepetidos" className="ml-2 text-sm font-medium text-gray-200 cursor-pointer">
              Permite números repetidos
            </label>
          </div>

          {/* Reglas */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Resumen de Reglas
            </label>
            <textarea
              value={formData.ReglasResumen}
              onChange={(e) => setFormData({ ...formData, ReglasResumen: e.target.value })}
              placeholder="Resumen de las reglas del juego"
              maxLength={255}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-100 text-gray-900 placeholder-gray-500"
            />
            {errors.ReglasResumen && <p className="text-red-400 text-sm mt-1">{errors.ReglasResumen}</p>}
          </div>

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
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : juego ? 'Actualizar' : 'Crear'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};