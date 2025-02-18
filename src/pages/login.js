import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoCSAE from "../img/logo_csae.png";
import "./login.css";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      toast.error("Preencha os campos de e-mail e senha");
      return;
    }
    setIsLoading(true);
    const auth = getAuth();
    try {
      // Tenta autenticar com Firebase Auth
      await signInWithEmailAndPassword(auth, email, senha);
      
      // Após a autenticação, busque os detalhes do usuário na coleção "dbUsuarios"
      const q = query(collection(db, "dbUsuarios"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        toast.error("Usuário não encontrado no banco de dados");
        setIsLoading(false);
        return;
      }
      let userData = null;
      querySnapshot.forEach((docSnap) => {
        userData = { id: docSnap.id, ...docSnap.data() };
      });
      
      // Certifica que o usuário possui o campo "nome"
      if (!userData.nome) {
        toast.error("Dados do usuário incompletos. Contate o administrador.");
        setIsLoading(false);
        return;
      }

      // Verifique o statusAcesso do usuário
      if (userData.statusAcesso === "Recusado" || userData.statusAcesso === "Revogado") {
        toast.error("Problema no acesso. Entre em contato com: gerenf.sms.pmf@gmail.com");
        setIsLoading(false);
        return;
      }
      if (userData.statusAcesso === "Aguardando") {
        toast.error("Seu acesso ainda não foi liberado. Tente mais tarde.");
        setIsLoading(false);
        return;
      }
      if (userData.statusAcesso === "Liberado") {
        // Incrementa o campo "numeroAcessos" no Firestore (cria ou incrementa)
        const userDocRef = doc(db, "dbUsuarios", userData.id);
        await updateDoc(userDocRef, {
          numeroAcessos: increment(1),
        });
        // Armazena os dados do usuário no localStorage para uso no Header e demais páginas
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success(`Bem-vindo(a), ${userData.nome}`);
        setIsLoading(false);
        navigate("/inicio");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao autenticar. Verifique suas credenciais.");
      setIsLoading(false);
    }
  };

  // Função para redefinir a senha usando um URL de ação personalizado
  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Por favor, insira seu e-mail para redefinir a senha.");
      return;
    }
    const auth = getAuth();
    const actionCodeSettings = {
      // URL personalizada para a página de gerenciamento de conta (altere para seu domínio)
      url: "https://csaefloripa.firebaseapp.com", 
      handleCodeInApp: true,
    };
    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      toast.success("E-mail de redefinição de senha enviado com sucesso.");
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição de senha:", error);
      toast.error("Erro ao enviar e-mail de redefinição de senha.");
    }
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
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
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
                <a href="#" className="link-green me-3" onClick={handlePasswordReset}>
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
              Ouvimos você! Nosso portal foi completamente reformulado para atender
              melhor às suas necessidades. Uma plataforma mais intuitiva, moderna e
              eficiente para apoiar seu trabalho diário.
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
      <ToastContainer />
    </div>
  );
}

export default Login;
