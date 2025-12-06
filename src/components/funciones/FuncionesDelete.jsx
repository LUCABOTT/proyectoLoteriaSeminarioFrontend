import { Button } from "../../components/ui/Button";
import funcionesService from "../../services/Usuarios/funcionesService";

export default function FuncionesModalDelete({ isOpen, onClose, funcion, onDeleted }) {
  if (!isOpen || !funcion) return null;

async function eliminar() {
    try {
      await funcionesService.eliminar(funcion.fncod); // enviar fncod correctamente
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-zinc-900 text-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-red-500">¿Eliminar Función?</h2>

        <p className="mb-2">Confirme que desea eliminar la función:</p>
        <p className="font-bold mb-4">{funcion.fncod} - {funcion.fndsc}</p>

        <div className="flex justify-end gap-2">
          <Button variant="danger" onClick={eliminar}>
            Eliminar
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}