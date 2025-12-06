import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import funcionesService from "../../services/Usuarios/funcionesService";

export default function FuncionesModalCreate({ isOpen, onClose, onSaved }) {
  const [form, setForm] = useState({
    fncod: "",
    fndsc: "",
    fnest: "AC",
    fntyp: "PBL",
  });

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function guardar() {
    try {
      await funcionesService.crear(form);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Error al crear:", err);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-zinc-900 text-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Nueva Función</h2>

        <Input
          name="fncod"
          label="Código"
          value={form.fncod}
          onChange={handleChange}
          className="mb-4"
        />

        <Input
          name="fndsc"
          label="Descripción"
          value={form.fndsc}
          onChange={handleChange}
          className="mb-4"
        />

        <div className="mb-4">
          <label className="block mb-1 font-medium">Estado</label>
          <select
            name="fnest"
            value={form.fnest}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded bg-zinc-800 text-white"
          >
            <option value="AC">AC</option>
            <option value="IN">IN</option>
            <option value="BL">BL</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Tipo</label>
          <select
            name="fntyp"
            value={form.fntyp}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded bg-zinc-800 text-white"
          >
            <option value="PBL">PBL</option>
            <option value="ADM">ADM</option>
            <option value="VND">VND</option>
            <option value="AUD">AUD</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="primary" onClick={guardar}>
            Guardar
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}