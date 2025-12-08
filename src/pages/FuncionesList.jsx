import { useEffect, useState } from "react";
import { Button, Badge, Spinner, Card, Input } from "../components/ui";
import { Key, Plus, Edit2, Trash2, Search, RefreshCw } from "lucide-react";
import funcionesService from "../services/Usuarios/funcionesService";
import FuncionesModalCreate from "../components/funciones/FuncionesCreate";
import FuncionesModalEdit from "../components/funciones/FuncionEdit";
import FuncionesModalDelete from "../components/funciones/FuncionesDelete";

export default function FuncionesList() {
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedFuncion, setSelectedFuncion] = useState(null);

  async function cargarFunciones() {
    setLoading(true);
    try {
      const res = await funcionesService.listar();
      setFunciones(res.data || res);
    } catch (error) {
      console.error("Error cargando funciones:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarFunciones();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarFunciones();
    setRefreshing(false);
  };

  const filteredFunciones = funciones.filter((f) => {
    const searchLower = searchTerm.toLowerCase();
    return (f.fncod || "").toLowerCase().includes(searchLower) || (f.fndsc || "").toLowerCase().includes(searchLower);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 px-6 flex items-center justify-center">
        <Spinner center />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">Gestión de funciones</h1>
            <p className="text-zinc-400">Administra las funciones del sistema</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Button variant="primary" onClick={() => setOpenCreate(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva función
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Key className="w-6 h-6 text-blue-400" />
              </div>
              <Badge variant="default">Total</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{funciones.length}</div>
            <div className="text-sm text-zinc-500">Funciones registradas</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Key className="w-6 h-6 text-green-400" />
              </div>
              <Badge variant="success">Activas</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">
              {funciones.filter((f) => f.fnest === "AC").length}
            </div>
            <div className="text-sm text-zinc-500">Funciones activas</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Key className="w-6 h-6 text-purple-400" />
              </div>
              <Badge variant="default">PBL</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">
              {funciones.filter((f) => f.fntyp === "PBL").length}
            </div>
            <div className="text-sm text-zinc-500">Tipo público</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Key className="w-6 h-6 text-amber-400" />
              </div>
              <Badge variant="default">ADM</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">
              {funciones.filter((f) => f.fntyp === "ADM").length}
            </div>
            <div className="text-sm text-zinc-500">Tipo administrador</div>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-zinc-500" size={20} />
            <Input
              type="text"
              placeholder="Buscar por código o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Funciones Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Código</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Descripción</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Estado</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-zinc-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredFunciones.map((f, index) => (
                  <tr
                    key={f.fncod}
                    className={`border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors ${
                      index % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/30"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                          <Key className="w-5 h-5 text-amber-400" />
                        </div>
                        <span className="text-sm font-semibold text-zinc-100">{f.fncod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{f.fndsc}</td>
                    <td className="px-6 py-4">
                      <Badge variant="default">{f.fntyp}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={f.fnest === "AC" ? "success" : f.fnest === "IN" ? "warning" : "danger"}>
                        {f.fnest === "AC" ? "Activo" : f.fnest === "IN" ? "Inactivo" : "Bloqueado"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedFuncion(f);
                            setOpenEdit(true);
                          }}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFuncion(f);
                            setOpenDelete(true);
                          }}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredFunciones.length === 0 && (
              <div className="text-center py-12">
                <Key className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 mb-2">No se encontraron funciones</p>
                <p className="text-sm text-zinc-600">
                  {searchTerm ? "Intenta con otro término de búsqueda" : "Crea tu primera función"}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Modales */}
        <FuncionesModalCreate isOpen={openCreate} onClose={() => setOpenCreate(false)} onSaved={cargarFunciones} />
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
    </div>
  );
}
