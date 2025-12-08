import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import GuestRoute from "./components/GuestRoute";
import RoleWarning from "./components/RoleWarning";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import ActivacionCuenta from "./pages/ActivacionCuenta";
import Dashboard from "./pages/Dashboard";
import RolesList from "./pages/roles/RolesList";
import RolesCreate from "./pages/roles/RolesCreate";
import RolesEdit from "./pages/roles/RolesEdit";
import RolesDelete from "./pages/roles/RolesDelete";
import RolesUsuariosList from "./pages/rolesusuarios/RolesUsuariosList";
import FuncionesList from "./pages/FuncionesList";
import FuncionesRolesList from "./pages/FuncionesRolesList";
import UsuariosList from "./pages/UsuariosList";
import GoogleCallback from "./pages/GoogleCallback";
import UploadAvatar from "./components/UploadAvatar"
import ImagenesUsuariosList from "./pages/ImagenesUsuariosList";
import ReactivarCuentaPage from "./pages/ReactivarCuentaPage";
import Restabecerontrasena from "./pages/OlvideContrasenaPage";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Lotteries from "./pages/Lotteries";
import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { useContext } from "react";

// NUEVAS PÁGINAS
import Sorteos from "./pages/sorteos";
import Juegos from "./pages/Juegos";
import MisTickets from "./pages/MisTickets";
import GestionarTickets from "./pages/GestionarTickets";

function HomeRedirect() {
  const { isAuthenticated, user } = useContext(AuthContext);
  
  if (!isAuthenticated) return <Home />;
  
  const userRoles = user?.roles || [];
  // Administradores van al panel de administración
  if (userRoles.includes('ADM')) {
    return <Navigate to="/admin/sorteos" replace />;
  }
  // Jugadores van al catálogo de loterías
  if (userRoles.includes('PBL') || userRoles.includes('USR')) {
    return <Navigate to="/lotteries" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
}

function AppContent() {
  const location = useLocation();
  const hideNavbarAndFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbarAndFooter && <Navbar />}
      <RoleWarning />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        <Route
          path="/confirmarCuenta"
          element={
            <GuestRoute>
              <ActivacionCuenta />
            </GuestRoute>
          }
        />

        {/* Catálogo de loterías - SOLO para jugadores (PBL/USR) */}
        <Route
          path="/lotteries"
          element={
            <RoleRoute allowedRoles={['PBL', 'USR']}>
              <Lotteries />
            </RoleRoute>
          }
        />
        <Route
          path="/sorteos"
          element={
            <RoleRoute allowedRoles={['PBL', 'USR']}>
              <Lotteries />
            </RoleRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Billetera - SOLO para jugadores (PBL/USR) */}
        <Route
          path="/wallet"
          element={
            <RoleRoute allowedRoles={['PBL', 'USR']}>
              <Wallet />
            </RoleRoute>
          }
        />
        <Route
          path="/billetera"
          element={
            <RoleRoute allowedRoles={['PBL', 'USR']}>
              <Wallet />
            </RoleRoute>
          }
        />

        {/* Rutas para usuarios PBL/USR (jugadores) */}
        <Route
          path="/mis-boletos"
          element={
            <RoleRoute allowedRoles={['PBL', 'USR']}>
              <MisTickets />
            </RoleRoute>
          }
        />

        {/* Rutas de administración - solo para ADM */}
        <Route
          path="/admin/sorteos"
          element={
            <RoleRoute allowedRoles={['ADM']}>
              <Sorteos />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/juegos"
          element={
            <RoleRoute allowedRoles={['ADM']}>
              <Juegos />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <RoleRoute allowedRoles={['ADM']}>
              <GestionarTickets />
            </RoleRoute>
          }
        />

        {/* Rutas de gestión de usuarios - solo para ADM */}
        <Route
          path="/roles"
          element={
            <RoleRoute allowedRoles={['ADM']}>
              <RolesList />
            </RoleRoute>
          }
        />
        <Route
          path="/roles/crear"
          element={
            <RoleRoute allowedRoles={['ADM']}>
              <RolesCreate />
            </RoleRoute>
          }
        />
        <Route
          path="/roles/editar/:id"
          element={
            <RoleRoute allowedRoles={['ADM']}>
              <RolesEdit />
            </RoleRoute>
          }
        />
        <Route
          path="/roles/eliminar/:id"
          element={
            <RoleRoute allowedRoles={['ADM']}>
              <RolesDelete />
            </RoleRoute>
          }
        />
        <Route
          path="/roles-usuarios"
          element={
            <RoleRoute allowedRoles={['ADM']}>
              <RolesUsuariosList />
            </RoleRoute>
          }
        />
        <Route
          path="/funciones"
          element={
            <RoleRoute allowedRoles={['ADM']}>
              <FuncionesList />
            </RoleRoute>
          }
        />
        <Route
          path="/funciones-roles"
          element={
            <RoleRoute allowedRoles={['ADM']}>
              <FuncionesRolesList />
            </RoleRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <RoleRoute allowedRoles={['ADM']}>
              <UsuariosList />
            </RoleRoute>
          }
        />
        <Route
          path="/imagenes-usuarios"
          element={
            <RoleRoute allowedRoles={['ADM']}>
              <ImagenesUsuariosList />
            </RoleRoute>
          }
        />
        <Route
          path="/subir-imagen"
          element={
            <PrivateRoute>
              <UploadAvatar />
            </PrivateRoute>
          }
        />
        <Route
          path="/reactivar-cuenta"
          element={
            <GuestRoute>
              <ReactivarCuentaPage />
            </GuestRoute>
          }
        />
        <Route
          path="/restablecer-contrasena"
          element={
            <GuestRoute>
              <Restabecerontrasena />
            </GuestRoute>
          }
        />
        <Route
          path="/auth/google/callback"
          element={
            <GuestRoute>
              <GoogleCallback />
            </GuestRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
