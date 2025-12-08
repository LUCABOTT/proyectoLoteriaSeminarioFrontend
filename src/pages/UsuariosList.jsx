import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import usuariosService from "../services/Usuarios/usuariosService";

import UsuarioModalCreate from "../components/Usuarios/UsuarioCreate";
import UsuarioModalEdit from "../components/Usuarios/UsuarioEdit";
import UsuarioModalDelete from "../components/Usuarios/UsuarioDelete";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedUsuario, setSelectedUsuario] = useState(null);

  async function cargarUsuarios() {
    setLoading(true);
    try {
      const res = await usuariosService.listar();
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return d.toLocaleDateString("es-HN");
  };

  if (loading) return <Spinner center />;

  return (
    <div className="p-10 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-white">Usuarios</h1>
        <Button className="mt-10" variant="primary" onClick={() => setOpenCreate(true)}>+ Nuevo Usuario</Button>
      </div>

      <table className="w-full border border-zinc-900 text-sm">
        <thead className="bg-zinc-900 text-white">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre Completo</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Teléfono</th>
            <th className="p-3 text-left">Roles</th>
            <th className="p-3 text-left">Fecha Ingreso</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody className="text-black font-medium">
          {usuarios.map(u => (
            <tr key={u.id} className="border-t border-zinc-1000">
              <td className="p-3">{u.id}</td>
              <td className="p-3">{`${u.primerNombre || ''} ${u.segundoNombre || ''} ${u.primerApellido || ''} ${u.segundoApellido || ''}`}</td>
              <td className="p-3">{u.useremail}</td>

              <td className="p-3">
              {u.telefonosusuarios?.length > 0
                ? u.telefonosusuarios.map(t => t.numero).join(", ")
                : "—"}
            </td>

              <td className="p-3">
                {u.Roles?.length > 0
                  ? u.Roles.map(r => (
                      <Badge key={r.rolescod} variant="default" className="mr-1">
                        {r.rolesdsc}
                      </Badge>
                    ))
                  : "—"}
              </td>

              <td className="p-3">{formatDate(u.userfching)}</td>

              <td className="p-3">
                <Badge variant={u.userest === "AC" ? "success" : u.userest === "IN" ? "warning" : "danger"}>
                  {u.userest}
                </Badge>
              </td>

              <td className="p-3 flex justify-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => { setSelectedUsuario(u); setOpenEdit(true); }}>Editar</Button>
                <Button size="sm" variant="danger" onClick={() => { setSelectedUsuario(u); setOpenDelete(true); }}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modales */}
      <UsuarioModalCreate isOpen={openCreate} onClose={() => setOpenCreate(false)} onSaved={cargarUsuarios} />
      <UsuarioModalEdit isOpen={openEdit} onClose={() => setOpenEdit(false)} usuario={selectedUsuario} onSaved={cargarUsuarios} />
      <UsuarioModalDelete isOpen={openDelete} onClose={() => setOpenDelete(false)} usuario={selectedUsuario} onDeleted={cargarUsuarios} />
    </div>
  );
}