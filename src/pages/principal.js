import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Info, MessageSquare, Award } from "lucide-react";
import Header from "../components/header"; // Import the Header component
import "./principal.css";

function Principal() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user ? user.nome : "Usuário";

  // Tools array with added 'link' property (currently set to "#" as a placeholder)
  const tools = [
    {
      title: "Processo de Enfermagem",
      description: "Acesse e gerencie os processos de enfermagem",
      icon: FileText,
      link: "/processo-de-enfermagem",
    },
    {
      title: "Protocolos Operacionais Padrão (POP's)",
      description: "Consulte os POPs atualizados",
      icon: FileText,
      link: "#",
    },
    {
      title: "Matriciamento de Feridas",
      description: "Gerencie casos e consulte orientações",
      icon: FileText,
      link: "#",
    },
    {
      title: "Protocolos de Enfermagem",
      description: "Acesse os protocolos vigentes",
      icon: FileText,
      link: "#",
    },
    {
      title: "Notícias",
      description: "Acompanhe as últimas atualizações",
      icon: Info,
      link: "#",
    },
    {
      title: "Sugestões",
      description: "Compartilhe suas ideias conosco",
      icon: MessageSquare,
      link: "#",
    },
    {
      title: "Sobre a CSAE",
      description: "Conheça nossa comissão",
      icon: Info,
      link: "#",
    },
    {
      title: "F.A.Q.",
      description: "Dúvidas frequentes",
      icon: MessageSquare,
      link: "#",
    },
  ];

  return (
    <div className="principal-container d-flex flex-column min-vh-100">
      {/* Header Component */}
      <Header userName={userName} handleLogout={() => navigate("/")} />

      {/* Navbar pode estar presente em um componente separado, se necessário */}

      {/* Main Content */}
      <main className="flex-fill">
        <div className="container my-4">
          {/* Disclaimer Section */}
          <div className="alert alert-light shadow-sm text-center mb-4">
            <Award size={32} className="text-success mb-2" />
            <h2 className="h5 text-success fw-bold">
              Agradecemos sua participação!
            </h2>
            <p className="text-muted mb-0">
              Obrigado por utilizar o Portal CSAE Floripa 2.0. Ajude-nos a
              melhorar compartilhando esta ferramenta com seus colegas
              enfermeiros. Sua opinião é muito importante - não deixe de
              participar da pesquisa de satisfação quando aparecer o aviso.
            </p>
          </div>

          {/* Bloco: Ferramentas Exclusivas para Administradores */}
          {user &&
            user.statusAcesso === "Liberado" &&
            user.tipoAcesso === "Administrador" && (
              <div className="admin-tools card mb-4">
                <div className="card-header">
                  <h5 className="text-success fw-bold">
                    Ferramentas Exclusivas para Administradores
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-around">
                    <button
                      className="btn btn-outline-success"
                      onClick={() => navigate("/gestao-usuarios")}
                    >
                      Gestão de Usuários
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate("/relatorios-uso")}
                    >
                      Relatórios de Uso
                    </button>
                  </div>
                </div>
              </div>
            )}

          {/* Tools Grid */}
          <div className="row g-4">
            {tools.map((tool) => (
              <div
                className="col-12 col-md-6 col-lg-3"
                key={tool.title}
                onClick={() => navigate(tool.link)}
                style={{ cursor: "pointer" }}
              >
                <div className="card shadow-sm h-100 tool-card">
                  <div className="card-body">
                    <tool.icon size={32} className="text-success mb-3" />
                    <h5 className="card-title text-success fw-bold">
                      {tool.title}
                    </h5>
                    <p className="card-text text-muted">{tool.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-top">
        <div className="container py-4">
          <div className="row row-cols-1 row-cols-md-3 g-4 footer-row">
            {/* Column 1 */}
            <div className="col">
              <h4 className="fw-bold text-success">Sobre</h4>
              <p className="text-muted small mb-0">
                © 2024 Comissão Permanente de Sistematização da Assistência de
                Enfermagem (CSAE). Todos os direitos reservados.
              </p>
            </div>

            {/* Column 2 */}
            <div className="col">
              <h4 className="fw-bold text-success">Documentos</h4>
              <ul className="list-unstyled mb-0">
                <li>
                  <a
                    href="#"
                    className="text-muted small text-decoration-none footer-link"
                  >
                    Termo de Responsabilidade
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted small text-decoration-none footer-link"
                  >
                    Políticas de Uso
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="col">
              <h4 className="fw-bold text-success">Redes Sociais</h4>
              <ul className="list-unstyled mb-0">
                <li>
                  <a
                    href="#"
                    className="text-muted small text-decoration-none footer-link"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted small text-decoration-none footer-link"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Principal;
