// src/app-routes.js
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Foro from "./pages/Foro";
import Usuario from "./pages/Usuario";
import MainLayout from "./layout/MainLayout";
import CambiarPassword from "./pages/CambiarPassword"
import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Login y registro sin layout */}
      <Route path="/" element={<Login />} />
      <Route path="/registrarte" element={<Register />} />

      {/* Rutas principales con navbar */}
      <Route element={<MainLayout />}>
        <Route path="/foro" element={<ProtectedRoute> <Foro /> </ProtectedRoute>} />
        <Route path="/usuario" element={<ProtectedRoute> <Usuario /> </ProtectedRoute>} />
        <Route path="/CambiarPassword" element={<ProtectedRoute><CambiarPassword /></ProtectedRoute>} />
      </Route>

    </Routes>
  );
}