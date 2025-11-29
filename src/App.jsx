import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import PublicNavbar from "./components/PublicNavbar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ActivacionCuenta from "./pages/ActivacionCuenta";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

import "./App.css";

function AppContent() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      {isAuthenticated ? <Navbar /> : <PublicNavbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirmarCuenta" element={<ActivacionCuenta />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
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