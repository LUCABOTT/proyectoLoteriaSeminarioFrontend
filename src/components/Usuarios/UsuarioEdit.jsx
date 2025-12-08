import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import usuariosService from "../../services/Usuarios/usuariosService";

export default function UsuarioModalEdit({ isOpen, onClose, usuario, onSaved }) {
  const [form, setForm] = useState({
    telefonos: [{ numero: "" }],
    ...usuario,
    userpswd: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (usuario) {
      setForm({
        ...usuario,
        userpswd: "",
        telefonos: usuario.telefonosusuarios?.length
          ? usuario.telefonosusuarios.map(t => ({ numero: t.numero }))
          : [{ numero: "" }]
      });
    }
  }, [usuario]);

  if (!isOpen || !usuario) return null;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleTelefonoChange = (index, value) => {
    const nuevos = [...form.telefonos];
    nuevos[index].numero = value;
    setForm({ ...form, telefonos: nuevos });
  };

  const agregarTelefono = () => {
    setForm({ ...form, telefonos: [...form.telefonos, { numero: "" }] });
  };

  const eliminarTelefono = (i) => {
    const nuevos = form.telefonos.filter((_, index) => index !== i);
    setForm({ ...form, telefonos: nuevos });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const dataToSend = { ...form };

      // si la contraseña está vacía, no enviarla
      if (!dataToSend.userpswd) delete dataToSend.userpswd;

      await usuariosService.editar(dataToSend);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msj || "Error al actualizar usuario");
    }
    setLoading(false);
  };

const handleTelefonosSave = async () => {
  try {
    await usuariosService.editarTelefonos({
      idUsuario: usuario.id,      // id del usuario a editar
      telefonos: form.telefonos   // array de { numero }
    });
    onSaved(); // refresca la tabla de usuariosa
    onClose(); // cierra modal
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.msj || "Error al actualizar teléfonos");
  }
};



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div className="bg-zinc-900 text-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col">
    
    {/* Header */}
    <div className="p-6 border-b border-zinc-800">
      <h2 className="text-xl font-bold">Editar Usuario</h2>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>

    {/* Contenido scrollable */}
    <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-2">
      <input name="primerNombre" placeholder="Primer Nombre"
        value={form.primerNombre || ""} onChange={handleChange}
        className="p-2 rounded bg-zinc-800" />

      <input name="segundoNombre" placeholder="Segundo Nombre"
        value={form.segundoNombre || ""} onChange={handleChange}
        className="p-2 rounded bg-zinc-800" />

      <input name="primerApellido" placeholder="Primer Apellido"
        value={form.primerApellido || ""} onChange={handleChange}
        className="p-2 rounded bg-zinc-800" />

      <input name="segundoApellido" placeholder="Segundo Apellido"
        value={form.segundoApellido || ""} onChange={handleChange}
        className="p-2 rounded bg-zinc-800" />

      <input name="identidad" placeholder="Identidad"
        value={form.identidad || ""} onChange={handleChange}
        className="p-2 rounded bg-zinc-800" />

      <input name="useremail" placeholder="Email"
        type="email" value={form.useremail || ""} onChange={handleChange}
        className="p-2 rounded bg-zinc-800" />

      <input name="userpswd" placeholder="Nueva Contraseña (opcional)"
        type="password" value={form.userpswd || ""} onChange={handleChange}
        className="p-2 rounded bg-zinc-800" />

      {/* Teléfonos */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Teléfonos</label>
        {form.telefonos.map((tel, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="number"
              placeholder={`Teléfono #${i + 1}`}
              value={tel.numero}
              onChange={(e) => handleTelefonoChange(i, e.target.value)}
              className="p-2 rounded bg-zinc-800 flex-1"
            />
            {form.telefonos.length > 1 && (
              <button
                type="button"
                onClick={() => eliminarTelefono(i)}
                className="px-3 bg-red-600 hover:bg-red-700 rounded"
              >
                –
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={agregarTelefono}
          className="mt-1 text-sm text-amber-400 hover:text-amber-300"
        >
          + Agregar otro teléfono
        </button>
      </div>

      <input name="fechaNacimiento" type="date"
        value={form.fechaNacimiento ? form.fechaNacimiento.split("T")[0] : ""}
        onChange={handleChange} className="p-2 rounded bg-zinc-800" />

      <select name="usertipo" value={form.usertipo || "PBL"}
        onChange={handleChange} className="p-2 rounded bg-zinc-800">
        <option value="PBL">PBL</option>
        <option value="ADM">ADM</option>
        <option value="VND">VND</option>
        <option value="AUD">AUD</option>
      </select>

      <select name="userest" value={form.userest || "AC"}
        onChange={handleChange} className="p-2 rounded bg-zinc-800">
        <option value="AC">AC</option>
        <option value="IN">IN</option>
        <option value="BL">BL</option>
      </select>
    </div>

    {/* Footer fijo */}
    <div className="p-6 border-t border-zinc-800 flex justify-end gap-2">
      <Button variant="secondary" onClick={onClose}>Cancelar</Button>
      <Button variant="primary" onClick={handleSubmit} disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </Button>
      <Button variant="primary" onClick={handleTelefonosSave} disabled={loading}>
        {loading ? "Guardando..." : "Guardar Teléfonos"}
      </Button>
    </div>
  </div>
</div>
  );
}