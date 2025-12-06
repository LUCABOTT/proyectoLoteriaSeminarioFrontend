import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import rolesService from "../../services/rolesService";
import { useState } from "react";

export default function RolesModalDelete({ isOpen, onClose, rol, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      await rolesService.eliminar({ rolescod: rol.rolescod }); // <- aquí solo enviamos rolescod
      onDeleted();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msj || "Error al eliminar");
    }
    setLoading(false);
  }

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader onClose={onClose} className="text-white">Eliminar Rol</ModalHeader>

      <ModalBody>
        {error && <Alert variant="error">{error}</Alert>}
        <p className="text-white">¿Estás seguro de eliminar el rol <strong>{rol?.rolescod}</strong>?</p>
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="danger" isLoading={loading} onClick={handleDelete}>Eliminar</Button>
      </ModalFooter>
    </Modal>
  );
}