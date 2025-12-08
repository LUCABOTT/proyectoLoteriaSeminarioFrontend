import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import rolesUsuariosService from "../../services/rolesUsuariosService";

import RolesUsuariosModalCreate from "./RolesUsuariosCreate";
import RolesUsuariosModalEdit from "./RolesUsuariosEdit";
import RolesUsuariosModalDelete from "./RolesUsuariosDelete";

export default function RolesUsuariosList() {
  const [rolesUsuarios, setRolesUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selected, setSelected] = useState(null);

  async function cargarRolesUsuarios() {
    setLoading(true);
    try {
      const { data } = await rolesUsuariosService.listar();
      setRolesUsuarios(data);
    } catch (error) {
      console.error("Error cargando roles de usuarios:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    cargarRolesUsuarios();
  }, []);

  return (
    <div className="p-10 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-white">Roles de Usuarios</h1>
        <Button variant="primary" className="mt-10"  onClick={() => setOpenCreate(true)}>+ Nuevo</Button>
      </div>

      {loading ? (
        <Spinner center />
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full border border-zinc-900 text-sm">
            <thead className="bg-zinc-900 text-white">
              <tr>
                <th className="p-3 text-left">Usuario</th>
                <th className="p-3 text-left">Rol</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-black font-medium">
              {rolesUsuarios.map((r) => (
                <tr key={`${r.usercod}-${r.rolescod}`} className="border-t border-zinc-1000">
                  <td className="p-3">{r.usercod}</td>
                  <td className="p-3">{r.rolescod}</td>
                  <td className="p-3">
                    <Badge
                      variant={
                        r.roleuserest === "AC" ? "success" :
                        r.roleuserest === "IN" ? "warning" : "danger"
                      }
                    >
                      {r.roleuserest}
                    </Badge>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => { setSelected(r); setOpenEdit(true); }}>
                      Editar
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => { setSelected(r); setOpenDelete(true); }}>
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
      <RolesUsuariosModalCreate
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onSaved={cargarRolesUsuarios}
      />
      <RolesUsuariosModalEdit
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        rolUsuario={selected}
        onSaved={cargarRolesUsuarios}
      />
      <RolesUsuariosModalDelete
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        rolUsuario={selected}
        onDeleted={cargarRolesUsuarios}
      />
    </div>
  );
}