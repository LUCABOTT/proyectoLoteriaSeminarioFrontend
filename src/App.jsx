import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import GuestRoute from "./components/GuestRoute";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import ActivacionCuenta from "./pages/ActivacionCuenta";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Lotteries from "./pages/Lotteries";
import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { useContext } from "react";

function HomeRedirect() {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Navigate to="/sorteos" replace /> : <Home />;
}

function AppContent() {
  const location = useLocation();
  const hideNavbarAndFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbarAndFooter && <Navbar />}
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

        <Route
          path="/sorteos"
          element={
            <PrivateRoute>
              <Lotteries />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/billetera"
          element={
            <PrivateRoute>
              <Wallet />
            </PrivateRoute>
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
