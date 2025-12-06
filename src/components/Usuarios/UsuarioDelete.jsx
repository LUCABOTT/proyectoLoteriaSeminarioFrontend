import { Button } from "../../components/ui/Button";
import usuariosService from "../../services/Usuarios/usuariosService";

export default function UsuarioModalDelete({ isOpen, onClose, usuario, onDeleted }) {
  if (!isOpen || !usuario) return null;

  const handleEliminar = async () => {
    try {
      await usuariosService.eliminar(usuario.id);
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Error eliminando usuario:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-zinc-900 text-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-red-500">Eliminar Usuario</h2>

        <p className="mb-2">Confirme que desea eliminar al usuario:</p>
        <p className="font-bold mb-4">{usuario.primerNombre} {usuario.primerApellido} ({usuario.useremail})</p>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="danger" onClick={handleEliminar}>Eliminar</Button>
        </div>
      </div>
    </div>
  );
}
