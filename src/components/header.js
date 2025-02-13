import React from "react";
import { LogOut } from "lucide-react";
import logoCSAE from "../img/logo_csae.png"; // Adjust the path if needed
import "./header.css";

const Header = ({ userName, handleLogout }) => {
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
              onClick={handleLogout}
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
