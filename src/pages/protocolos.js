import React from "react";
import { useNavigate } from "react-router-dom";
import { Book, Calendar, MessageSquarePlus } from "lucide-react";
import Header from "../components/header";
import NavbarHorizontal from "../components/navbarHorizontal";
import "./protocolos.css";

// Importação das imagens dos volumes
import volume1 from "../img/volume1.png";
import volume2 from "../img/volume2.png";
import volume3 from "../img/volume3.png";
import volume4 from "../img/volume4.png";
import volume5 from "../img/volume5.png";
import volume6 from "../img/volume6.png";
import volume7 from "../img/volume7.png";
import volume8 from "../img/volume8.png";

const Protocolos = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const userName = storedUser ? JSON.parse(storedUser).nome : "Usuário";

  const protocols = [
    {
      id: "1",
      volume: 1,
      title:
        "Hipertensão, Diabetes e outros fatores associados a doenças cardiovasculares",
      publishDate: "05/08/2015",
      updateDate: "18/12/2020",
      imageUrl: volume1,
      pdfUrl: "http://www.pmf.sc.gov.br/arquivos/arquivos/PDF/PROTOCOLO%201%20SMS%20ATUALIZADO.pdf",
    },
    {
      id: "2",
      volume: 2,
      title:
        "Infecções Sexualmente Transmissíveis e outras doenças transmissíveis de interesse em saúde coletiva",
      publishDate: "19/04/2016",
      updateDate: "19/08/2024",
      imageUrl: volume2,
      pdfUrl: "https://www.pmf.sc.gov.br/arquivos/arquivos/pdf/09_01_2025_10.09.41.b870ea7dc7699a320b42908ed4a2441f.pdf",
    },
    {
      id: "3",
      volume: 3,
      title:
        "Saúde da mulher - Acolhimento às demandas da mulher nos diferentes ciclos de vida",
      publishDate: "28/11/2016",
      updateDate: "18/12/2020",
      imageUrl: volume3,
      pdfUrl: "http://www.pmf.sc.gov.br/arquivos/arquivos/PDF/PROTOCOLO%203%20SMS%20ATUALIZADO.pdf",
    },
    {
      id: "4",
      volume: 4,
      title: "Atendimento à Demanda Espontânea do Adulto",
      publishDate: "31/12/2016",
      updateDate: "18/12/2020",
      imageUrl: volume4,
      pdfUrl: "http://www.pmf.sc.gov.br/arquivos/arquivos/PDF/PROTOCOLO%204%20SMS%20ATUALIZADO.pdf",
    },
    {
      id: "5",
      volume: 5,
      title: "Atenção à Demanda de Cuidados na Criança",
      publishDate: "06/08/2018",
      updateDate: "02/01/2020",
      imageUrl: volume5,
      pdfUrl: "http://www.pmf.sc.gov.br/arquivos/arquivos/pdf/03_01_2020_13.15.01.635cbe799795679592ce20c2a1790a62.pdf",
    },
    {
      id: "6",
      volume: 6,
      title: "Cuidado à pessoa com ferida",
      publishDate: "19/06/2019",
      updateDate: "18/12/2020",
      imageUrl: volume6,
      pdfUrl: "http://www.pmf.sc.gov.br/arquivos/arquivos/PDF/PROTOCOLO%206%20SMS%20ATUALIZADO.pdf",
    },
    {
      id: "7",
      volume: 7,
      title:
        "Acolhimento com Classificação de Risco na atenção a demanda espontânea (adulto e infantil)",
      publishDate: "01/07/2023",
      updateDate: "01/09/2024",
      imageUrl: volume7,
      pdfUrl: "https://www.pmf.sc.gov.br/arquivos/arquivos/pdf/09_01_2025_10.16.59.7a1580f088cdb26f8a567190cf0139ef.pdf",
    },
    {
      id: "8",
      volume: 8,
      title:
        "Cuidado em Saúde Mental - Acolhimento e cuidado à pessoa em sofrimento psíquico e/ou em uso de álcool",
      publishDate: "01/01/2024",
      updateDate: "01/01/2024",
      imageUrl: volume8,
      pdfUrl: "https://www.pmf.sc.gov.br/arquivos/arquivos/pdf/06_01_2025_12.46.55.ee10dad49aed7a1880f1546629a114c3.pdf",
    },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  const openProtocol = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  const handleSuggestion = () => {
    console.log("Open suggestion form");
  };

  return (
    <div className="protocolos-container">
      <Header userName={userName} handleLogout={handleLogout} />
      <NavbarHorizontal />
      <main className="container my-4">
        {/* Title and Introduction */}
        <div className="intro-section mb-4">
          <h1 className="text-3xl font-bold text-success">
            Protocolos de Enfermagem
          </h1>
          <div className="card bg-light mb-3">
            <div className="card-body">
              <p className="text-muted">
                A Comissão Permanente para a Sistematização da Enfermagem possui três
                subcomissões: sistematização da assistência; protocolos; e perfil da
                enfermagem.
              </p>
              <p className="text-muted">
                A subcomissão de protocolos é responsável pela análise e revisão de
                protocolos vigentes, bem como a construção de novos protocolos de
                enfermagem, considerando a política de saúde vigente, as melhores
                evidências disponíveis e as possibilidades locais de organização da
                rede de atenção.
              </p>
              <p className="text-muted">
                Os protocolos serão disponibilizados nesta página conforme forem sendo
                construídos e validados.
              </p>
            </div>
          </div>
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-outline-success"
              onClick={handleSuggestion}
            >
              <MessageSquarePlus size={16} className="me-1" />
              Adicionar Sugestão aos Protocolos
            </button>
          </div>
        </div>

        {/* Protocols Grid */}
        <div className="protocols-grid row">
          {protocols.map((protocol) => (
            <div
              key={protocol.id}
              className="col-12 col-md-6 col-lg-3 mb-4"
              onClick={() => openProtocol(protocol.pdfUrl)}
              style={{ cursor: "pointer" }}
            >
              <div className="card h-100 shadow-sm protocolos-card">
                <div className="card-img-top position-relative">
                  <img
                    src={protocol.imageUrl}
                    alt={`Capa do Volume ${protocol.volume}`}
                    className="img-fluid"
                  />
                  <div className="position-absolute top-0 start-0 bg-success text-white px-2 py-1 rounded">
                    Volume {protocol.volume}
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{protocol.title}</h5>
                  <div className="small text-muted">
                    <div className="d-flex align-items-center mb-1">
                      <Book size={16} className="me-1" />
                      <span>Publicado em {protocol.publishDate}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <Calendar size={16} className="me-1" />
                      <span>Atualizado em {protocol.updateDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Protocolos;
