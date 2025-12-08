import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../ui/Modal";
import { Button, Badge, Spinner, Alert } from "../ui";
import { Shield } from "lucide-react";
import rolesUsuariosService from "../../services/rolesUsuariosService";
import rolesService from "../../services/rolesService";

export default function UsuarioManageRoles({ isOpen, onClose, usuario, onSaved }) {
  const [currentRole, setCurrentRole] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && usuario) {
      loadData();
    }
  }, [isOpen, usuario]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesUsuariosRes, allRolesRes] = await Promise.all([
        rolesUsuariosService.listar(),
        rolesService.listar(),
      ]);

      const userRolesData = rolesUsuariosRes.data.filter((r) => r.usercod === usuario.id);
      const activeRole = userRolesData.length > 0 ? userRolesData[0] : null;
      
      setCurrentRole(activeRole);
      setSelectedRole(activeRole ? activeRole.rolescod : "");
      setAllRoles(allRolesRes.data);
    } catch (err) {
      setError(err.response?.data?.msj || "Error cargando roles");
    }
    setLoading(false);
  };

  const handleSaveRole = async () => {
    if (!selectedRole) {
      setError("Debe seleccionar un rol");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Si el usuario tiene un rol actual, eliminarlo primero
      if (currentRole) {
        await rolesUsuariosService.eliminar({
          usercod: usuario.id,
          rolescod: currentRole.rolescod,
        });
      }

      // Asignar el nuevo rol
      await rolesUsuariosService.crear({
        usercod: usuario.id,
        rolescod: selectedRole,
        roleuserest: "AC",
      });

      setSuccess("Rol actualizado exitosamente");
      await loadData();
      onSaved();
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msj || "Error al actualizar rol");
    }
    setSubmitting(false);
  };

  if (!usuario) return null;

  return (
    <Modal isOpen={isOpen} size="md">
      <ModalHeader onClose={onClose}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Cambiar rol del usuario</h3>
            <p className="text-sm text-zinc-400">
              {usuario.primerNombre} {usuario.primerApellido}
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        {error && <Alert variant="error" className="mb-4">{error}</Alert>}
        {success && <Alert variant="success" className="mb-4">{success}</Alert>}

        {loading ? (
          <div className="py-8">
            <Spinner center />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Rol actual
              </label>
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                {currentRole ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-100">{currentRole.rolescod}</p>
                      <p className="text-xs text-zinc-500">
                        {allRoles.find(r => r.rolescod === currentRole.rolescod)?.rolesdsc || 'Rol actual'}
                      </p>
                    </div>
                    <Badge variant={currentRole.roleuserest === "AC" ? "success" : "warning"}>
                      {currentRole.roleuserest === "AC" ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center">Sin rol asignado</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Seleccionar nuevo rol
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={submitting}
              >
                <option value="">-- Seleccione un rol --</option>
                {allRoles.map((r) => (
                  <option key={r.rolescod} value={r.rolescod}>
                    {r.rolesdsc} ({r.rolescod})
                  </option>
                ))}
              </select>
            </div>

            {selectedRole && selectedRole !== currentRole?.rolescod && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-400">
                  Se cambiará el rol de <strong>{currentRole?.rolescod || 'ninguno'}</strong> a{' '}
                  <strong>{selectedRole}</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSaveRole} 
          disabled={!selectedRole || selectedRole === currentRole?.rolescod || submitting}
          isLoading={submitting}
        >
          Guardar cambios
        </Button>
      </ModalFooter>
    </Modal>
  );
}
