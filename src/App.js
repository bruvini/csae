import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/cadastro";
import Login from "./pages/login";
import Principal from "./pages/principal";
import ProcessoEnfermagem from "./pages/processoEnfermagem";
import GestaoUsuarios from "./pages/gestaoUsuarios";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/inicio"
          element={
            <ProtectedRoute>
              <Principal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/processo-de-enfermagem"
          element={
            <ProtectedRoute>
              <ProcessoEnfermagem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestao-usuarios"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <GestaoUsuarios />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
