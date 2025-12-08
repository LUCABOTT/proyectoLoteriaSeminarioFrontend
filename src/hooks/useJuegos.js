import { useState, useEffect } from 'react';
import { juegoService } from '../services/juegoService';

export const useJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');

  // Cargar juegos
  const cargarJuegos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('useJuegos.cargarJuegos - Iniciando carga...');
      const data = await juegoService.getAllJuegos();
      console.log('useJuegos.cargarJuegos - Datos recibidos:', data);
      
      if (Array.isArray(data)) {
        setJuegos(data);
      } else if (data && typeof data === 'object') {
        // Si es un objeto con propiedad data
        const juegosList = data.data || data.juegos || [];
        setJuegos(Array.isArray(juegosList) ? juegosList : []);
      } else {
        setJuegos([]);
      }
    } catch (err) {
      console.error('useJuegos.cargarJuegos - Error completo:', err);
      const mensaje = err.response?.data?.error || 
                     err.response?.data?.message || 
                     err.message || 
                     'Error al cargar juegos';
      setError(mensaje);
      setJuegos([]);
    } finally {
      setLoading(false);
    }
  };

  // Crear juego
  const crearJuego = async (data) => {
    try {
      console.log('useJuegos.crearJuego - Iniciando con datos:', data);
      const nuevoJuego = await juegoService.createJuego(data);
      console.log('useJuegos.crearJuego - Juego creado:', nuevoJuego);
      
      setJuegos([...juegos, nuevoJuego]);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('useJuegos.crearJuego - Error:', err);
      
      let mensaje = 'Error al crear juego';
      
      // Si es array de errores de validación
      if (Array.isArray(err.response?.data)) {
        mensaje = err.response.data
          .map(e => e.msg || e.message || String(e))
          .join(', ');
      } else if (err.response?.data?.error) {
        mensaje = err.response.data.error;
      } else if (err.response?.data?.message) {
        mensaje = err.response.data.message;
      } else if (err.message) {
        mensaje = err.message;
      }
      
      return { success: false, error: mensaje };
    }
  };

  // Editar juego
  const editarJuego = async (id, data) => {
    try {
      console.log('useJuegos.editarJuego - ID:', id, 'Datos:', data);
      
      const numId = parseInt(id, 10);
      if (isNaN(numId)) {
        return { success: false, error: 'ID de juego inválido' };
      }

      const actualizado = await juegoService.updateJuego(numId, data);
      console.log('useJuegos.editarJuego - Respuesta:', actualizado);
      
      setJuegos(juegos.map(j => j.Id === numId ? actualizado : j));
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('useJuegos.editarJuego - Error:', err);
      
      let mensaje = 'Error al editar juego';
      
      // Si es array de errores de validación
      if (Array.isArray(err.response?.data)) {
        mensaje = err.response.data
          .map(e => e.msg || e.message || String(e))
          .join(', ');
      } else if (err.response?.data?.error) {
        mensaje = err.response.data.error;
      } else if (err.response?.data?.message) {
        mensaje = err.response.data.message;
      } else if (err.message) {
        mensaje = err.message;
      }
      
      return { success: false, error: mensaje };
    }
  };

  // Eliminar juego
  const eliminarJuego = async (id) => {
    try {
      console.log('useJuegos.eliminarJuego - ID:', id);
      
      const numId = parseInt(id, 10);
      if (isNaN(numId)) {
        return { success: false, error: 'ID de juego inválido' };
      }

      await juegoService.deleteJuego(numId);
      console.log('useJuegos.eliminarJuego - Juego eliminado');
      
      setJuegos(juegos.filter(j => j.Id !== numId));
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('useJuegos.eliminarJuego - Error:', err);
      
      let mensaje = 'Error al eliminar juego';
      
      // Si es array de errores de validación
      if (Array.isArray(err.response?.data)) {
        mensaje = err.response.data
          .map(e => e.msg || e.message || String(e))
          .join(', ');
      } else if (err.response?.data?.error) {
        mensaje = err.response.data.error;
      } else if (err.response?.data?.message) {
        mensaje = err.response.data.message;
      } else if (err.message) {
        mensaje = err.message;
      }
      
      return { success: false, error: mensaje };
    }
  };

  // Filtrar juegos por búsqueda
  const juegosFiltrados = juegos.filter(j => {
    if (!j) return false;
    
    const id = (j.Id || '').toString().includes(filtro);
    const nombre = (j.Nombre || '').toLowerCase().includes(filtro.toLowerCase());
    const descripcion = (j.Descripcion || '').toLowerCase().includes(filtro.toLowerCase());
    
    return id || nombre || descripcion;
  });

  useEffect(() => {
    cargarJuegos();
  }, []);

  return {
    juegos: juegosFiltrados,
    juegosTodos: juegos,
    loading,
    error,
    filtro,
    setFiltro,
    crearJuego,
    editarJuego,
    eliminarJuego,
    recargar: cargarJuegos
  };
};