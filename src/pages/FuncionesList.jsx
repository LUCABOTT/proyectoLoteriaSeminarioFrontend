import axios from "axios";

import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";

import funcionesService from "../services/Usuarios/funcionesService";

import FuncionesModalCreate from "../components/funciones/FuncionesCreate";
import FuncionesModalEdit from "../components/funciones/FuncionEdit";
import FuncionesModalDelete from "../components/funciones/FuncionesDelete";

export default function FuncionesList() {
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedFuncion, setSelectedFuncion] = useState(null);

async function cargarFunciones() {
  setLoading(true);
  try {
    const res = await funcionesService.listar();
    console.log("Respuesta API:", res);
    setFunciones(res.data || res);
  } catch (error) {
    console.error("Error cargando funciones:", error);
  } finally {
    setLoading(false); // Siempre se ejecuta, aunque haya error
  }
}

  useEffect(() => {
    cargarFunciones();
  }, []);

  return (
    <div className="p-10 flex flex-col h-screen">

      {/* Encabezado con título y botón */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Funciones</h1>
        <Button
          variant="primary"
          onClick={() => setOpenCreate(true)}
          className="mt-10"
        >
          + Nueva Función
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
                <th className="p-3 text-left">Código</th>
                <th className="p-3 text-left">Descripción</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-black font-medium">
              {funciones.map((f) => (
                <tr key={f.fncod} className="border-t border-zinc-1000">
                  <td className="p-3">{f.fncod}</td>
                  <td className="p-3">{f.fndsc}</td>
                  <td className="p-3">{f.fntyp}</td>

                  <td className="p-3">
                    <Badge
                      variant={
                        f.fnest === "AC"
                          ? "success"
                          : f.fnest === "IN"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {f.fnest}
                    </Badge>
                  </td>

                  <td className="p-3 text-center flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedFuncion(f);
                        setOpenEdit(true);
                      }}
                    >
                      Editar
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setSelectedFuncion(f);
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
      <FuncionesModalCreate
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onSaved={cargarFunciones}
      />

      <FuncionesModalEdit
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        funcion={selectedFuncion}
        onSaved={cargarFunciones}
      />

      <FuncionesModalDelete
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        funcion={selectedFuncion}
        onDeleted={cargarFunciones}
      />
    </div>
  );
}