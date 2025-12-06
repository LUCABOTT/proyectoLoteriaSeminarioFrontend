import { useState } from "react";
import { Button } from "../../components/ui/Button";
import usuariosService from "../../services/Usuarios/usuariosService";

export default function UsuarioModalCreate({ isOpen, onClose, onSaved }) {
  const [form, setForm] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    identidad: "",
    useremail: "",
    userpswd: "",
    userest: "IN",
    usertipo: "ADM",
    fechaNacimiento: "",
    telefonos: [{ numero: "" }] 
  });

  const [loading, setLoading] = useState(false);
  const [erroresBackend, setErroresBackend] = useState([]); // lista de errores express-validator
  const [errorGeneral, setErrorGeneral] = useState(""); // error msj general

  if (!isOpen) return null;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    setErroresBackend([]);
    setErrorGeneral("");

    try {
      await usuariosService.crear(form);

      onSaved(); // refresca tabla
      onClose(); // cierra modal
    } catch (err) {
      console.error("Error backend:", err);

      if (err.response?.data?.errores) {
        // ❌ Errores de express-validator
        setErroresBackend(err.response.data.errores);
      } else if (err.response?.data?.msj) {
        // ❌ Error general (correo repetido, etc.)
        setErrorGeneral(err.response.data.msj);
      } else {
        setErrorGeneral("Error al crear usuario");
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-zinc-900 text-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        
        <h2 className="text-xl font-bold mb-4">Crear Usuario</h2>

        {/* ✔ Mostrar error general */}
        {errorGeneral && (
          <p className="text-red-500 mb-2">{errorGeneral}</p>
        )}

        {/* ✔ Mostrar lista de errores express-validator */}
        {erroresBackend.length > 0 && (
          <div className="bg-red-500/20 border border-red-500 p-3 rounded mb-3">
            <ul className="text-red-400 text-sm list-disc ml-4">
              {erroresBackend.map((err, i) => (
                <li key={i}>
                  <span className="font-semibold">{err.atributo}:</span> {err.msj}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input name="primerNombre" placeholder="Primer Nombre" value={form.primerNombre} onChange={handleChange} className="p-2 rounded bg-zinc-800" />
          <input name="segundoNombre" placeholder="Segundo Nombre" value={form.segundoNombre} onChange={handleChange} className="p-2 rounded bg-zinc-800" />
          <input name="primerApellido" placeholder="Primer Apellido" value={form.primerApellido} onChange={handleChange} className="p-2 rounded bg-zinc-800" />
          <input name="segundoApellido" placeholder="Segundo Apellido" value={form.segundoApellido} onChange={handleChange} className="p-2 rounded bg-zinc-800" />
          <input name="identidad" placeholder="Identidad" value={form.identidad} onChange={handleChange} className="p-2 rounded bg-zinc-800" />
          <input name="useremail" placeholder="Email" type="email" value={form.useremail} onChange={handleChange} className="p-2 rounded bg-zinc-800" />
          <input name="userpswd" placeholder="Contraseña" type="password" value={form.userpswd} onChange={handleChange} className="p-2 rounded bg-zinc-800" />
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

      {/* Botón eliminar teléfono */}
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

  {/* Botón agregar teléfono */}
  <button
    type="button"
    onClick={agregarTelefono}
    className="mt-1 text-sm text-amber-400 hover:text-amber-300"
  >
    + Agregar otro teléfono
  </button>
</div>
          <input name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} className="p-2 rounded bg-zinc-800" />

          {/* Roles disponibles según backend */}
          <select name="usertipo" value={form.usertipo} onChange={handleChange} className="p-2 rounded bg-zinc-800">
            <option value="ADM">ADM </option>
            <option value="PBL">PBL </option>
            <option value="VND">VND </option>
            <option value="AUD">AUD (</option>
          </select>

          {/* Estado del usuario */}
          <select name="userest" value={form.userest} onChange={handleChange} className="p-2 rounded bg-zinc-800">
            <option value="IN">IN </option>
            <option value="AC">AC </option>
            <option value="BL">BL </option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </div>
  );
}