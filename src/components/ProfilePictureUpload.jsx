import { useState, useContext, useRef, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button, Alert } from "./ui";
import { Camera, Upload, X, Crop } from "lucide-react";
import Cropper from "react-easy-crop";

export default function ProfilePictureUpload({ onImageUpdated }) {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const fileInputRef = useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5000000) {
        setError("La imagen no debe superar 5MB");
        return;
      }
      const imageUrl = URL.createObjectURL(selectedFile);
      setOriginalImage(imageUrl);
      setFile(selectedFile);
      setShowCropper(true);
      setError("");
    }
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImg(originalImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], file.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
      setFile(croppedFile);
      setPreview(URL.createObjectURL(croppedBlob));
      setShowCropper(false);
    } catch (e) {
      console.error(e);
      setError("Error al recortar la imagen");
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setOriginalImage(null);
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Selecciona una imagen primero");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("url", file);
      formData.append("usuarioId", user.id);

      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/imagenesUsuarios/imagen`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Imagen actualizada correctamente");
        setShowModal(false);
        setFile(null);
        setPreview(null);
        if (onImageUpdated) {
          onImageUpdated(data.data.url);
        }
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || data.mensaje || "Error al subir la imagen");
      }
    } catch (err) {
      setError("Error de conexión: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    setOriginalImage(null);
    setShowModal(false);
    setShowCropper(false);
    setError("");
    setSuccess("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <>
      {success && (
        <div className="mb-4">
          <Alert variant="success">{success}</Alert>
        </div>
      )}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2"
      >
        <Camera className="w-4 h-4" />
        Cambiar foto
      </Button>

      {showModal && !showCropper && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-zinc-100">Cambiar foto de perfil</h3>
              <button
                onClick={handleCancel}
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4">
                <Alert variant="error">{error}</Alert>
              </div>
            )}

            <div className="space-y-4">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setShowCropper(true);
                      setOriginalImage(preview);
                    }}
                    className="absolute bottom-2 right-2 bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition-colors"
                  >
                    <Crop className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-700 rounded-lg p-12 text-center cursor-pointer hover:border-amber-400 transition-colors"
                >
                  <Upload className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                  <p className="text-zinc-400 mb-2">Click para seleccionar una imagen</p>
                  <p className="text-sm text-zinc-600">PNG, JPG o JPEG (máx. 5MB)</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={handleCancel} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  isLoading={isLoading}
                  disabled={!file || isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Subiendo..." : "Guardar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCropper && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-zinc-100">Recortar imagen</h3>
              <button
                onClick={handleCropCancel}
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-96 bg-zinc-950 rounded-lg overflow-hidden mb-4">
              <Cropper
                image={originalImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-zinc-400 mb-2">Zoom</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleCropCancel} className="flex-1">
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleCropConfirm} className="flex-1">
                Confirmar recorte
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
