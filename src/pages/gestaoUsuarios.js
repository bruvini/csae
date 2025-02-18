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

const GestaoUsuarios = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userName = "Administrador";

  // Estado para pesquisa
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filtra os usuários conforme o termo de pesquisa (buscando no campo "nome")
  const filteredPendingUsers = pendingUsers
    ? pendingUsers.filter((u) =>
        u.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  const filteredActiveUsers = activeUsers
    ? activeUsers.filter((u) =>
        u.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  const filteredInactiveUsers = inactiveUsers
    ? inactiveUsers.filter((u) =>
        u.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
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
        modification: `Acesso permitido com tipo ${accessType}`,
        date: new Date(),
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
        modification: `Acesso recusado. Motivo: ${motivo}`,
        date: new Date(),
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
        modification: `Acesso revogado. Motivo: ${motivo}`,
        date: new Date(),
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
        modification: `Acesso permitido após revisão. Motivo: ${motivo}`,
        date: new Date(),
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
              <p className="text-muted">
                Nenhum usuário aguardando liberação.
              </p>
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
                      {user.numeroAcessos ? user.numeroAcessos : "nunca acessou"}
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
                    <div className="text-muted small">
                      Data:{" "}
                      {user.dataRecusaAcesso
                        ? new Date(
                            user.dataRecusaAcesso.toDate
                              ? user.dataRecusaAcesso.toDate()
                              : user.dataRecusaAcesso
                          ).toLocaleDateString("pt-BR")
                        : user.dataRevogadoAcesso
                        ? new Date(
                            user.dataRevogadoAcesso.toDate
                              ? user.dataRevogadoAcesso.toDate()
                              : user.dataRevogadoAcesso
                          ).toLocaleDateString("pt-BR")
                        : "N/A"}
                      <br />
                      Motivo:{" "}
                      {user.motivoRecusa || user.motivoRevogacao || "N/A"}
                    </div>
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
              <p>
                <strong>Nome:</strong> {selectedUser.nome}
              </p>
              <p>
                <strong>RG:</strong> {selectedUser.rg}
              </p>
              <p>
                <strong>CPF:</strong> {selectedUser.cpf}
              </p>
              <p>
                <strong>Endereço:</strong> {selectedUser.rua}, nº{" "}
                {selectedUser.numero}, {selectedUser.bairro}, CEP:{" "}
                {selectedUser.cep}, {selectedUser.cidade}/{selectedUser.uf}
              </p>
              <hr />
              <h5>Informações Profissionais</h5>
              <p>
                <strong>Formação:</strong> {selectedUser.formacao}
              </p>
              <p>
                <strong>Registro COREN:</strong> {selectedUser.registroCOREN} -{" "}
                {selectedUser.registroCORENUF}
              </p>
              <p>
                <strong>Atua na SMS:</strong> {selectedUser.atuaSMS}
              </p>
              <p>
                <strong>Cargo:</strong> {selectedUser.cargo}
              </p>
              <p>
                <strong>Local de Trabalho:</strong> {selectedUser.localTrabalho}
              </p>
              <p>
                <strong>Cidade de Trabalho:</strong> {selectedUser.cidadeTrabalho}
              </p>
              <hr />
              <h5>Informações de Acesso</h5>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.statusAcesso}
              </p>
              <p>
                <strong>Tipo de Acesso:</strong> {selectedUser.tipoAcesso}
              </p>
              <p>
                <strong>Número de Acessos:</strong>{" "}
                {selectedUser.numeroAcessos
                  ? selectedUser.numeroAcessos
                  : "nunca acessou"}
              </p>
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
