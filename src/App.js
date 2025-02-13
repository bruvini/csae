import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/cadastro";
import Login from "./pages/login";
import Principal from "./pages/principal";
import ProcessoEnfermagem from "./pages/processoEnfermagem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/" element={<Principal />} />
        <Route path="/processo-de-enfermagem" element={<ProcessoEnfermagem />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
