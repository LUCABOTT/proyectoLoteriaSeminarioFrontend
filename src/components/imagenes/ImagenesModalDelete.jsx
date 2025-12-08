import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import imagenesUsuariosService from "../../services/Usuarios/imagenesUsuariosService";

export default function ImagenesModalDelete({ isOpen, onClose, imagen, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!imagen) return setError("Selecciona una imagen primero");
    setLoading(true);
    setError(null);

    try {
      await imagenesUsuariosService.eliminar({ id: imagen.id });
      onDeleted();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msj || "Error al eliminar imagen");
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader onClose={onClose}>Eliminar Imagen</ModalHeader>
      <ModalBody>
        {error && <Alert variant="error">{error}</Alert>}
        <p>¿Deseas eliminar la imagen <strong>{imagen?.url}</strong>?</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="danger" isLoading={loading} onClick={handleDelete}>Eliminar</Button>
      </ModalFooter>
    </Modal>
  );
}