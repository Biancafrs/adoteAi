import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Cadastro from "./pages/cadastro/cadastro";
import { createRoot } from "react-dom/client";
import "./global.css";
import { Toaster } from "react-hot-toast";
import SobreSite from "./pages/menuSuperior/sobreSite.tsx";
import InformacoesPessoais from "./pages/menuSuperior/informacoesPessoais.tsx";
import SegurancaSenha from "./pages/menuSuperior/segurancaSenha.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Cadastro />} />
        <Route path="/sobre" element={<SobreSite />} />
        <Route path="/informacoesPessoais" element={<InformacoesPessoais />} />
        <Route path="/segurancaSenha" element={<SegurancaSenha />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
