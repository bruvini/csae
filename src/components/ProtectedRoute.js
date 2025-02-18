import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    // Opcional: você pode exibir um toast ou mensagem de aviso antes de redirecionar
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
