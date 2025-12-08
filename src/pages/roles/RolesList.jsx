import { useEffect, useState } from "react";
import { Button, Badge, Spinner, Card, Input } from "../../components/ui";
import { Shield, Plus, Edit2, Trash2, Search, RefreshCw } from "lucide-react";
import rolesService from "../../services/rolesService";
import RolesModalCreate from "./RolesCreate";
import RolesModalEdit from "./RolesEdit";
import RolesModalDelete from "./RolesDelete";

export default function RolesList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarRoles();
    setRefreshing(false);
  };

  const filteredRoles = roles.filter((r) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (r.rolescod || "").toLowerCase().includes(searchLower) || (r.rolesdsc || "").toLowerCase().includes(searchLower)
    );
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
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">Gestión de roles</h1>
            <p className="text-zinc-400">Administra los roles del sistema</p>
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
              Nuevo rol
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <Badge variant="default">Total</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{roles.length}</div>
            <div className="text-sm text-zinc-500">Roles registrados</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <Badge variant="success">Activos</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">
              {roles.filter((r) => r.rolesest === "AC").length}
            </div>
            <div className="text-sm text-zinc-500">Roles activos</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <Badge variant="warning">Inactivos</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">
              {roles.filter((r) => r.rolesest === "IN").length}
            </div>
            <div className="text-sm text-zinc-500">Roles inactivos</div>
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

        {/* Roles Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Código</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Descripción</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Estado</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-zinc-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((r, index) => (
                  <tr
                    key={r.rolescod}
                    className={`border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors ${
                      index % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/30"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-amber-400" />
                        </div>
                        <span className="text-sm font-semibold text-zinc-100">{r.rolescod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{r.rolesdsc}</td>
                    <td className="px-6 py-4">
                      <Badge variant={r.rolesest === "AC" ? "success" : r.rolesest === "IN" ? "warning" : "danger"}>
                        {r.rolesest === "AC" ? "Activo" : r.rolesest === "IN" ? "Inactivo" : "Bloqueado"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedRole(r);
                            setOpenEdit(true);
                          }}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRole(r);
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

            {filteredRoles.length === 0 && (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 mb-2">No se encontraron roles</p>
                <p className="text-sm text-zinc-600">
                  {searchTerm ? "Intenta con otro término de búsqueda" : "Crea tu primer rol"}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Modales */}
        <RolesModalCreate isOpen={openCreate} onClose={() => setOpenCreate(false)} onSaved={cargarRoles} />
        <RolesModalEdit isOpen={openEdit} onClose={() => setOpenEdit(false)} rol={selectedRole} onSaved={cargarRoles} />
        <RolesModalDelete
          isOpen={openDelete}
          onClose={() => setOpenDelete(false)}
          rol={selectedRole}
          onDeleted={cargarRoles}
        />
      </div>
    </div>
  );
}
