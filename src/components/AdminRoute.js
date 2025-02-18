import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return <Navigate to="/" replace />;
  }
  const user = JSON.parse(storedUser);
  if (user.tipoAcesso !== "Administrador") {
    // Se o usuário não for administrador, redirecione para a página inicial
    return <Navigate to="/inicio" replace />;
  }
  return children;
};

export default AdminRoute;
