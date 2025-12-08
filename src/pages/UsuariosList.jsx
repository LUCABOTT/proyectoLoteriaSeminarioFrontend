import { useState, useEffect } from "react";
import { Button, Badge, Spinner, Card, CardBody, Input, Alert } from "../components/ui";
import { User, Plus, Edit2, Trash2, Search, RefreshCw, Mail, Phone, Calendar, Shield } from "lucide-react";
import usuariosService from "../services/Usuarios/usuariosService";
import UsuarioModalCreate from "../components/Usuarios/UsuarioCreate";
import UsuarioModalEdit from "../components/Usuarios/UsuarioEdit";
import UsuarioModalDelete from "../components/Usuarios/UsuarioDelete";
import UsuarioManageRoles from "../components/Usuarios/UsuarioManageRoles";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openManageRoles, setOpenManageRoles] = useState(false);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarUsuarios();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return d.toLocaleDateString("es-HN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredUsuarios = usuarios.filter((u) => {
    const searchLower = searchTerm.toLowerCase();
    const nombreCompleto = `${u.primerNombre || ""} ${u.segundoNombre || ""} ${u.primerApellido || ""} ${
      u.segundoApellido || ""
    }`.toLowerCase();
    const email = (u.useremail || "").toLowerCase();
    return nombreCompleto.includes(searchLower) || email.includes(searchLower);
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
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">Gestión de usuarios</h1>
            <p className="text-zinc-400">Administra los usuarios del sistema</p>
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
              Nuevo usuario
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <Badge variant="default">Total</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">{usuarios.length}</div>
            <div className="text-sm text-zinc-500">Usuarios registrados</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-green-400" />
              </div>
              <Badge variant="success">Activos</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">
              {usuarios.filter((u) => u.userest === "AC").length}
            </div>
            <div className="text-sm text-zinc-500">Cuentas activas</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-yellow-400" />
              </div>
              <Badge variant="warning">Inactivos</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">
              {usuarios.filter((u) => u.userest === "IN").length}
            </div>
            <div className="text-sm text-zinc-500">Cuentas inactivas</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-red-400" />
              </div>
              <Badge variant="danger">Bloqueados</Badge>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-1">
              {usuarios.filter((u) => u.userest === "BL").length}
            </div>
            <div className="text-sm text-zinc-500">Cuentas bloqueadas</div>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-zinc-500" size={20} />
            <Input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Usuario</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Contacto</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Rol</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Fecha ingreso</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Estado</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-zinc-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map((u, index) => (
                  <tr
                    key={u.id}
                    className={`border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors ${
                      index % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/30"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-zinc-100">{u.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                          <User className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-100">
                            {`${u.primerNombre || ""} ${u.segundoNombre || ""} ${u.primerApellido || ""} ${
                              u.segundoApellido || ""
                            }`.trim()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <Mail className="w-3 h-3" />
                          <span>{u.useremail}</span>
                        </div>
                        {u.telefonosusuarios?.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <Phone className="w-3 h-3" />
                            <span>{u.telefonosusuarios.map((t) => t.numero).join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {u.roles?.length > 0 ? (
                          u.roles.map((r) => (
                            <Badge key={r.rolescod} variant="default" className="text-xs">
                              {r.rolesdsc}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-zinc-500">Sin rol</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Calendar className="w-4 h-4" />
                        {formatDate(u.userfching)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={u.userest === "AC" ? "success" : u.userest === "IN" ? "warning" : "danger"}>
                        {u.userest === "AC" ? "Activo" : u.userest === "IN" ? "Inactivo" : "Bloqueado"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUsuario(u);
                            setOpenManageRoles(true);
                          }}
                          className="p-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded transition"
                          title="Gestionar roles"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUsuario(u);
                            setOpenEdit(true);
                          }}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUsuario(u);
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

            {filteredUsuarios.length === 0 && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 mb-2">No se encontraron usuarios</p>
                <p className="text-sm text-zinc-600">
                  {searchTerm ? "Intenta con otro término de búsqueda" : "Crea tu primer usuario"}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Modales */}
        <UsuarioModalCreate isOpen={openCreate} onClose={() => setOpenCreate(false)} onSaved={cargarUsuarios} />
        <UsuarioModalEdit
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          usuario={selectedUsuario}
          onSaved={cargarUsuarios}
        />
        <UsuarioModalDelete
          isOpen={openDelete}
          onClose={() => setOpenDelete(false)}
          usuario={selectedUsuario}
          onDeleted={cargarUsuarios}
        />
        <UsuarioManageRoles
          isOpen={openManageRoles}
          onClose={() => setOpenManageRoles(false)}
          usuario={selectedUsuario}
          onSaved={cargarUsuarios}
        />
      </div>
    </div>
  );
}
