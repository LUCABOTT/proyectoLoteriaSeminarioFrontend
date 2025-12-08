import apiClient from './apiClient';

export const dashboardService = {
  // Obtener estadísticas generales para admin
  async getAdminStats() {
    try {
      const response = await apiClient.get('/api/dashboard/admin/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas admin:', error);
      throw error;
    }
  },

  // Obtener estadísticas mensuales
  async getMonthlyStats() {
    try {
      const response = await apiClient.get('/api/dashboard/admin/estadisticas-mensuales');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas mensuales:', error);
      throw error;
    }
  }
};

export default dashboardService;
