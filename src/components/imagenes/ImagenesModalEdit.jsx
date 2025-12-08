import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import imagenesUsuariosService from "../../services/Usuarios/imagenesUsuariosService";

export default function ImagenesModalEdit({ isOpen, onClose, imagen, onSaved }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFile(null);
    setError(null);
  }, [imagen]);

  const handleUpdate = async () => {
    if (!imagen) return setError("Selecciona una imagen primero");
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (file) formData.append("url", file);
      formData.append("id", imagen.id);
      formData.append("usuarioId", imagen.usuarioId);

      await imagenesUsuariosService.editar(formData);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msj || "Error al actualizar imagen");
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>Editar Imagen</ModalHeader>
      <ModalBody>
        {error && <Alert variant="error">{error}</Alert>}
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <p className="mt-2 text-white">Usuario ID: {imagen?.usuarioId}</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" isLoading={loading} onClick={handleUpdate}>Actualizar</Button>
      </ModalFooter>
    </Modal>
  );
}