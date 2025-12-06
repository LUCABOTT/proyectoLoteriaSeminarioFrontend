import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import rolesService from "../../services/rolesService";

export default function RolesModalEdit({ isOpen, onClose, rol, onSaved }) {
  const [form, setForm] = useState({
    rolescod: "",
    rolesdsc: "",
    rolesest: "AC",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rol) {
      setForm(rol);
    }
  }, [rol]);

 function handleChange(e) {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
}

  async function handleEdit() {
    setLoading(true);
    setError(null);

    try {
      await rolesService.editar(form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msj || "Error al editar");
    }

    setLoading(false);
  }

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader onClose={onClose}>Editar Rol</ModalHeader>

      <ModalBody>
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Código (No editable)"
          value={form.rolescod}
          disabled
        />

        <Input
          className="mt-4"
          label="Descripción"
          name="rolesdsc"
          value={form.rolesdsc}
          onChange={handleChange}
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
        <Button variant="primary" isLoading={loading} onClick={handleEdit}>
          Actualizar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
