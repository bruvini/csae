import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoCSAE from "../img/logo_csae.png"; // Adjust the path as needed
import "./cadastro.css";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Modal } from "react-bootstrap";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";

const Cadastro = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  // Informações Pessoais
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [cep, setCep] = useState("");

  // Informações Profissionais
  const [formacao, setFormacao] = useState("");
  const [registroCOREN, setRegistroCOREN] = useState("");
  const [registroCORENUF, setRegistroCORENUF] = useState("");
  const [atuaSMS, setAtuaSMS] = useState("");
  const [distrito, setDistrito] = useState("");
  const [cidadeTrabalho, setCidadeTrabalho] = useState("");
  const [localTrabalho, setLocalTrabalho] = useState("");
  const [cargo, setCargo] = useState("");

  // Informações de Acesso
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validação dos campos obrigatórios
    if (
      !nome ||
      !rg ||
      !cpf ||
      !rua ||
      !numero ||
      !bairro ||
      !cidade ||
      !uf ||
      !cep ||
      !email ||
      !senha
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    // Verificação de duplicatas
    const qEmail = query(
      collection(db, "dbUsuarios"),
      where("email", "==", email)
    );
    const qRG = query(collection(db, "dbUsuarios"), where("rg", "==", rg));
    const qCPF = query(collection(db, "dbUsuarios"), where("cpf", "==", cpf));
    const qCOREN = query(
      collection(db, "dbUsuarios"),
      where("registroCOREN", "==", registroCOREN),
      where("registroCORENUF", "==", registroCORENUF)
    );
    const [snapEmail, snapRG, snapCPF, snapCOREN] = await Promise.all([
      getDocs(qEmail),
      getDocs(qRG),
      getDocs(qCPF),
      getDocs(qCOREN),
    ]);

    if (
      !snapEmail.empty ||
      !snapRG.empty ||
      !snapCPF.empty ||
      !snapCOREN.empty
    ) {
      toast.error(
        "Já existe um usuário cadastrado com um ou mais dados informados (RG, CPF, e-mail ou COREN)."
      );
      return;
    }

    // Se não houver duplicatas, mostra o modal
    setShowModal(true);
  };

  const auth = getAuth();

  const handleConfirm = async () => {
    try {
      // Verificar se o usuário já está cadastrado (pseudo-código – implemente a consulta conforme sua lógica)
      const q = query(
        collection(db, "dbUsuarios"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        toast.error("Já existe um usuário cadastrado com este e-mail.");
        return;
      }

      // Criar usuário na autenticação do Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const uid = userCredential.user.uid;

      // Salvar os dados do usuário no Firestore (incluindo se o termo foi aceito)
      await addDoc(collection(db, "dbUsuarios"), {
        uid,
        nome,
        rg,
        cpf,
        rua,
        numero,
        bairro,
        cidade,
        uf,
        cep,
        formacao,
        registroCOREN,
        registroCORENUF,
        atuaSMS,
        distrito,
        cidadeTrabalho,
        localTrabalho,
        cargo,
        email,
        // Atenção: Não armazene senhas em texto plano em produção.
        termoAceito: true, // indica que o usuário aceitou o termo
        statusAcesso: "Aguardando",
        createdAt: new Date(),
      });

      toast.success(
        `Cadastro realizado com sucesso! ${nome}, você será direcionado(a) para a página de login.`
      );

      // Gerar PDF do termo e abri-lo em nova aba (Exemplo usando jsPDF – implemente conforme sua necessidade)
      const doc = new jsPDF();

      // Adiciona o logo (verifique se "logoCSAE" está em formato Base64 ou use a conversão necessária)
      doc.addImage(logoCSAE, "PNG", 10, 10, 50, 20);

      // Título centralizado com data e hora atual
      const currentDateTime = new Date().toLocaleString();
      const fileName = `Termo de Responsabilidade - ${nome} - ${currentDateTime}.pdf`;

      // Título interno do PDF com quebra de linha
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(
        "Termo de Responsabilidade\nProjeto Piloto - Portal CSAE Floripa",
        doc.internal.pageSize.getWidth() / 2,
        40,
        { align: "center" }
      );

      // Linha separadora
      doc.setLineWidth(0.5);
      doc.line(10, 55, doc.internal.pageSize.getWidth() - 10, 55);

      // Corpo do termo com margens e quebra automática de linha
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const margin = 10;
      const verticalOffset = 65;
      const textWidth = doc.internal.pageSize.getWidth() - margin * 2;
      const termoText = `Eu, ${nome}, brasileiro(a), COREN/${registroCORENUF} nº ${registroCOREN}, residente e domiciliado em: ${rua}, nº: ${numero}, bairro: ${bairro}, CEP: ${cep}, Cidade/UF: ${cidade}/${uf}, portador da Cédula de Identidade R.G. nº: ${rg}, inscrito no CPF sob o nº: ${cpf}.

ASSUMO a responsabilidade de participar como Piloto do Registro do Processo de Enfermagem, utilizando a Classificação Internacional para a Prática de Enfermagem (CIPE) e o endereço eletrônico www.csae.com.br no Centro de Saúde que estou alocado, conforme orientações fornecidas pela Comissão Permanente da Sistematização da Assistência de Enfermagem (CSAE) – Subcomissão CIPE Protocolos de Enfermagem da Secretaria Municipal de Saúde (SMS) de Florianópolis.

DECLARO seguir os princípios e diretrizes combinadas no processo de trabalho.

DECLARO ser de minha ciência que os dados contidos neste Piloto pertencem à SMS de Florianópolis, portanto, é de minha responsabilidade NÃO compartilhar com pessoas externas ao projeto os instrumentos e materiais disponibilizados, obrigando-me, assim, a ressarcir a ocorrência de qualquer dano e/ou prejuízo oriundo de uma eventual quebra de sigilo das informações fornecidas.

DECLARO não utilizar as informações confidenciais a que tiver acesso, para gerar benefício próprio exclusivo e/ou unilateral, presente ou futuro, ou para o uso de terceiros.

DECLARO ser da minha ciência que todos os dados que porventura forem utilizados para fins de pesquisa e extensão, deverão ser autorizados pela CSAE e Responsabilidade Técnica de Enfermagem.

Pelo não cumprimento do presente Termo de Responsabilidade, fica o abaixo assinado ciente de todas as sanções judiciais que poderão advir.

Florianópolis, ${new Date().getDate()} de ${new Date().toLocaleString(
        "default",
        { month: "long" }
      )} de ${new Date().getFullYear()}.`;

      doc.text(
        doc.splitTextToSize(termoText, textWidth),
        margin,
        verticalOffset
      );

      // Salva o arquivo com o nome desejado (isso fará o download com o nome correto)
      doc.save(fileName);

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");

      setShowModal(false);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      toast.error("Erro ao salvar os dados. Tente novamente.");
    }
  };

  return (
    <div className="container cadastro-container">
      <div className="row justify-content-center">
        <div className="col-lg-10 fade-in">
          <div className="cadastro-card">
            {/* Logo above the title */}
            <div className="text-center mb-3">
              <img src={logoCSAE} alt="Logo CSAE" className="logo-csae" />
            </div>
            <h2 className="mb-2 titulo text-center">
              Venha fazer parte da nova era da enfermagem com o Portal CSAE
              Floripa
            </h2>
            <p className="subtitulo text-center mb-4">
              Os dados abaixo são importantes para realizar o cadastro e para
              gerar o termo de responsabilidade de uso da plataforma, visto que
              é um projeto piloto e inovador.
            </p>
            <form onSubmit={handleSubmit}>
              {/* Informações Pessoais */}
              <div className="cadastro-section">
                <h4 className="mb-3">Informações Pessoais</h4>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="rg" className="form-label">
                      RG
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="rg"
                      value={rg}
                      onChange={(e) => setRg(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="cpf" className="form-label">
                      CPF
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="cpf"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Endereço</label>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Rua"
                        value={rua}
                        onChange={(e) => setRua(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-2 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Número"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Bairro"
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Cidade"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-2 mb-3">
                      <select
                        className="form-select"
                        value={uf}
                        onChange={(e) => setUf(e.target.value)}
                        required
                      >
                        <option value="">Selecione</option>
                        <option value="AC">AC</option>
                        <option value="AL">AL</option>
                        <option value="AP">AP</option>
                        <option value="AM">AM</option>
                        <option value="BA">BA</option>
                        <option value="CE">CE</option>
                        <option value="DF">DF</option>
                        <option value="ES">ES</option>
                        <option value="GO">GO</option>
                        <option value="MA">MA</option>
                        <option value="MT">MT</option>
                        <option value="MS">MS</option>
                        <option value="MG">MG</option>
                        <option value="PA">PA</option>
                        <option value="PB">PB</option>
                        <option value="PR">PR</option>
                        <option value="PE">PE</option>
                        <option value="PI">PI</option>
                        <option value="RJ">RJ</option>
                        <option value="RN">RN</option>
                        <option value="RS">RS</option>
                        <option value="RO">RO</option>
                        <option value="RR">RR</option>
                        <option value="SC">SC</option>
                        <option value="SP">SP</option>
                        <option value="SE">SE</option>
                        <option value="TO">TO</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="CEP"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Profissionais */}
              <div className="cadastro-section">
                <h4 className="mb-3">Informações Profissionais</h4>
                <div className="mb-3">
                  <label htmlFor="formacao" className="form-label">
                    Formação
                  </label>
                  <select
                    className="form-select"
                    id="formacao"
                    value={formacao}
                    onChange={(e) => setFormacao(e.target.value)}
                    required
                  >
                    <option value="">Selecione</option>
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
                  </select>
                </div>
                {formacao && formacao !== "Estagiário de Enfermagem" && (
                  <div className="mb-3">
                    <label className="form-label">Registro COREN</label>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Número"
                          value={registroCOREN}
                          onChange={(e) => setRegistroCOREN(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <select
                          className="form-select"
                          value={registroCORENUF}
                          onChange={(e) => setRegistroCORENUF(e.target.value)}
                          required
                        >
                          <option value="">Selecione</option>
                          <option value="AC">AC</option>
                          <option value="AL">AL</option>
                          <option value="AP">AP</option>
                          <option value="AM">AM</option>
                          <option value="BA">BA</option>
                          <option value="CE">CE</option>
                          <option value="DF">DF</option>
                          <option value="ES">ES</option>
                          <option value="GO">GO</option>
                          <option value="MA">MA</option>
                          <option value="MT">MT</option>
                          <option value="MS">MS</option>
                          <option value="MG">MG</option>
                          <option value="PA">PA</option>
                          <option value="PB">PB</option>
                          <option value="PR">PR</option>
                          <option value="PE">PE</option>
                          <option value="PI">PI</option>
                          <option value="RJ">RJ</option>
                          <option value="RN">RN</option>
                          <option value="RS">RS</option>
                          <option value="RO">RO</option>
                          <option value="RR">RR</option>
                          <option value="SC">SC</option>
                          <option value="SP">SP</option>
                          <option value="SE">SE</option>
                          <option value="TO">TO</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">
                    Atua na SMS de Florianópolis?
                  </label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="sms"
                        id="smsSim"
                        value="Sim"
                        checked={atuaSMS === "Sim"}
                        onChange={(e) => setAtuaSMS(e.target.value)}
                        required
                      />
                      <label className="form-check-label" htmlFor="smsSim">
                        Sim
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="sms"
                        id="smsNao"
                        value="Não"
                        checked={atuaSMS === "Não"}
                        onChange={(e) => setAtuaSMS(e.target.value)}
                        required
                      />
                      <label className="form-check-label" htmlFor="smsNao">
                        Não
                      </label>
                    </div>
                  </div>
                </div>
                {atuaSMS === "Sim" && (
                  <div className="mb-3">
                    <label htmlFor="distrito" className="form-label">
                      Distrito
                    </label>
                    <select
                      className="form-select"
                      id="distrito"
                      value={distrito}
                      onChange={(e) => setDistrito(e.target.value)}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Norte">Norte</option>
                      <option value="Sul">Sul</option>
                      <option value="Centro">Centro</option>
                      <option value="Continente">Continente</option>
                      <option value="Gestão">Gestão</option>
                    </select>
                  </div>
                )}
                {atuaSMS === "Não" && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="cidadeTrabalho" className="form-label">
                        Cidade que trabalha
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cidadeTrabalho"
                        value={cidadeTrabalho}
                        onChange={(e) => setCidadeTrabalho(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="localTrabalho" className="form-label">
                        Local
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="localTrabalho"
                        value={localTrabalho}
                        onChange={(e) => setLocalTrabalho(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="cargo" className="form-label">
                        Cargo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cargo"
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Informações de acesso */}
              <div className="cadastro-section">
                <h4 className="mb-3">Informações de acesso</h4>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    E-mail principal
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="senha" className="form-label">
                    Senha
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between">
                {/* Custom green button */}
                <button type="submit" className="btn btn-custom">
                  Fazer Cadastro
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/login")}
                >
                  Voltar para a página de login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="modal-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Termo de Responsabilidade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Eu, <strong>{nome}</strong>, brasileiro(a), COREN/
            <strong>{registroCORENUF}</strong> nº{" "}
            <strong>{registroCOREN}</strong>, residente e domiciliado em:{" "}
            <strong>{rua}</strong>, nº: <strong>{numero}</strong>, bairro:{" "}
            <strong>{bairro}</strong>, CEP: <strong>{cep}</strong>, Cidade/UF:{" "}
            <strong>
              {cidade}/{uf}
            </strong>
            , portador da Cédula de Identidade R.G. nº: <strong>{rg}</strong>,
            inscrito no CPF sob o nº: <strong>{cpf}</strong>.
          </p>
          <p>
            ASSUMO a responsabilidade de participar como Piloto do Registro do
            Processo de Enfermagem, utilizando a Classificação Internacional
            para a Prática de Enfermagem (CIPE) e o endereço eletrônico
            www.csae.com.br no Centro de Saúde que estou alocado, conforme
            orientações fornecidas pela Comissão Permanente da Sistematização da
            Assistência de Enfermagem (CSAE) – Subcomissão CIPE Protocolos de
            Enfermagem da Secretaria Municipal de Saúde (SMS) de Florianópolis.
          </p>
          <p>
            DECLARO seguir os princípios e diretrizes combinadas no processo de
            trabalho.
          </p>
          <p>
            DECLARO ser de minha ciência que os dados contidos neste Piloto
            pertencem à SMS de Florianópolis, portanto, é de minha
            responsabilidade <strong>NÃO</strong> compartilhar com pessoas
            externas ao projeto os instrumentos e materiais disponibilizados,
            obrigando-me, assim, a ressarcir a ocorrência de qualquer dano e/ou
            prejuízo oriundo de uma eventual quebra de sigilo das informações
            fornecidas.
          </p>
          <p>
            DECLARO não utilizar as informações confidenciais a que tiver
            acesso, para gerar benefício próprio exclusivo e/ou unilateral,
            presente ou futuro, ou para o uso de terceiros.
          </p>
          <p>
            DECLARO ser da minha ciência que todos os dados que porventura forem
            utilizados para fins de pesquisa e extensão, deverão ser autorizados
            pela CSAE e Responsabilidade Técnica de Enfermagem.
          </p>
          <p>
            Pelo não cumprimento do presente Termo de Responsabilidade, fica o
            abaixo assinado ciente de todas as sanções judiciais que poderão
            advir.
          </p>
          <p>
            Florianópolis, {new Date().getDate()} de{" "}
            {new Date().toLocaleString("default", { month: "long" })} de{" "}
            {new Date().getFullYear()}.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Recusar
          </button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            Concordo
          </button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Cadastro;
