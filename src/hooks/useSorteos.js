import { useState, useEffect } from 'react';
import { sorteoService } from '../services/sorteoService';
import { juegoService } from '../services/juegoService';

export const useSorteos = () => {
  const [sorteos, setSorteos] = useState([]);
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');

  // Cargar sorteos y juegos
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('useSorteos.cargarDatos - Iniciando carga...');
      const [sorteosData, juegosData] = await Promise.all([
        sorteoService.getAllSorteos(),
        juegoService.getAllJuegos()
      ]);

      console.log('useSorteos.cargarDatos - Sorteos recibidos:', sorteosData);
      console.log('useSorteos.cargarDatos - Juegos recibidos:', juegosData);

      // Manejo de sorteos
      if (Array.isArray(sorteosData)) {
        setSorteos(sorteosData);
      } else if (sorteosData && typeof sorteosData === 'object') {
        const sorteosList = sorteosData.data || sorteosData.sorteos || [];
        setSorteos(Array.isArray(sorteosList) ? sorteosList : []);
      } else {
        setSorteos([]);
      }

      // Manejo de juegos
      if (Array.isArray(juegosData)) {
        setJuegos(juegosData);
      } else if (juegosData && typeof juegosData === 'object') {
        const juegosList = juegosData.data || juegosData.juegos || [];
        setJuegos(Array.isArray(juegosList) ? juegosList : []);
      } else {
        setJuegos([]);
      }
    } catch (err) {
      console.error('useSorteos.cargarDatos - Error completo:', err);
      const mensaje = err.response?.data?.error || 
                     err.response?.data?.message || 
                     err.message || 
                     'Error al cargar datos';
      setError(mensaje);
      setSorteos([]);
      setJuegos([]);
    } finally {
      setLoading(false);
    }
  };

  // Crear sorteo
  const crearSorteo = async (data) => {
    try {
      console.log('useSorteos.crearSorteo - Iniciando con datos:', data);
      const nuevoSorteo = await sorteoService.createSorteo(data);
      console.log('useSorteos.crearSorteo - Sorteo creado:', nuevoSorteo);
      
      setSorteos([...sorteos, nuevoSorteo]);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('useSorteos.crearSorteo - Error:', err);
      
      let mensaje = 'Error al crear sorteo';
      
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

  // Editar sorteo
  const editarSorteo = async (id, data) => {
    try {
      console.log('useSorteos.editarSorteo - ID:', id, 'Datos:', data);
      
      const numId = parseInt(id, 10);
      if (isNaN(numId)) {
        return { success: false, error: 'ID de sorteo inválido' };
      }

      const actualizado = await sorteoService.updateSorteo(numId, data);
      console.log('useSorteos.editarSorteo - Respuesta:', actualizado);
      
      setSorteos(sorteos.map(s => s.Id === numId ? actualizado : s));
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('useSorteos.editarSorteo - Error:', err);
      
      let mensaje = 'Error al editar sorteo';
      
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

  // Eliminar sorteo
  const eliminarSorteo = async (id) => {
    try {
      console.log('useSorteos.eliminarSorteo - ID:', id);
      
      const numId = parseInt(id, 10);
      if (isNaN(numId)) {
        return { success: false, error: 'ID de sorteo inválido' };
      }

      await sorteoService.deleteSorteo(numId);
      console.log('useSorteos.eliminarSorteo - Sorteo eliminado');
      
      setSorteos(sorteos.filter(s => s.Id !== numId));
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('useSorteos.eliminarSorteo - Error:', err);
      
      let mensaje = 'Error al eliminar sorteo';
      
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

  // Filtrar sorteos
  const sorteosFiltrados = sorteos.filter(s => {
    if (!s) return false;
    
    const id = (s.Id || '').toString().includes(filtro);
    const juegoNombre = juegos
      .find(j => j.Id === s.IdJuego)?.Nombre || '';
    const nombre = juegoNombre.toLowerCase().includes(filtro.toLowerCase());
    const estado = (s.Estado || '').toLowerCase().includes(filtro.toLowerCase());
    
    return id || nombre || estado;
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  return {
    sorteos: sorteosFiltrados,
    sorteosTodos: sorteos,
    juegos,
    loading,
    error,
    filtro,
    setFiltro,
    crearSorteo,
    editarSorteo,
    eliminarSorteo,
    recargar: cargarDatos
  };
};