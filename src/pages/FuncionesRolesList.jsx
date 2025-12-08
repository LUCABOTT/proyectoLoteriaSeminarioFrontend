import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";

import funcionesRolesService from "../services/Usuarios/funcionesRolesService";

import FuncionesRolesModalCreate from "../components/FuncionesRoles/FuncionesRolesModalCreate";
import FuncionesRolesModalEdit from "../components/FuncionesRoles/FuncionesRolesModalEdit";
import FuncionesRolesModalDelete from "../components/FuncionesRoles/FuncionesRolesModalDelete";

export default function FuncionesRolesList() {
  const [relaciones, setRelaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedRelacion, setSelectedRelacion] = useState(null);

  async function cargarRelaciones() {
    setLoading(true);
    try {
      const res = await funcionesRolesService.listar();
      setRelaciones(res.data);
    } catch (error) {
      console.error("Error cargando funciones-roles:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    cargarRelaciones();
  }, []);

  return (
    <div className="p-10 flex flex-col h-screen">
      {/* Encabezado con botón */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Funciones por Rol</h1>
        <Button variant="primary" className="mt-10" onClick={() => setOpenCreate(true)}>
          + Nueva Relación
        </Button>
      </div>

      {/* Tabla */}
      {loading ? (
        <Spinner center />
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full border border-zinc-900 text-sm">
            <thead className="bg-zinc-900 text-white">
              <tr>
                <th className="p-3 text-left">Rol</th>
                <th className="p-3 text-left">Función</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Expira</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-black font-medium">
              {relaciones.map((r) => (
                <tr key={`${r.rolescod}-${r.fncod}`} className="border-t border-zinc-1000">
                  <td className="p-3">{r.rolescod}</td>
                  <td className="p-3">{r.fncod}</td>
                  <td className="p-3">
                    <Badge variant={r.fnrolest === "AC" ? "success" : r.fnrolest === "IN" ? "warning" : "danger"}>
                      {r.fnrolest}
                    </Badge>
                  </td>
                  <td className="p-3">{r.fnexp ? new Date(r.fnexp).toLocaleDateString() : "-"}</td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedRelacion(r);
                        setOpenEdit(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setSelectedRelacion(r);
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
      <FuncionesRolesModalCreate
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onSaved={cargarRelaciones}
      />

      <FuncionesRolesModalEdit
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        relacion={selectedRelacion}
        onSaved={cargarRelaciones}
      />

      <FuncionesRolesModalDelete
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        relacion={selectedRelacion}
        onDeleted={cargarRelaciones}
      />
    </div>
  );
}