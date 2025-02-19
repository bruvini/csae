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
            <br />e sua contribuição para a saúde em Florianópolis
          </p>
        </div>

        {/* Timeline */}
        <div className="relative timeline">
          {/* Linha vertical central */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-success/20"></div>

          {/* Formação da Comissão */}
          <div className="formation-block time-block position-relative mb-4">
            {/* Ícone central */}
            <div className="formation-icon position-absolute top-0 start-50 translate-middle">
              <div className="icon-circle bg-success text-white d-flex align-items-center justify-content-center">
                <Calendar className="icon-size" />
              </div>
            </div>

            {/* Card */}
            <div className="card formation-card mx-auto shadow-sm border-0">
              <div className="card-header bg-white border-0 pb-0">
                <h2 className="formation-title text-success mb-3">
                  Formação da Comissão Permanente - Janeiro 2014
                </h2>
              </div>
              <div className="card-body">
                <p className="text-gray-700 leading-relaxed">
                  Um grupo de 24 enfermeiros da Secretaria Municipal de Saúde de
                  Florianópolis foi empossado na terça-feira (14/01/2014) como
                  integrante da Comissão Permanente de Sistematização da
                  Assistência de Enfermagem (CSAE).
                </p>
                <div className="position-relative aspect-video w-100 overflow-hidden rounded bg-success bg-opacity-10 mb-3">
                  <img
                    src={commissionPhoto}
                    alt="Membros da Comissão"
                    className="object-cover w-100 h-100"
                  />
                  <div className="position-absolute bottom-0 start-0 end-0 bg-black bg-opacity-60 text-white p-2 small">
                    Cilene Fernandes Soares (esquerda) e Elizimara Ferreira
                    Siqueira (centro) integram a CSAE
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <blockquote className="border-start border-4 border-success ps-3 fst-italic text-gray-700">
                      "Esse momento é um marco para a Enfermagem do município,
                      pois a implantação da Sistematização da Assistência de
                      Enfermagem contribui em diversos cenários para a prática
                      profissional."
                      <footer className="mt-2 text-sm text-gray-600">
                        - Elizimara Ferreira Siqueira, Responsável Técnica de
                        Enfermagem
                      </footer>
                    </blockquote>
                  </div>
                  <div className="col-12 col-md-6">
                    <blockquote className="border-start border-4 border-success ps-3 fst-italic text-gray-700">
                      "Muitas vezes utilizei experiências da enfermagem da rede
                      municipal de Florianópolis como referência para outros
                      municípios."
                      <footer className="mt-2 text-sm text-gray-600">
                        - Dra. Felipa Amadigi, Presidente do Coren/SC
                      </footer>
                    </blockquote>
                  </div>
                </div>

                <div className="bg-success bg-opacity-10 p-3 p-md-4 rounded mt-4">
                  <h3 className="h5 text-success mb-3">
                    Parcerias Institucionais
                  </h3>
                  <div className="row g-3">
                    <div className="col-12 col-sm-4">
                      <div className="text-center bg-white bg-opacity-50 p-3 rounded">
                        <span className="d-block fw-semibold text-success fs-5">
                          SMS
                        </span>
                        <span className="text-muted small">
                          Secretaria Municipal de Saúde
                        </span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="text-center bg-white bg-opacity-50 p-3 rounded">
                        <span className="d-block fw-semibold text-success fs-5">
                          UFSC
                        </span>
                        <span className="text-muted small">
                          Universidade Federal de Santa Catarina
                        </span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="text-center bg-white bg-opacity-50 p-3 rounded">
                        <span className="d-block fw-semibold text-success fs-5">
                          COREN/SC
                        </span>
                        <span className="text-muted small">
                          Conselho Regional de Enfermagem
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portaria */}
          <div className="portaria-block time-block position-relative mb-4">
            {/* Ícone central */}
            <div className="portaria-icon position-absolute top-0 start-50 translate-middle">
              <div className="icon-circle bg-success text-white d-flex align-items-center justify-content-center">
                <FileText className="icon-size" />
              </div>
            </div>

            {/* Card */}
            <div className="card portaria-card mx-auto shadow-sm border-0">
              <div className="card-header bg-white border-0 pb-0">
                <h2 className="portaria-title text-success mb-3">
                  PORTARIA Nº 79/2015
                </h2>
              </div>
              <div className="card-body">
                <p className="text-gray-700 leading-relaxed">
                  A portaria institui, no âmbito da Secretaria Municipal de
                  Saúde (SMS), a CSAE, definindo suas atribuições e
                  funcionamento.
                </p>
                <div className="row g-4 mt-3">
                  <div className="col-12 col-md-6">
                    <h3 className="h6 text-success fw-bold mb-2">
                      Principais Atribuições
                    </h3>
                    <ul className="list-disc list-inside text-gray-700">
                      <li>Construção coletiva da Proposta da SAE</li>
                      <li>Acompanhamento da implementação</li>
                      <li>Diagnóstico Situacional da Enfermagem</li>
                      <li>Qualificação profissional</li>
                      <li>Produção e revisão de protocolos</li>
                    </ul>
                  </div>
                  <div className="col-12 col-md-6">
                    <h3 className="h6 text-success fw-bold mb-2">
                      Organização
                    </h3>
                    <ul className="list-disc list-inside text-gray-700">
                      <li>Vinculada à Diretoria de Atenção Primária</li>
                      <li>4 horas semanais para atividades</li>
                      <li>Possibilidade de subcomissões</li>
                      <li>Atuação transversal na SMS</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline-success"
                    className="w-100"
                    onClick={() =>
                      window.open(
                        "https://www.pmf.sc.gov.br/arquivos/arquivos/pdf/05_08_2015_14.01.47.1db139dd6a2842c9796b6345c54e03e8.pdf",
                        "_blank"
                      )
                    }
                  >
                    Ver Portaria na Íntegra
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Primeira Versão do Portal */}
          <div className="primeira-versao-block time-block position-relative mb-4">
            {/* Ícone central */}
            <div className="primeira-versao-icon position-absolute top-0 start-50 translate-middle">
              <div className="icon-circle bg-success text-white d-flex align-items-center justify-content-center">
                <FileText className="icon-size" />
              </div>
            </div>

            {/* Card */}
            <div className="card primeira-versao-card mx-auto shadow-sm border-0">
              <div className="card-header bg-white border-0 pb-0">
                <h2 className="primeira-versao-title text-success mb-3">
                  Primeira Versão do Portal CSAE Floripa
                </h2>
              </div>
              <div className="card-body">
                <p className="text-gray-700 leading-relaxed">
                  Em agosto de 2022, durante o estágio de gestão na residência
                  de enfermagem em saúde da família, surgiu uma ideia que viria
                  a transformar a prática da enfermagem em Florianópolis. Em
                  meio a intensas conversas sobre as dificuldades que os
                  enfermeiros enfrentavam ao utilizar o processo de enfermagem,
                  a equipe discutia a necessidade de empoderar a profissão e
                  facilitar a padronização do cuidado, de forma a diferenciar os
                  enfermeiros de outros profissionais de saúde.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Nesse contexto, a Enf. Elizimara, incansável defensora do
                  empoderamento da enfermagem, inspirava a todos com sua paixão
                  e visão transformadora. Ao seu lado, Bruno Vinicius e Daniela
                  Rudiger vivenciavam, na prática, os desafios de manter um
                  cuidado padronizado. Bruno, que já possuía conhecimentos em
                  programação, sugeriu então a criação de uma plataforma digital
                  – uma solução desenvolvida em WordPress que pudesse
                  sistematizar e facilitar o processo de enfermagem.
                </p>

                {/* Imagens lado a lado */}
                <div className="row g-3 mt-3">
                  <div className="col-12 col-md-6">
                    <div className="position-relative aspect-video w-100 overflow-hidden rounded bg-success bg-opacity-10 mb-3">
                      <img
                        src={require("../img/fotoTrio.jpg")}
                        alt="Bruno, Daniela e Elizimara - Agosto/2022"
                        className="object-cover w-100 h-100"
                      />
                      <div className="position-absolute bottom-0 start-0 end-0 bg-black bg-opacity-60 text-white p-2 small">
                        Bruno (esquerda), Daniela (direita) e Enf. Elizimara
                        (centro) - Agosto/2022
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="position-relative aspect-video w-100 overflow-hidden rounded bg-success bg-opacity-10 mb-3">
                      <img
                        src={require("../img/telaPrimeiraVersao.png")}
                        alt="Tela da primeira versão do Portal CSAE Floripa"
                        className="object-cover w-100 h-100"
                      />
                      <div className="position-absolute bottom-0 start-0 end-0 bg-black bg-opacity-60 text-white p-2 small">
                        Interface inicial do Portal CSAE Floripa - WordPress
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mt-3">
                  A foto de agosto de 2022 captura esse momento emblemático: à
                  esquerda, Bruno, e à direita, Daniela, ambos imersos em
                  conversas que delineavam o futuro da plataforma, enquanto a
                  Enf. Elizimara, no centro, representava a força e o
                  comprometimento com a melhoria da prática profissional. Esse
                  encontro, carregado de empolgação e esperança, simbolizava o
                  início de um projeto que seria fruto do trabalho colaborativo.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  A construção da primeira versão do Portal CSAE Floripa contou
                  com a participação de diversos profissionais, além dos já
                  citados: as enfermeiras Juliana Cipriano de Arma e Ana Bim, o
                  então residente Renan Filipe Altrão e o estagiário Marcel
                  Canedo Gomes, que atuava sob a supervisão da Enf. Elizimara.
                  Cada contribuição foi fundamental para estruturar o site,
                  aprimorar a experiência do usuário e garantir o treinamento
                  dos primeiros profissionais que participaram do projeto
                  piloto, lançado oficialmente em outubro de 2022.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Essa versão inicial não só permitiu identificar as principais
                  dificuldades dos enfermeiros em realizar o processo de
                  enfermagem e atualizar os protocolos, mas também serviu como
                  base para a evolução contínua do portal – dados e feedbacks
                  que hoje embasam o desenvolvimento da versão 2.0. Inspirado
                  pelo artigo "Experiência Prática com o Portal CSAE Floripa:
                  Inovação Digital para a Padronização do Processo de
                  Enfermagem", o projeto demonstrou, desde o início, seu
                  potencial de elevar a prática da enfermagem, aprimorar o
                  raciocínio clínico e facilitar o aprendizado dos estudantes.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  O Portal CSAE Floripa, portanto, representa muito mais do que
                  uma ferramenta digital; ele é o primeiro de muitos passos rumo
                  a uma enfermagem de valor, marcada pela inovação e pelo
                  trabalho em equipe. Esse marco histórico reflete o compromisso
                  de transformar desafios em oportunidades, impulsionando a
                  enfermagem a novos patamares e consolidando Florianópolis como
                  referência em iniciativas inovadoras na área da saúde.
                </p>
              </div>
            </div>
          </div>

          {/* Portal CSAE Floripa 2.0 */}
          <div className="portal2-block time-block position-relative mb-4">
            {/* Ícone central */}
            <div className="portal2-icon position-absolute top-0 start-50 translate-middle">
              <div className="icon-circle bg-success text-white d-flex align-items-center justify-content-center">
                <FileText className="icon-size" />
              </div>
            </div>

            {/* Card */}
            <div className="card portal2-card mx-auto shadow-sm border-0">
              <div className="card-header bg-white border-0 pb-0">
                <h2 className="portal2-title text-success mb-3">
                  Portal CSAE Floripa 2.0
                </h2>
              </div>
              <div className="card-body">
                <p className="text-gray-700 leading-relaxed">
                  A versão 2.0 do Portal CSAE Floripa representa uma completa
                  reformulação, trazendo uma interface mais moderna e funcional,
                  com foco na experiência do usuário e na facilidade de acesso
                  às informações. Considerando as sugestões recebidas na
                  primeira versão, o novo portal oferece maior personalização,
                  integra novas funcionalidades e inaugura uma nova era de
                  destaque para a enfermagem em Florianópolis.
                </p>

                {/* Destaques */}
                <div className="row g-3 mt-3">
                  <div className="col-12 col-md-4">
                    <div className="bg-success bg-opacity-10 p-3 rounded text-center h-100 d-flex flex-column justify-content-center">
                      <span className="fw-bold text-success mb-2 fs-5">
                        Interface Moderna
                      </span>
                      <span className="text-sm text-gray-700">
                        Design intuitivo e responsivo
                      </span>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="bg-success bg-opacity-10 p-3 rounded text-center h-100 d-flex flex-column justify-content-center">
                      <span className="fw-bold text-success mb-2 fs-5">
                        Acesso Facilitado
                      </span>
                      <span className="text-sm text-gray-700">
                        Navegação simplificada
                      </span>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="bg-success bg-opacity-10 p-3 rounded text-center h-100 d-flex flex-column justify-content-center">
                      <span className="fw-bold text-success mb-2 fs-5">
                        Recursos Ampliados
                      </span>
                      <span className="text-sm text-gray-700">
                        Novas funcionalidades
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mt-3">
                  Com base nos dados e feedbacks coletados na fase inicial, o
                  Portal 2.0 amplia a colaboração entre enfermeiros, facilita o
                  aprendizado para estudantes e reforça a padronização do
                  processo de enfermagem, promovendo ainda mais eficiência e
                  segurança no cuidado. A plataforma agora se consolida como uma
                  referência para profissionais, refletindo o compromisso
                  contínuo de elevar a enfermagem a novos patamares.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SobrePortal;
