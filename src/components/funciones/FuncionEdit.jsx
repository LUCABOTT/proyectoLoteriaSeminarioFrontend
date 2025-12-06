import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import funcionesService from "../../services/Usuarios/funcionesService";

export default function FuncionesModalEdit({ isOpen, onClose, funcion, onSaved }) {
  const [form, setForm] = useState({
    fncod: "",
    fndsc: "",
    fnest: "AC",
    fntyp: "PBL",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (funcion) setForm(funcion);
  }, [funcion]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function editar() {
    setLoading(true);
    setError(null);
    try {
      await funcionesService.editar(form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msj || "Error al editar");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-zinc-900 text-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Función</h2>

        {error && <Alert variant="error">{error}</Alert>}

        <div className="mb-2">
          <label className="block mb-1 font-medium">Código</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            name="fncod"
            value={form.fncod}
            onChange={handleChange}
            
          />
        </div>

        <div className="mb-2">
          <label className="block mb-1 font-medium">Descripción</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            name="fndsc"
            value={form.fndsc}
            onChange={handleChange}
            placeholder="Descripción"
          />
        </div>

        <div className="mb-2">
          <label className="block mb-1 font-medium">Estado</label>
          <select
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            name="fnest"
            value={form.fnest}
            onChange={handleChange}
          >
            <option value="AC">Activo</option>
            <option value="IN">Inactivo</option>
            <option value="BL">Bloqueado</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Tipo</label>
          <select
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            name="fntyp"
            value={form.fntyp}
            onChange={handleChange}
          >
            <option value="PBL">Público</option>
            <option value="ADM">Administrador</option>
            <option value="VND">Vendedor</option>
            <option value="AUD">Auditor</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" isLoading={loading} onClick={editar}>
            Actualizar
          </Button>
        </div>
      </div>
    </div>
  );
}