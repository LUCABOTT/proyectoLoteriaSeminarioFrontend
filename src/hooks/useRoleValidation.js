import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para verificar y validar roles del usuario
 * Si el usuario no tiene roles en localStorage, hace logout automático
 */
export const useRoleValidation = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Verificar si el usuario tiene el campo roles
      if (!user.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
        console.warn('⚠️ Usuario sin roles válidos detectado. Haciendo logout...');
        console.warn('💡 Esto puede ocurrir si el localStorage tiene datos antiguos.');
        logout();
      }
    }
  }, [user, isAuthenticated, logout]);

  return {
    hasRole: (role) => {
      const userRoles = user?.roles || [];
      return userRoles.includes(role);
    },
    hasAnyRole: (roles) => {
      const userRoles = user?.roles || [];
      return roles.some(role => userRoles.includes(role));
    },
    roles: user?.roles || [],
    isAdmin: user?.roles?.includes('ADM') || false,
    isPlayer: user?.roles?.includes('PBL') || user?.roles?.includes('USR') || false,
  };
};

export default useRoleValidation;
