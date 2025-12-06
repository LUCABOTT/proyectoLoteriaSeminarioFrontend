import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import rolesService from "../../services/rolesService";

import RolesModalCreate from "./RolesCreate";
import RolesModalEdit from "./RolesEdit";
import RolesModalDelete from "./RolesDelete";

export default function RolesList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);

  async function cargarRoles() {
    setLoading(true);
    try {
      const { data } = await rolesService.listar();
      setRoles(data);
    } catch (error) {
      console.error("Error cargando roles:", error);
    }
    setLoading(false);
  }

  

  useEffect(() => {
    cargarRoles();
  }, []);

  return (
   <div className="p-10 flex flex-col h-screen">

  {/* Encabezado con título y botón */}
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-white">Gestión de Roles</h1>
    <Button
      variant="primary"
      onClick={() => setOpenCreate(true)}
      className="mt-10"
    >
      + Nuevo Rol
    </Button>
  </div>

  {/* Tabla */}
  {loading ? (
    <Spinner center />
  ) : (
    <div className="flex-1 overflow-auto"> {/* Permite scroll si la tabla es grande */}
      <table className="w-full border border-zinc-900 text-sm">
        <thead className="bg-zinc-900 text-white">
          <tr>
            <th className="p-3 text-left">Código</th>
            <th className="p-3 text-left">Descripción</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-black font-medium">
          {roles.map((r) => (
            <tr key={r.rolescod} className="border-t border-zinc-1000">
              <td className="p-3">{r.rolescod}</td>
              <td className="p-3">{r.rolesdsc}</td>
              <td className="p-3">
                <Badge
                  variant={
                    r.rolesest === "AC"
                      ? "success"
                      : r.rolesest === "IN"
                      ? "warning"
                      : "danger"
                  }
                >
                  {r.rolesest}
                </Badge>
              </td>
              <td className="p-3 text-center flex justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSelectedRole(r);
                    setOpenEdit(true);
                  }}
                >
                  Editar
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    setSelectedRole(r);
                    setOpenDelete(true);
                  }}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  {/* Modales */}
  <RolesModalCreate
    isOpen={openCreate}
    onClose={() => setOpenCreate(false)}
    onSaved={cargarRoles}
  />
  <RolesModalEdit
    isOpen={openEdit}
    onClose={() => setOpenEdit(false)}
    rol={selectedRole}
    onSaved={cargarRoles}
  />
  <RolesModalDelete
    isOpen={openDelete}
    onClose={() => setOpenDelete(false)}
    rol={selectedRole}
    onDeleted={cargarRoles}
  />
</div>
  );
}
