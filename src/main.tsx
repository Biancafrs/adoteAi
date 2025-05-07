import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Cadastro from "./pages/cadastro/cadastro";
import { createRoot } from "react-dom/client";
import "./global.css";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
