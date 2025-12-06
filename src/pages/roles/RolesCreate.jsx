import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import rolesService from "../../services/rolesService";

export default function RolesModalCreate({ isOpen, onClose, onSaved }) {
  const [form, setForm] = useState({
    rolescod: "",
    rolesdsc: "",
    rolesest: "AC",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    setLoading(true);
    setError(null);

    try {
      await rolesService.crear(form); // Llama al servicio para crear el rol
      onSaved(); // Ejecuta callback en el padre para recargar la lista
      onClose(); // Cierra el modal
    } catch (err) {
      setError(err.response?.data?.msj || "Error al guardar");
    }

    setLoading(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>Crear Rol</ModalHeader>

      <ModalBody>
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Código"
          name="rolescod"
          value={form.rolescod}
          onChange={handleChange}
          placeholder="Ej: COD001"
        />

        <Input
          className="mt-4"
          label="Descripción"
          name="rolesdsc"
          value={form.rolesdsc}
          onChange={handleChange}
          placeholder="Ej: Administrador"
        />

        <div className="mt-4">
  <label className="block mb-1 font-medium text-white">Estado</label>
  <select
    name="rolesest"
    value={form.rolesest}
    onChange={handleChange}
    className="w-full p-2 border border-gray-600 rounded bg-zinc-800 text-white"
  >
    <option value="AC">AC</option>
    <option value="IN">IN</option>
    <option value="BL">BL</option>
  </select>
</div>
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" isLoading={loading} onClick={handleSave}>
          Guardar
        </Button>
      </ModalFooter>
    </Modal>
  );
}