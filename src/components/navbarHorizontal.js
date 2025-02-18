import React from "react";
import { Link } from "react-router-dom";
import "./navbarHorizontal.css";

const NavbarHorizontal = ({ user }) => {
  if (!user) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  }
  
  return (
    <nav className="navbar-horizontal">
      <ul className="navbar-menu">
        <li>
          <Link to="/inicio">Início</Link>
        </li>
        <li>
          <Link to="/processo-de-enfermagem">Processo de Enfermagem</Link>
        </li>
        <li>
          <Link to="/pops">POP's</Link>
        </li>
        <li>
          <Link to="/feridas">Feridas</Link>
        </li>
        <li>
          <Link to="/protocolos-de-enfermagem">Protocolos de Enfermagem</Link>
        </li>
        <li>
          <Link to="/noticias">Notícias</Link>
        </li>
        <li>
          <Link to="/sugestoes">Sugestões</Link>
        </li>
        <li>
          <Link to="/sobre-csae">Sobre a CSAE</Link>
        </li>
        <li>
          <Link to="/faq">F.A.Q.</Link>
        </li>
        {user && user.statusAcesso === "Liberado" && user.tipoAcesso === "Administrador" && (
          <li>
            <Link to="/gestao-usuarios">Gestão de Usuários</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavbarHorizontal;
