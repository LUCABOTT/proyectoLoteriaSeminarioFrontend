import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import rolesUsuariosService from "../../services/rolesUsuariosService";

export default function RolesUsuariosModalCreate({ isOpen, onClose, onSaved }) {
  const [form, setForm] = useState({ usercod: "", rolescod: "", roleuserest: "AC" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      await rolesUsuariosService.crear(form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msj || "Error al crear");
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader onClose={onClose}>Asignar Rol a Usuario</ModalHeader>
      <ModalBody>
        {error && <Alert variant="error">{error}</Alert>}
        <Input label="Usuario" name="usercod" value={form.usercod} onChange={handleChange} />
        <Input label="Rol" name="rolescod" value={form.rolescod} onChange={handleChange} />
        <div className="mt-4">
          <label className="block mb-1 font-medium text-white">Estado</label>
          <select name="roleuserest" value={form.roleuserest} onChange={handleChange} className="w-full p-2 border border-gray-600 rounded bg-zinc-800 text-white">
            <option value="AC">AC</option>
            <option value="IN">IN</option>
            <option value="BL">BL</option>
          </select>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" isLoading={loading} onClick={handleCreate}>Guardar</Button>
      </ModalFooter>
    </Modal>
  );
}
