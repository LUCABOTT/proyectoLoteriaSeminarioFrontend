import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button, Input, Alert } from "./ui";

export default function UploadAvatar() {
  const { user, setUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (e) => {
  e.preventDefault();
  if (!file) return setError("Selecciona una imagen primero");

  setIsLoading(true);
  setError("");
  setSuccess("");

  try {
    const formData = new FormData();
    formData.append("url", file); // Multer espera "file"
    formData.append("usuarioId", user.id); // asegúrate que user.id exista

    const res = await fetch("http://localhost:3001/api/imagenesUsuarios/imagen", {
      method: "POST",
      body: formData,
      
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess("Imagen subida correctamente");
      setUser(prev => ({ ...prev, avatar: data.data.url }));
    } else {
      setError(data.error || data.mensaje || "Error al subir la imagen");
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-zinc-900 border border-zinc-800 rounded-md">
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <form onSubmit={handleUpload} className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          label="Selecciona tu foto de perfil"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          {isLoading ? "Subiendo..." : "Subir imagen"}
        </Button>
      </form>
    </div>
  );
}