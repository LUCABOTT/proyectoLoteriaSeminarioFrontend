import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import funcionesRolesService from "../../services/Usuarios/funcionesRolesService";

export default function FuncionesRolesModalEdit({ isOpen, onClose, relacion, onSaved }) {
  const [form, setForm] = useState({
    rolescod: "",
    fncod: "",
    fnrolest: "AC",
    fnexp: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (relacion) setForm(relacion);
  }, [relacion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  async function handleEdit() {
    setLoading(true);
    setError(null);
    try {
      await funcionesRolesService.editar(form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msj || "Error al editar");
    }
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader onClose={onClose}>Editar Función-Rol</ModalHeader>
      <ModalBody>
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Código del Rol"
          name="rolescod"
          value={form.rolescod}
          onChange={handleChange}
        />
        <Input
          label="Código de Función"
          name="fncod"
          value={form.fncod}
          onChange={handleChange}
        />

        <div className="mt-4">
          <label className="block mb-1 font-medium text-white">Estado</label>
          <select
            name="fnrolest"
            value={form.fnrolest || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded bg-zinc-800 text-white"
          >
            <option value="AC">AC</option>
            <option value="IN">IN</option>
            <option value="BL">BL</option>
          </select>
        </div>

        <Input
          label="Fecha Expiración"
          type="date"
          name="fnexp"
          value={form.fnexp || ""}
          onChange={handleChange}
          className="mt-4"
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" isLoading={loading} onClick={handleEdit}>Actualizar</Button>
      </ModalFooter>
    </Modal>
  );
}
