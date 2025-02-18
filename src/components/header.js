import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import logoCSAE from "../img/logo_csae.png"; // Ajuste o caminho se necessário
import "./header.css";
import { getAuth, signOut } from "firebase/auth";

const Header = () => {
  const auth = getAuth();
  const [userName, setUserName] = useState("Usuário");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.nome) {
          setUserName(userData.nome);
        }
      } catch (error) {
        console.error("Erro ao parsear o usuário:", error);
      }
    }
  }, []);

  const onLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  return (
    <header className="bg-white border-bottom">
      <div className="container py-3">
        <div className="d-flex justify-content-between align-items-center">
          {/* Left side: Logo + Pulse dot + Title */}
          <div className="d-flex align-items-center">
            <img src={logoCSAE} alt="CSAE Logo" className="logo-csae me-2" />
            <div className="pulse-dot me-2"></div>
            <span className="h5 text-success fw-bold mb-0">
              Portal CSAE Floripa 2.0
            </span>
          </div>
          {/* Right side: User info + Logout */}
          <div className="d-flex align-items-center">
            <span className="text-secondary me-3">
              Bem-vindo(a), {userName}
            </span>
            <button
              className="btn btn-outline-success d-flex align-items-center btn-logout"
              onClick={onLogout}
            >
              <LogOut size={16} className="me-1" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
