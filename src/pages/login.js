import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoCSAE from "../img/logo_csae.png"; // Adjust path if needed
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simula um atraso no login
    setTimeout(() => {
      setIsLoading(false);
      alert("Autenticação pendente: Sistema em desenvolvimento. Em breve você poderá acessar.");
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="row w-100 justify-content-center">
        {/* Left Section - Formulário de Login */}
        <div className="col-md-3 fade-in mb-4 mb-md-0">
          <div className="login-card">
            <h2 className="mb-3 titulo">Bem-vindo(a) de volta</h2>
            <p className="mb-4 subtitulo">
              Entre com suas credenciais para acessar o portal
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-custom w-100"
                disabled={isLoading}
              >
                {isLoading ? "Acessando..." : "Acessar"}
              </button>
              <div className="mt-3 text-center">
                <a href="#" className="link-green me-3">
                  Esqueci a Senha
                </a>
                <a
                  href="/cadastro"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/cadastro");
                  }}
                  className="link-green"
                >
                  Fazer meu Cadastro
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Right Section - Mensagem de Boas-Vindas */}
        <div className="col-md-7 fade-in">
          <div className="login-card">
            <div className="text-center mb-3">
              <img src={logoCSAE} alt="Logo CSAE" className="logo-csae" />
            </div>
            <h1 className="mb-3 titulo">
              Portal CSAE Floripa 2.0 <br />
              Uma nova era para a enfermagem em Florianópolis
            </h1>
            <p className="mb-4 subtitulo">
              Ouvimos você! Nosso portal foi completamente reformulado para atender melhor às suas
              necessidades. Uma plataforma mais intuitiva, moderna e eficiente para apoiar seu
              trabalho diário.
            </p>
            <ul className="list-unstyled">
              <li className="mb-2">
                <span className="me-2 checkmark">✓</span>
                Interface moderna e intuitiva para facilitar seu dia a dia
              </li>
              <li className="mb-2">
                <span className="me-2 checkmark">✓</span>
                Funcionalidades desenvolvidas com base no seu feedback
              </li>
              <li className="mb-2">
                <span className="me-2 checkmark">✓</span>
                Suporte contínuo para uma experiência sem complicações
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Minimalist Footer */}
      <footer className="login-footer text-center mt-4">
        Direitos reservados à{" "}
        <a
          href="https://www.pmf.sc.gov.br/arquivos/arquivos/pdf/05_08_2015_14.01.47.1db139dd6a2842c9796b6345c54e03e8.pdf"
          target="_blank"
          rel="noreferrer"
          className="link-green"
        >
          Comissão Permanente de Sistematização da Assistência de Enfermagem (CSAE)
        </a>
        . Siga-nos no Instagram:{" "}
        <a
          href="https://instagram.com/enfermagemfloripa"
          target="_blank"
          rel="noreferrer"
          className="link-green"
        >
          @enfermagemfloripa
        </a>
      </footer>
    </div>
  );
}

export default Login;
