import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText } from "lucide-react";
import Header from "../components/header";
import NavbarHorizontal from "../components/navbarHorizontal";
import { Button } from "react-bootstrap";
import "./sobre.css";

// Importe as imagens ou use o caminho adequado para elas
import commissionPhoto from "../img/comissao.png";
import placeholder from "../img/comissao.png";

const SobrePortal = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const userName = storedUser ? JSON.parse(storedUser).nome : "Usuário";

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="sobre-container min-vh-100 d-flex flex-column">
      {/* Header */}
      <Header />

      {/* Navbar */}
      <NavbarHorizontal />

      {/* Main Content */}
      <main className="flex-fill container py-8 space-y-12">
        {/* Title Section */}
        <div className="title-section text-center mx-auto max-w-3xl">
          <h1 className="title text-success fw-bold mb-2">Nossa História</h1>
          <p className="subtitle text-muted">
            Conheça a trajetória da Comissão Permanente de Sistematização da
            Assistência de Enfermagem
            <br />e sua contribuição para a saúde e a Enfermagem de Florianópolis
          </p>
        </div>
      </main>
    </div>
  );
};

export default SobrePortal;
