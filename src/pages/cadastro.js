import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoCSAE from "../img/logo_csae.png"; // Adjust the path as needed
import "./cadastro.css";

const Cadastro = () => {
  const navigate = useNavigate();

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
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cadastro realizado com sucesso!");
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
              Venha fazer parte da nova era da enfermagem com o Portal CSAE Floripa
            </h2>
            <p className="subtitulo text-center mb-4">
              Os dados abaixo são importantes para realizar o cadastro e para gerar o termo de
              responsabilidade de uso da plataforma, visto que é um projeto piloto e inovador.
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
                      type="text"
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
                      type="text"
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
                      <input
                        type="text"
                        className="form-control"
                        placeholder="UF"
                        value={uf}
                        onChange={(e) => setUf(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <input
                        type="text"
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
                    <option value="Residente de Enfermagem">Residente de Enfermagem</option>
                    <option value="Técnico de Enfermagem">Técnico de Enfermagem</option>
                    <option value="Estagiário de Enfermagem">Estagiário de Enfermagem</option>
                  </select>
                </div>
                {formacao && formacao !== "Estagiário de Enfermagem" && (
                  <div className="mb-3">
                    <label className="form-label">Registro COREN</label>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Número"
                          value={registroCOREN}
                          onChange={(e) => setRegistroCOREN(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="UF"
                          value={registroCORENUF}
                          onChange={(e) => setRegistroCORENUF(e.target.value)}
                          required
                        />
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
                  <label htmlFor="usuario" className="form-label">
                    Nome de usuário
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
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
    </div>
  );
};

export default Cadastro;
