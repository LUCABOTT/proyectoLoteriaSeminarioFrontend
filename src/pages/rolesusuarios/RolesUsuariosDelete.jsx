import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import rolesUsuariosService from "../../services/rolesUsuariosService";

export default function RolesUsuariosModalDelete({ isOpen, onClose, rolUsuario, onDeleted }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await rolesUsuariosService.eliminar({ usercod: rolUsuario.usercod, rolescod: rolUsuario.rolescod });
      onDeleted();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msj || "Error al eliminar");
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader onClose={onClose}>Eliminar Rol de Usuario</ModalHeader>
      <ModalBody>
        {error && <Alert variant="error">{error}</Alert>}
        <p className="text-white">¿Estás seguro de eliminar el rol <strong>{rolUsuario?.rolescod}</strong> del usuario <strong>{rolUsuario?.usercod}</strong>?</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="danger" isLoading={loading} onClick={handleDelete}>Eliminar</Button>
      </ModalFooter>
    </Modal>
  );
}
