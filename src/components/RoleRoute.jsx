import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const RoleRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const userRoles = user?.roles || [];
  const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

  if (!hasRequiredRole) {
    // Si el usuario es ADM y intenta acceder a ruta de jugador, va a admin
    if (userRoles.includes('ADM')) {
      return <Navigate to="/admin/sorteos" />;
    }
    // Si es jugador e intenta acceder a ruta de admin, va a lotteries
    if (userRoles.includes('PBL') || userRoles.includes('USR')) {
      return <Navigate to="/lotteries" />;
    }
    // Por defecto, dashboard
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default RoleRoute;
