import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LogOut,
  Eye,
  UserCheck,
  UserPlus,
  UserX,
  XOctagon,
} from "lucide-react";
import { Modal, Button, Form } from "react-bootstrap";
import Header from "../components/header";
import NavbarHorizontal from "../components/navbarHorizontal";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./gestaoUsuarios.css";
import * as XLSX from "xlsx";

const GestaoUsuarios = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userName = "Administrador";

  // Estado para pesquisa
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para os filtros adicionais
  const [filterLotacao, setFilterLotacao] = useState("");
  const [filterFormacao, setFilterFormacao] = useState("");
  const [filterAtuaSMS, setFilterAtuaSMS] = useState("");
  const [filterTipoAcesso, setFilterTipoAcesso] = useState("");

  // Estado para o modal de detalhes do usuário e o tipo de acesso selecionado
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [accessType, setAccessType] = useState("Comum");

  // Função para buscar usuários pendentes (statusAcesso === "Aguardando")
  const fetchPendingUsers = async () => {
    const q = query(
      collection(db, "dbUsuarios"),
      where("statusAcesso", "==", "Aguardando")
    );
    const querySnapshot = await getDocs(q);
    let users = [];
    querySnapshot.forEach((docSnap) => {
      users.push({ id: docSnap.id, ...docSnap.data() });
    });
    return users;
  };

  // Função para buscar usuários com acesso (statusAcesso === "Liberado")
  const fetchActiveUsers = async () => {
    const q = query(
      collection(db, "dbUsuarios"),
      where("statusAcesso", "==", "Liberado")
    );
    const querySnapshot = await getDocs(q);
    let users = [];
    querySnapshot.forEach((docSnap) => {
      users.push({ id: docSnap.id, ...docSnap.data() });
    });
    return users;
  };

  // Função para buscar usuários inativos (statusAcesso in ["Recusado", "Revogado"])
  const fetchInactiveUsers = async () => {
    const q = query(
      collection(db, "dbUsuarios"),
      where("statusAcesso", "in", ["Recusado", "Revogado"])
    );
    const querySnapshot = await getDocs(q);
    let users = [];
    querySnapshot.forEach((docSnap) => {
      users.push({ id: docSnap.id, ...docSnap.data() });
    });
    return users;
  };

  const { data: pendingUsers, isLoading: loadingPending } = useQuery({
    queryKey: ["pendingUsers"],
    queryFn: fetchPendingUsers,
    staleTime: 5 * 60 * 1000,
  });

  const { data: activeUsers, isLoading: loadingActive } = useQuery({
    queryKey: ["activeUsers"],
    queryFn: fetchActiveUsers,
    staleTime: 5 * 60 * 1000,
  });

  const { data: inactiveUsers, isLoading: loadingInactive } = useQuery({
    queryKey: ["inactiveUsers"],
    queryFn: fetchInactiveUsers,
    staleTime: 5 * 60 * 1000,
  });

  // Função auxiliar para aplicar os filtros
  const applyFilters = (user) => {
    const term = searchTerm.toLowerCase();
    // Pesquisa em nome, número do COREN e matrícula
    const matchesSearch =
      user.nome.toLowerCase().includes(term) ||
      (user.registroCOREN &&
        String(user.registroCOREN).toLowerCase().includes(term)) ||
      (user.matricula && String(user.matricula).toLowerCase().includes(term));

    // Verifica os filtros adicionais: Lotação, Formação, Atua na SMS e Tipo de Acesso
    const matchesLotacao = filterLotacao
      ? user.lotacao === filterLotacao
      : true;
    const matchesFormacao = filterFormacao
      ? user.formacao === filterFormacao
      : true;
    const matchesAtuaSMS = filterAtuaSMS
      ? user.atuaSMS === filterAtuaSMS
      : true;
    const matchesTipoAcesso = filterTipoAcesso
      ? user.tipoAcesso === filterTipoAcesso
      : true;

    return (
      matchesSearch &&
      matchesLotacao &&
      matchesFormacao &&
      matchesAtuaSMS &&
      matchesTipoAcesso
    );
  };

  // Aplicando a função de filtro para cada grupo de usuários
  const filteredPendingUsers = pendingUsers
    ? pendingUsers.filter(applyFilters)
    : [];

  const filteredActiveUsers = activeUsers
    ? activeUsers.filter(applyFilters)
    : [];

  const filteredInactiveUsers = inactiveUsers
    ? inactiveUsers.filter(applyFilters)
    : [];

  const handleLogout = () => {
    navigate("/");
  };

  const handleViewDetails = (userId) => {
    // Procura o usuário em pendentes ou ativos ou inativos
    const user =
      (pendingUsers && pendingUsers.find((u) => u.id === userId)) ||
      (activeUsers && activeUsers.find((u) => u.id === userId)) ||
      (inactiveUsers && inactiveUsers.find((u) => u.id === userId));
    if (user) {
      setSelectedUser(user);
      setAccessType(user.tipoAcesso || "Comum");
      setShowUserModal(true);
    }
  };

  // Atualiza o tipo de acesso (ou permite acesso) e registra no histórico
  const handleLiberarAcesso = async () => {
    if (!selectedUser) return;
    try {
      const userDocRef = doc(db, "dbUsuarios", selectedUser.id);
      const newHistoryEntry = {
        modificacaoRealizada: `Acesso permitido com tipo ${accessType}`,
        date: new Date(),
        modificadoPor: userName, // Nome do usuário autenticado que executou a modificação
      };           
      await updateDoc(userDocRef, {
        statusAcesso: "Liberado",
        tipoAcesso: accessType,
        historicoModificacoes: arrayUnion(newHistoryEntry),
      });
      toast.success("Acesso permitido com sucesso!");
      setShowUserModal(false);
      queryClient.invalidateQueries(["pendingUsers"]);
      queryClient.invalidateQueries(["activeUsers"]);
      queryClient.invalidateQueries(["inactiveUsers"]);
    } catch (error) {
      console.error("Erro ao permitir acesso:", error);
      toast.error("Erro ao permitir acesso.");
    }
  };

  // Para usuários pendentes: recusa acesso
  const handleRecusarAcesso = async () => {
    if (!selectedUser) return;
    const motivo = window.prompt("Por favor, informe o motivo da recusa:");
    if (!motivo) return;
    try {
      const userDocRef = doc(db, "dbUsuarios", selectedUser.id);
      const newHistoryEntry = {
        modificacaoRealizada: `Acesso recusado. Motivo: ${motivo}`,
        date: new Date(),
        modificadoPor: userName,
      };           
      await updateDoc(userDocRef, {
        statusAcesso: "Recusado",
        historicoModificacoes: arrayUnion(newHistoryEntry),
      });
      toast.success("Acesso recusado com sucesso!");
      setShowUserModal(false);
      queryClient.invalidateQueries(["pendingUsers"]);
      queryClient.invalidateQueries(["inactiveUsers"]);
    } catch (error) {
      console.error("Erro ao recusar acesso:", error);
      toast.error("Erro ao recusar acesso.");
    }
  };

  // Para usuários ativos: revoga acesso
  const handleRevokeAccess = async (userId) => {
    const motivo = window.prompt("Informe o motivo da revogação:");
    if (!motivo) return;
    try {
      const userDocRef = doc(db, "dbUsuarios", userId);
      const newHistoryEntry = {
        modificacaoRealizada: `Acesso revogado. Motivo: ${motivo}`,
        date: new Date(),
        modificadoPor: userName,
      };           
      await updateDoc(userDocRef, {
        statusAcesso: "Revogado",
        historicoModificacoes: arrayUnion(newHistoryEntry),
      });
      toast.success("Acesso revogado com sucesso!");
      queryClient.invalidateQueries(["activeUsers"]);
      queryClient.invalidateQueries(["inactiveUsers"]);
    } catch (error) {
      console.error("Erro ao revogar acesso:", error);
      toast.error("Erro ao revogar acesso.");
    }
  };

  // Para usuários inativos (recusados ou revogados): permite acesso
  const handlePermitirAcesso = async (userId) => {
    const motivo = window.prompt(
      "Informe o motivo da revisão para permitir o acesso:"
    );
    if (!motivo) return;
    try {
      const userDocRef = doc(db, "dbUsuarios", userId);
      const newHistoryEntry = {
        modificacaoRealizada: `Acesso permitido após revisão. Motivo: ${motivo}`,
        date: new Date(),
        modificadoPor: userName,
      };           
      await updateDoc(userDocRef, {
        statusAcesso: "Liberado",
        historicoModificacoes: arrayUnion(newHistoryEntry),
      });
      toast.success("Acesso permitido com sucesso!");
      queryClient.invalidateQueries(["inactiveUsers"]);
      queryClient.invalidateQueries(["activeUsers"]);
    } catch (error) {
      console.error("Erro ao permitir acesso:", error);
      toast.error("Erro ao permitir acesso.");
    }
  };

  const handleRevokeResidentAccess = async (userId) => {
    // Solicita confirmação para revogação
    const confirmRevocation = window.confirm(
      "Você tem certeza que deseja revogar o acesso por término da residência?"
    );
    if (!confirmRevocation) return;
    try {
      const userDocRef = doc(db, "dbUsuarios", userId);
      const newHistoryEntry = {
        modificacaoRealizada: "Acesso revogado por término da residência",
        date: new Date(),
        modificadoPor: userName,
      };      
      await updateDoc(userDocRef, {
        statusAcesso: "Revogado",
        historicoModificacoes: arrayUnion(newHistoryEntry),
      });
      toast.success("Acesso revogado por término da residência!");
      queryClient.invalidateQueries(["activeUsers"]);
      queryClient.invalidateQueries(["inactiveUsers"]);
    } catch (error) {
      console.error("Erro ao revogar acesso para residente:", error);
      toast.error("Erro ao revogar acesso.");
    }
  };

  const handleDownloadXlsx = async () => {
    try {
      // Busca TODOS os usuários sem filtro
      const allDocs = await getDocs(collection(db, "dbUsuarios"));
      let data = [];
      allDocs.forEach((docSnap) => {
        const docData = docSnap.data();
        data.push({ id: docSnap.id, ...docData });
      });
  
      // Converte array de objetos em planilha
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
  
      // Monta o título do arquivo: "Relacao_de_Usuarios_Portal_CSAE_{dataHora}.xlsx"
      const now = new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      // Remove caracteres não aceitos em nomes de arquivo (ex.: "/", ":" etc.)
      const safeNow = now.replace(/[\/:]/g, "-").replace(/\s/g, "_");
      const fileName = `Relacao_de_Usuarios_Portal_CSAE_${safeNow}.xlsx`;
  
      // Gera e faz download do arquivo .xlsx
      XLSX.writeFile(workbook, fileName);
      toast.success(`Arquivo ${fileName} gerado com sucesso!`);
    } catch (error) {
      console.error("Erro ao gerar planilha XLSX:", error);
      toast.error("Erro ao gerar planilha XLSX.");
    }
  };  

  // Lista de lotações
  const lotacoes = [
    "Abraão",
    "Agronômica",
    "Alto Ribeirão",
    "Armação",
    "Balneário",
    "Barra da Lagoa",
    "Cachoeira do Bom Jesus",
    "Caieira da Barra do Sul",
    "Campeche",
    "Canasvieiras",
    "Canto da Lagoa",
    "Capivari",
    "CAPS - Pontal do Coral",
    "CAPSAD - Continente",
    "CAPSAD - Ilha",
    "CAPSI - Infantil",
    "Capoeiras",
    "Carianos",
    "Centro",
    "Coloninha",
    "Coqueiros",
    "Córrego Grande",
    "Costa da Lagoa",
    "Costeira do Pirajubaé",
    "Estreito",
    "Fazenda do Rio Tavares",
    "Ingleses",
    "Itacorubi",
    "Jardim Atlântico",
    "João Paulo",
    "Jurerê",
    "Lagoa da Conceição",
    "Monte Cristo",
    "Monte Serrat",
    "Morro das Pedras",
    "Novo Continente",
    "Pantanal",
    "Pântano do Sul",
    "Policlínica Centro",
    "Policlínica Continente",
    "Policlínica Norte",
    "Policlínica Sul",
    "Ponta das Canas",
    "Prainha",
    "Ratones",
    "Ribeirão da Ilha",
    "Rio Tavares",
    "Rio Vermelho",
    "Saco dos Limões",
    "Saco Grande",
    "Santinho",
    "Santo Antônio de Lisboa",
    "Sapé",
    "Tapera",
    "Trindade",
    "Upa Continente",
    "Upa Norte",
    "Upa Sul",
    "Vargem Grande",
    "Vargem Pequena",
    "Vila Aparecida",
  ];

  // Função para formatar a data usando os valores UTC
  const formatDateUTC = (date) => {
    const d = new Date(date);
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  // Filtra os residentes que já concluíram a residência (2 anos ou mais)
  const finishedResidents = activeUsers
    ? activeUsers.filter((user) => {
        // Verifica se é Residente + status Liberado
        if (
          user.formacao !== "Residente de Enfermagem" ||
          user.statusAcesso !== "Liberado"
        ) {
          return false;
        }
        // Verifica se a data de início da residência é >= 2 anos
        const startDate = user.dataInicioResidencia?.toDate
          ? user.dataInicioResidencia.toDate()
          : new Date(user.dataInicioResidencia);
        if (!startDate) return false;

        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

        // Aplica a lógica: se começou há 2+ anos e passa nos filtros
        const isFinished = startDate <= twoYearsAgo;
        return isFinished && applyFilters(user);
      })
    : [];

  return (
    <div>
      <Header userName={userName} handleLogout={handleLogout} />
      <NavbarHorizontal />
      <div className="container my-4">
        <h1 className="mb-3 text-success">Gestão de Usuários</h1>
        <p className="text-secondary">
          Gerencie os acessos e permissões dos usuários do sistema.
        </p>

        {/* Campo de pesquisa */}
        <div className="mb-4">
          <Form.Control
            type="text"
            placeholder="Pesquisar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Bloco de Filtros Adicionais */}
        <div className="row mb-4">
          {/* Filtro por Lotação */}
          <div className="col-md-3">
            <Form.Select
              value={filterLotacao}
              onChange={(e) => setFilterLotacao(e.target.value)}
            >
              <option value="">Lotação (Todos)</option>
              {lotacoes.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* Filtro por Formação */}
          <div className="col-md-3">
            <Form.Select
              value={filterFormacao}
              onChange={(e) => setFilterFormacao(e.target.value)}
            >
              <option value="">Formação (Todas)</option>
              <option value="Enfermeiro">Enfermeiro</option>
              <option value="Residente de Enfermagem">
                Residente de Enfermagem
              </option>
              <option value="Técnico de Enfermagem">
                Técnico de Enfermagem
              </option>
              <option value="Estagiário de Enfermagem">
                Estagiário de Enfermagem
              </option>
            </Form.Select>
          </div>

          {/* Filtro por Atua na SMS */}
          <div className="col-md-3">
            <Form.Select
              value={filterAtuaSMS}
              onChange={(e) => setFilterAtuaSMS(e.target.value)}
            >
              <option value="">Atua na SMS (Todos)</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </Form.Select>
          </div>

          {/* Filtro por Tipo de Acesso */}
          <div className="col-md-3">
            <Form.Select
              value={filterTipoAcesso}
              onChange={(e) => setFilterTipoAcesso(e.target.value)}
            >
              <option value="">Tipo de Acesso (Todos)</option>
              <option value="Administrador">Administrador</option>
              <option value="Comum">Comum</option>
            </Form.Select>
          </div>
        </div>

        {/* Linha com botão de reset dos filtros */}
        <div className="row mb-4">
          <div className="col-md-12 text-end">
            {/* Botão Resetar Filtros */}
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-2"
              onClick={() => {
                setSearchTerm("");
                setFilterLotacao("");
                setFilterFormacao("");
                setFilterAtuaSMS("");
                setFilterTipoAcesso("");
              }}
            >
              <XOctagon size={16} className="me-1" />
              Resetar Filtros
            </Button>

            {/* Botão Download XLSX */}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleDownloadXlsx}
            >
              Download XLSX
            </Button>
          </div>
        </div>

        {/* Bloco: Usuários Aguardando Liberação */}
        <div className="card mb-4">
          <div className="card-header d-flex align-items-center">
            <UserPlus size={20} className="text-success me-2" />
            <span>Usuários Aguardando Liberação</span>
          </div>
          <div className="card-body">
            {loadingPending ? (
              <p>Carregando...</p>
            ) : filteredPendingUsers && filteredPendingUsers.length > 0 ? (
              filteredPendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded"
                >
                  <span className="fw-medium">{user.nome}</span>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleViewDetails(user.id)}
                  >
                    <Eye size={16} className="me-1" />
                    Ver mais informações
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted">Nenhum usuário aguardando liberação.</p>
            )}
          </div>
        </div>

        {/* Bloco: Usuários com Acesso (Liberado) */}
        <div className="card mb-4">
          <div className="card-header d-flex align-items-center">
            <UserCheck size={20} className="text-success me-2" />
            <span>Usuários com Acesso</span>
          </div>
          <div className="card-body">
            {loadingActive ? (
              <p>Carregando...</p>
            ) : filteredActiveUsers && filteredActiveUsers.length > 0 ? (
              filteredActiveUsers.map((user) => (
                <div
                  key={user.id}
                  className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded"
                >
                  <div>
                    <span className="fw-medium">{user.nome}</span>
                    <div className="text-muted small">
                      Tipo: {user.tipoAcesso || "Não definido"} • Acessos:{" "}
                      {user.numeroAcessos
                        ? user.numeroAcessos
                        : "nunca acessou"}
                      {user.ultimoLogin && (
                        <>
                          {" "}
                          • Último login:{" "}
                          {new Date(user.ultimoLogin).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-success btn-sm me-2"
                      onClick={() => handleViewDetails(user.id)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRevokeAccess(user.id)}
                    >
                      <XOctagon size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">Nenhum usuário com acesso.</p>
            )}
          </div>
        </div>

        {/* Bloco: Usuários Inativos (Recusado/Revogado) */}
        <div className="card mb-4">
          <div className="card-header d-flex align-items-center">
            <UserX size={20} className="text-success me-2" />
            <span>Usuários com Acesso Recusado/Revogado</span>
          </div>
          <div className="card-body">
            {loadingInactive ? (
              <p>Carregando...</p>
            ) : filteredInactiveUsers && filteredInactiveUsers.length > 0 ? (
              filteredInactiveUsers.map((user) => (
                <div
                  key={user.id}
                  className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded"
                >
                  <div>
                    <span className="fw-medium">{user.nome}</span>
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => handlePermitirAcesso(user.id)}
                    >
                      Permitir acesso
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">
                Nenhum usuário com acesso recusado ou revogado.
              </p>
            )}
          </div>
        </div>

        {/* Bloco: Residentes com Residência Concluída */}
        <div className="card mb-4">
          <div className="card-header d-flex align-items-center">
            <UserX size={20} className="text-success me-2" />
            <span>Residentes com Residência Concluída</span>
          </div>
          <div className="card-body">
            {finishedResidents.length === 0 ? (
              <p className="text-muted">
                Nenhum residente com residência concluída.
              </p>
            ) : (
              finishedResidents.map((user) => {
                // Converte a data para o formato dd/mm/yyyy
                const startDate = user.dataInicioResidencia?.toDate
                  ? user.dataInicioResidencia.toDate()
                  : new Date(user.dataInicioResidencia);
                const formattedDate = formatDateUTC(startDate);
                return (
                  <div
                    key={user.id}
                    className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded"
                  >
                    <div>
                      <span className="fw-bold">{user.nome}</span>
                      <div className="text-muted small">
                        {`Início da Residência: ${formattedDate}`}
                        {user.lotacao
                          ? ` - Lotação atual: ${user.lotacao}`
                          : ""}
                      </div>
                    </div>
                    <div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRevokeResidentAccess(user.id)}
                      >
                        Revogar acesso
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalhes do usuário (para alteração de tipo de acesso) */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <h5>Informações Pessoais</h5>

              {/* Nome */}
              {selectedUser.nome && (
                <p>
                  <strong>Nome:</strong> {selectedUser.nome}
                </p>
              )}

              {/* RG */}
              {selectedUser.rg && (
                <p>
                  <strong>RG:</strong> {selectedUser.rg}
                </p>
              )}

              {/* CPF */}
              {selectedUser.cpf && (
                <p>
                  <strong>CPF:</strong> {selectedUser.cpf}
                </p>
              )}

              {/* Endereço completo (só exibe se houver pelo menos um campo) */}
              {(selectedUser.rua ||
                selectedUser.numero ||
                selectedUser.bairro ||
                selectedUser.cep ||
                selectedUser.cidade ||
                selectedUser.uf) && (
                <p>
                  <strong>Endereço:</strong>{" "}
                  {selectedUser.rua ? selectedUser.rua : ""}
                  {selectedUser.numero ? `, nº ${selectedUser.numero}` : ""}
                  {selectedUser.bairro ? `, ${selectedUser.bairro}` : ""}
                  {selectedUser.cep ? `, CEP: ${selectedUser.cep}` : ""}
                  {selectedUser.cidade ? `, ${selectedUser.cidade}` : ""}
                  {selectedUser.uf ? `/${selectedUser.uf}` : ""}
                </p>
              )}

              <hr />
              <h5>Informações Profissionais</h5>

              {/* Formação */}
              {selectedUser.formacao && (
                <p>
                  <strong>Formação:</strong> {selectedUser.formacao}
                </p>
              )}

              {/* Se for Residente de Enfermagem, exibe dataInicioResidencia formatada */}
              {selectedUser.formacao === "Residente de Enfermagem" &&
                selectedUser.dataInicioResidencia && (
                  <p>
                    <strong>Data de Início da Residência:</strong>{" "}
                    {/* Formate a data conforme sua função de formatação, se desejar */}
                    {selectedUser.dataInicioResidencia?.toDate
                      ? formatDateUTC(
                          selectedUser.dataInicioResidencia.toDate()
                        )
                      : formatDateUTC(selectedUser.dataInicioResidencia)}
                  </p>
                )}

              {/* Registro COREN */}
              {(selectedUser.registroCOREN || selectedUser.registroCORENUF) && (
                <p>
                  <strong>Registro COREN:</strong>{" "}
                  {selectedUser.registroCOREN ? selectedUser.registroCOREN : ""}
                  {selectedUser.registroCOREN && selectedUser.registroCORENUF
                    ? " - "
                    : ""}
                  {selectedUser.registroCORENUF
                    ? selectedUser.registroCORENUF
                    : ""}
                </p>
              )}

              {/* Atua na SMS */}
              {selectedUser.atuaSMS && (
                <p>
                  <strong>Atua na SMS:</strong> {selectedUser.atuaSMS}
                </p>
              )}

              {/* Lotação e Matrícula (só se atuaSMS === "Sim") */}
              {selectedUser.lotacao && (
                <p>
                  <strong>Lotação:</strong> {selectedUser.lotacao}
                </p>
              )}
              {selectedUser.matricula && (
                <p>
                  <strong>Matrícula:</strong> {selectedUser.matricula}
                </p>
              )}

              {/* CidadeTrabalho, localTrabalho, cargo (só se atuaSMS === "Não") */}
              {selectedUser.cidadeTrabalho && (
                <p>
                  <strong>Cidade de Trabalho:</strong>{" "}
                  {selectedUser.cidadeTrabalho}
                </p>
              )}
              {selectedUser.localTrabalho && (
                <p>
                  <strong>Local de Trabalho:</strong>{" "}
                  {selectedUser.localTrabalho}
                </p>
              )}
              {selectedUser.cargo && (
                <p>
                  <strong>Cargo:</strong> {selectedUser.cargo}
                </p>
              )}

              <hr />
              <h5>Informações de Acesso</h5>

              {/* Email */}
              {selectedUser.email && (
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
              )}

              {/* Status */}
              {selectedUser.statusAcesso && (
                <p>
                  <strong>Status:</strong> {selectedUser.statusAcesso}
                </p>
              )}

              {/* Tipo de Acesso */}
              {selectedUser.tipoAcesso && (
                <p>
                  <strong>Tipo de Acesso:</strong> {selectedUser.tipoAcesso}
                </p>
              )}

              {/* Número de Acessos */}
              {selectedUser.numeroAcessos !== undefined ? (
                <p>
                  <strong>Número de Acessos:</strong>{" "}
                  {selectedUser.numeroAcessos || "nunca acessou"}
                </p>
              ) : null}

              <hr />
              <Form.Group className="mb-3">
                <Form.Label>Alterar Tipo de Acesso</Form.Label>
                <Form.Select
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value)}
                >
                  <option value="Comum">Comum</option>
                  <option value="Administrador">Administrador</option>
                </Form.Select>
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleRecusarAcesso}>
            Recusar acesso
          </Button>
          <Button variant="success" onClick={handleLiberarAcesso}>
            Salvar alterações
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default GestaoUsuarios;
