import React, { useState, useEffect } from "react";
import { Modal } from "../components/ui/Modal";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import imagenesUsuariosService from "../services/Usuarios/imagenesUsuariosService";
import ImagenesModalCreate from "../components/imagenes/ImagenesModalCreate";
import ImagenesModalEdit from "../components/imagenes/ImagenesModalEdit";
import ImagenesModalDelete from "../components/imagenes/ImagenesModalEdit";


export default function ImagenesUsuariosList({ usuarioId }) {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const cargarImagenes = async () => {
    setLoading(true);
    try {
      const { data } = await imagenesUsuariosService.listar();
      setImagenes(usuarioId ? data.filter(img => img.usuarioId === usuarioId) : data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { cargarImagenes(); }, []);

  return (
    <div className="p-10 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Imágenes de Usuarios</h1>
        <Button variant="primary" className="mt-10" onClick={() => setOpenCreate(true)}>+ Subir Imagen</Button>
      </div>

      {loading ? <Spinner center /> :
        <div className="flex-1 overflow-auto">
          <table className="w-full border border-zinc-900 text-sm">
            <thead className="bg-zinc-900 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Usuario ID</th>
                <th className="p-3 text-left">Imagen</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-black font-medium">
              {imagenes.map(img => (
                <tr key={img.id} className="border-t border-zinc-1000">
                  <td className="p-3">{img.id}</td>
                  <td className="p-3">{img.usuarioId}</td>
                  <td className="p-3">
                    <img src={`http://localhost:3001/img/usuarios/${img.url}`} alt="avatar" className="h-10 w-10 rounded-full"/>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => { setSelectedImage(img); setOpenEdit(true); }}>Editar</Button>
                    <Button size="sm" variant="danger" onClick={() => { setSelectedImage(img); setOpenDelete(true); }}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }

      <ImagenesModalCreate isOpen={openCreate} onClose={() => setOpenCreate(false)} usuarioId={usuarioId} onSaved={cargarImagenes}/>
      <ImagenesModalEdit isOpen={openEdit} onClose={() => setOpenEdit(false)} imagen={selectedImage} onSaved={cargarImagenes}/>
      <ImagenesModalDelete isOpen={openDelete} onClose={() => setOpenDelete(false)} imagen={selectedImage} onDeleted={cargarImagenes}/>
    </div>
  );
}