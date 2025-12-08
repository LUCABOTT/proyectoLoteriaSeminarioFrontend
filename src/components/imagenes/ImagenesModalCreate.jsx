import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import imagenesUsuariosService from "../../services/Usuarios/imagenesUsuariosService";

export default function ImagenesModalCreate({ isOpen, onClose, usuarioId, onSaved }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return setError("Selecciona una imagen primero");
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("url", file);
      formData.append("usuarioId", usuarioId);

      await imagenesUsuariosService.crear(formData);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msj || "Error al subir imagen");
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>Subir Imagen</ModalHeader>
      <ModalBody>
        {error && <Alert variant="error">{error}</Alert>}
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" isLoading={loading} onClick={handleUpload}>Subir</Button>
      </ModalFooter>
    </Modal>
  );
}