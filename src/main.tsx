import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Cadastro from "./pages/cadastro/cadastro";
import { createRoot } from "react-dom/client";
import "./global.css";
import { Toaster } from "react-hot-toast";
import SobreSite from "./pages/menuSuperior/sobreSite";
import InformacoesPessoais from "./pages/menuSuperior/informacoesPessoais";
import SegurancaSenha from "./pages/menuSuperior/segurancaSenha";
import PublicacoesPage from "./pages/feed";
import ProtectedRoute from "./utils/ProtectedRoute";
import AnimalsPage from "./pages/animais/animais";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/animals" element={<AnimalsPage />} />
        <Route path="/register" element={<Cadastro />} />
        <Route
          path="/sobre"
          element={
            <ProtectedRoute>
              <SobreSite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/informacoesPessoais"
          element={
            <ProtectedRoute>
              <InformacoesPessoais />
            </ProtectedRoute>
          }
        />
        <Route
          path="/segurancaSenha"
          element={
            <ProtectedRoute>
              <SegurancaSenha />
            </ProtectedRoute>
          }
        />
        <Route
          path="/publicacoes"
          element={
            <ProtectedRoute>
              <PublicacoesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
