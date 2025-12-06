import { Button } from "../../components/ui/Button";
import funcionesRolesService from "../../services/Usuarios/funcionesRolesService";

export default function FuncionesRolesModalDelete({ isOpen, onClose, relacion, onDeleted }) {
  if (!isOpen || !relacion) return null;

  async function eliminar() {
    try {
      await funcionesRolesService.eliminar({
        rolescod: relacion.rolescod,
        fncod: relacion.fncod
      });
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-zinc-900 text-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-red-500">¿Eliminar Función-Rol?</h2>

        <p className="mb-2">Confirme que desea eliminar la relación:</p>
        <p className="font-bold mb-4">{relacion.rolescod} - {relacion.fncod}</p>

        <div className="flex justify-end gap-2">
          <Button variant="danger" onClick={eliminar}>Eliminar</Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}
