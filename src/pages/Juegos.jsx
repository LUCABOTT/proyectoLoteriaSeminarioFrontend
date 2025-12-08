import { useState } from 'react';
import { Card, CardBody, Alert } from '../components/ui';
import { JuegosList } from '../components/juegos/JuegosList';
import { JuegoModal } from '../components/juegos/JuegoModal';
import { JuegoFilters } from '../components/juegos/JuegoFilters';
import { useJuegos } from '../hooks/useJuegos';

export default function Juegos() {
  const {
    juegos,
    loading,
    error,
    filtro,
    setFiltro,
    crearJuego,
    editarJuego,
    eliminarJuego
  } = useJuegos();

  const [modalOpen, setModalOpen] = useState(false);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleNuevo = () => {
    setJuegoSeleccionado(null);
    setModalOpen(true);
  };

  const handleEditar = (juego) => {
    setJuegoSeleccionado(juego);
    setModalOpen(true);
  };

  const handleSave = async (formData, juegoId) => {
    try {
      if (juegoId) {
        // Editar
        console.log('Editando juego ID:', juegoId, 'Data:', formData);
        const resultado = await editarJuego(juegoId, formData);
        
        if (resultado.success) {
          setSuccessMessage('Juego actualizado correctamente');
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          console.error('Error al editar:', resultado.error);
        }
        return resultado;
      } else {
        // Crear
        console.log('Creando nuevo juego:', formData);
        const resultado = await crearJuego(formData);
        
        if (resultado.success) {
          setSuccessMessage('Juego creado correctamente');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
        return resultado;
      }
    } catch (error) {
      console.error('Error en handleSave:', error);
      return { success: false, error: error.message || 'Error inesperado' };
    }
  };

  const handleDeleteConfirm = async () => {
    const resultado = await eliminarJuego(confirmDelete);
    if (resultado.success) {
      setConfirmDelete(null);
      setDeleteError(null);
    } else {
      setDeleteError(resultado.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Gestionar Juegos</h1>
          <p className="text-gray-600 mt-2">Crea, edita y gestiona los juegos de lotería</p>
        </div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <Alert variant="success" className="mb-6">
            {successMessage}
          </Alert>
        )}

        {/* Errores globales */}
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Filtros */}
        <JuegoFilters
          filtro={filtro}
          setFiltro={setFiltro}
          onNuevo={handleNuevo}
        />

        {/* Lista */}
        <Card>
          <JuegosList
            juegos={juegos}
            onEdit={handleEditar}
            onDelete={setConfirmDelete}
            loading={loading}
          />
        </Card>

        {/* Modal de crear/editar */}
        <JuegoModal
          isOpen={modalOpen}
          juego={juegoSeleccionado}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setJuegoSeleccionado(null);
          }}
        />

        {/* Modal de confirmación de eliminación */}
        {confirmDelete !== null && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardBody>
                <h3 className="text-xl font-bold text-gray-100 mb-4">
                  ¿Eliminar este juego?
                </h3>
                <p className="text-gray-300 mb-6 font-medium text-base">
                  Esta acción no se puede deshacer. Todos los sorteos relacionados también se eliminarán.
                </p>
                {deleteError && (
                  <Alert variant="error" className="mb-4">
                    {deleteError}
                  </Alert>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setConfirmDelete(null);
                      setDeleteError(null);
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-500 text-gray-100 font-bold rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}