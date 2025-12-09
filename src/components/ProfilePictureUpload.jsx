import { useState, useContext, useRef, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button, Alert } from "./ui";
import { Camera, Upload, X, Crop, User } from "lucide-react";
import Cropper from "react-easy-crop";

export default function ProfilePictureUpload({ currentImage, onImageUpdated }) {
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
      {/* Clickable Profile Image */}
      <div onClick={() => setShowModal(true)} className="relative group cursor-pointer">
        {currentImage ? (
          <img
            src={`${import.meta.env.VITE_API_URL}/api/imagenes/usuarios/${currentImage}`}
            alt="Foto de perfil"
            className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700 transition-all group-hover:border-zinc-400"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center transition-all group-hover:border-amber-400">
            <User className="w-8 h-8 text-zinc-500 group-hover:text-amber-400 transition-colors" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Success/Error notifications as toast */}
      {success && (
        <div className="fixed top-24 right-6 z-60 animate-in slide-in-from-right duration-300">
          <div className="bg-green-900/90 border border-green-500/50 px-6 py-4 text-sm text-white font-medium shadow-xl backdrop-blur-sm">
            {success}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showModal && !showCropper && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800/50 max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-zinc-100">Cambiar foto de perfil</h3>
              <button
                onClick={handleCancel}
                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 p-2 transition-all rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-6">
                <Alert variant="error">{error}</Alert>
              </div>
            )}

            <div className="space-y-6">
              {preview ? (
                <div className="relative group">
                  <div className="relative overflow-hidden border-2 border-zinc-800 shadow-lg">
                    <img src={preview} alt="Vista previa" className="w-full h-72 object-cover" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => {
                        setShowCropper(true);
                        setOriginalImage(preview);
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white p-2.5 shadow-lg transition-all rounded-sm"
                      title="Recortar"
                    >
                      <Crop className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white p-2.5 shadow-lg transition-all rounded-sm"
                      title="Eliminar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-700 p-16 text-center cursor-pointer hover:border-amber-400 hover:bg-zinc-900/50 transition-all group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center group-hover:bg-amber-400/10 transition-colors">
                    <Upload className="w-8 h-8 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <p className="text-zinc-300 mb-2 font-medium">Selecciona una imagen</p>
                  <p className="text-sm text-zinc-500">PNG, JPG o JPEG (máx. 5MB)</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex gap-3 pt-2">
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
                  {isLoading ? "Subiendo..." : "Guardar cambios"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800/50 max-w-3xl w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-zinc-100">Recortar imagen</h3>
              <button
                onClick={handleCropCancel}
                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 p-2 transition-all rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-96 bg-zinc-950 overflow-hidden mb-6 border border-zinc-800">
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
