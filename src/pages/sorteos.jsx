import { useState } from 'react';
import { Card, CardHeader, CardBody, Alert } from '../components/ui';
import { SorteoModal } from '../components/sorteos/SorteosModal';
import { SorteosList } from '../components/sorteos/sorteosList';
import { SorteoFilters } from '../components/sorteos/SorteosFilters';
import { useSorteos } from '../hooks/useSorteos';

export default function Sorteos() {
  const {
    sorteos,
    juegos,
    loading,
    error,
    filtro,
    setFiltro,
    crearSorteo,
    editarSorteo,
    eliminarSorteo,
    recargar
  } = useSorteos();

  const [modalOpen, setModalOpen] = useState(false);
  const [sorteoSeleccionado, setSorteoSeleccionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleNuevo = () => {
    setSorteoSeleccionado(null);
    setModalOpen(true);
  };

  const handleEditar = (sorteo) => {
    setSorteoSeleccionado(sorteo);
    setModalOpen(true);
  };

  const handleSave = async (datos, idSorteo) => {
    if (idSorteo) {
      return await editarSorteo(idSorteo, datos);
    } else {
      return await crearSorteo(datos);
    }
  };

  const handleDeleteConfirm = async () => {
    const resultado = await eliminarSorteo(confirmDelete);
    if (resultado.success) {
      setConfirmDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Gestionar Sorteos</h1>
          <p className="text-gray-600 mt-2">Crea, edita y gestiona los sorteos disponibles</p>
        </div>

        {/* Errores */}
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Filtros */}
        <SorteoFilters
          filtro={filtro}
          setFiltro={setFiltro}
          onNuevo={handleNuevo}
        />

        {/* Lista */}
        <Card>
          <SorteosList
            sorteos={sorteos}
            juegos={juegos}
            onEdit={handleEditar}
            onDelete={setConfirmDelete}
            loading={loading}
          />
        </Card>

        {/* Modal */}
        <SorteoModal
          isOpen={modalOpen}
          sorteo={sorteoSeleccionado}
          juegos={juegos}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setSorteoSeleccionado(null);
          }}
        />

                    {/* Confirmación eliminar */}
        {confirmDelete !== null && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardBody>
                <h3 className="text-xl font-bold text-gray-100 mb-4">
                  ¿Eliminar este sorteo?
                </h3>
                <p className="text-gray-300 mb-6 font-medium text-base">
                  Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setConfirmDelete(null)}
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