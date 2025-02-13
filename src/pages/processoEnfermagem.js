import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calculator,
  FileText,
  History,
  Search,
  UserPlus,
  ArrowRight,
  Save,
  Info,
} from "lucide-react";
import Header from "../components/header";
import NavbarHorizontal from "../components/navbarHorizontal";
import "./processoEnfermagem.css";

function ProcessoEnfermagem() {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState("");
  const [currentStep, setCurrentStep] = useState("avaliacao");

  // States for weight, height and computed IMC
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [imc, setImc] = useState("");

  useEffect(() => {
    if (weight && height && weight > 0 && height > 0) {
      const computedImc = (weight / (height / 100) ** 2).toFixed(2);
      setImc(computedImc);
    } else {
      setImc("");
    }
  }, [weight, height]);

  /* ===================== Diagnóstico Step States ===================== */
  // diagnosisTypes: toggles for showing the options blocks
  const [diagnosisTypes, setDiagnosisTypes] = useState({
    protocolos: false,
    necessidades: false,
  });
  // extraSelections: stores the dropdown selections for each parent option.
  // Key: parent option (protocol/necessidade), Value: array of selected diagnoses (strings)
  const [extraSelections, setExtraSelections] = useState({});

  const protocolOptions = [
    "Volume 1 - Hipertensão, Diabetes e outros fatores associados a doenças cardiovasculares",
    "Volume 2 - Infecções Sexualmente Transmissíveis e outras doenças transmissíveis de interesse em saúde coletiva (dengue e tuberculose)",
    "Volume 3 - Saúde da mulher - Acolhimento às demandas da mulher nos diferentes ciclos de vida",
    "Volume 4 - Atendimento à Demanda Espontânea do Adulto",
    "Volume 5 - Atenção à Demanda de Cuidados na Criança",
    "Volume 6 - Cuidado à pessoa com ferida",
    "Volume 7 - Acolhimento com Classificação de Risco na atenção a demanda espontânea (adulto e infantil)",
    "Volume 8 - Cuidado em Saúde Mental - Acolhimento e cuidado à pessoa em sofrimento psíquico e/ou em uso de álcool",
  ];

  const necessidadesOptions = [
    "Amor e aceitação",
    "Atividade física",
    "Autoestima, Autoconfiança e autorespeito",
    "Autorealização",
    "Comunicação",
    "Cuidado corporal e ambiental",
    "Educação para saúde e aprendizagem",
    "Eliminações",
    "Garantia de acesso à tecnologia",
    "Gregária",
    "Hidratação",
    "Integridade física",
    "Liberdade e participação",
    "Nutrição",
    "Oxigenação",
    "Recreação e lazer",
    "Regulação - crescimento celular e desenvolvimento funcional",
    "Regulação hormonal",
    "Regulação neurológica",
    "Regulação térmica",
    "Regulação vascular",
    "Religiosidade e espiritualidade",
    "Segurança emocional",
    "Segurança física e meio ambiente",
    "Sensopercepção",
    "Sexualidade e reprodução",
    "Sono e repouso",
    "Terapêutica e de Prevenção",
  ];

  const dummyDropdownOptions = ["Opção 1", "Opção 2", "Opção 3"];

  // Helper: Check if a parent option is selected (i.e. exists in extraSelections)
  const isOptionSelected = (option) => {
    return Object.prototype.hasOwnProperty.call(extraSelections, option);
  };

  const handleCheckboxChange = (option, isChecked) => {
    if (isChecked) {
      setExtraSelections((prev) => ({
        ...prev,
        [option]: prev[option] || [],
      }));
    } else {
      setExtraSelections((prev) => {
        const newSelections = { ...prev };
        delete newSelections[option];
        return newSelections;
      });
    }
  };

  const handleDropdownChange = (option, optionsCollection) => {
    const values = Array.from(optionsCollection)
      .filter((opt) => opt.selected)
      .map((opt) => opt.value);
    setExtraSelections((prev) => ({
      ...prev,
      [option]: values,
    }));
  };

  const toggleDiagnosisType = (type) => {
    setDiagnosisTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const removeDiagnosis = (option, diagnosis) => {
    setExtraSelections((prev) => {
      const updated = prev[option].filter((d) => d !== diagnosis);
      return {
        ...prev,
        [option]: updated,
      };
    });
  };

  // Flatten selected diagnoses: for planning, we only want the diagnoses chosen from dropdowns.
  // Each flattened item is an object: { parent, diagnosis }
  const getFlattenedDiagnoses = () => {
    return Object.entries(extraSelections).flatMap(([option, diags]) =>
      diags.map((diag) => ({ parent: option, diagnosis: diag }))
    );
  };

  /* ===================== Planejamento Step States ===================== */
  const [planningOrder, setPlanningOrder] = useState([]);
  const [planningSubmitted, setPlanningSubmitted] = useState(false);
  // planningSelections: stores for each diagnosis block a single expected result and multiple interventions.
  // Key is a unique key for each diagnosis in planningOrder.
  const [planningSelections, setPlanningSelections] = useState({});

  const dummyExpectedResults = ["Resultado 1", "Resultado 2", "Resultado 3"];
  const dummyInterventions = [
    "Intervenção 1",
    "Intervenção 2",
    "Intervenção 3",
  ];

  const moveUp = (index) => {
    if (index === 0) return;
    setPlanningOrder((prev) => {
      const newOrder = [...prev];
      [newOrder[index - 1], newOrder[index]] = [
        newOrder[index],
        newOrder[index - 1],
      ];
      return newOrder;
    });
  };

  const moveDown = (index) => {
    if (index === planningOrder.length - 1) return;
    setPlanningOrder((prev) => {
      const newOrder = [...prev];
      [newOrder[index + 1], newOrder[index]] = [
        newOrder[index],
        newOrder[index + 1],
      ];
      return newOrder;
    });
  };

  const handleExpectedResultChange = (key, value) => {
    setPlanningSelections((prev) => ({
      ...prev,
      [key]: { ...prev[key], expectedResult: value },
    }));
  };

  const handleInterventionsChange = (key, optionsCollection) => {
    const values = Array.from(optionsCollection)
      .filter((opt) => opt.selected)
      .map((opt) => opt.value);
    setPlanningSelections((prev) => ({
      ...prev,
      [key]: { ...prev[key], interventions: values },
    }));
  };

  /* ===================== Implementation Step States ===================== */
  // New state to store user-selected interventions for implementation.
  // It is similar to planningSelections but editable in the implementation stage.
  const [implementationSelections, setImplementationSelections] = useState({});

  // When entering "implementacao", initialize implementationSelections from planningSelections.
  useEffect(() => {
    if (
      currentStep === "implementacao" &&
      Object.keys(planningSelections).length > 0
    ) {
      setImplementationSelections(planningSelections);
    }
  }, [currentStep, planningSelections]);

  /* ===================== Evolution Step State ===================== */
  const [evolutionText, setEvolutionText] = useState("");
  useEffect(() => {
    if (currentStep === "evolucao") {
      // Generate a summary text from previous data.
      let text = "Evolução de Enfermagem\n\n";
      text += `Peso: ${weight} kg, Altura: ${height} cm, IMC: ${imc}\n\nDiagnósticos Implementados:\n`;
      const flat = getFlattenedDiagnoses();
      flat.forEach((item, index) => {
        const key = `${item.parent}-${item.diagnosis}-${index}`;
        const interventions =
          implementationSelections[key]?.interventions || [];
        text += `- ${item.parent}: ${
          item.diagnosis
        }\n  Intervenções: ${interventions.join(", ")}\n\n`;
      });
      setEvolutionText(text);
    }
  }, [currentStep, weight, height, imc, implementationSelections]);

  function getIMCClassification(imcValue) {
    if (!imcValue) return { label: "", color: "" };

    const value = parseFloat(imcValue);
    if (value <= 18.5) {
      return { label: "Baixo peso", color: "red" };
    } else if (value <= 24.9) {
      return { label: "Peso normal", color: "green" };
    } else if (value <= 29.9) {
      return { label: "Sobrepeso", color: "goldenrod" };
    } else if (value <= 34.9) {
      return { label: "Obesidade grau I", color: "red" };
    } else if (value <= 39.9) {
      return { label: "Obesidade grau II", color: "red" };
    } else {
      return { label: "Obesidade grau III", color: "red" };
    }
  }

  return (
    <div className="processo-enfermagem-container">
      {/* Header */}
      <Header userName="Usuário" handleLogout={() => navigate("/login")} />
      <NavbarHorizontal />

      {/* Main Content */}
      <main className="container py-4">
        <div className="mb-4">
          <h1 className="processo-title">Processo de Enfermagem</h1>
          <div className="instructions-block p-4 rounded">
            <h2 className="instructions-title mb-3">
              Ferramenta Inovadora para Sistematização da Assistência
            </h2>
            <p className="instructions-text">
              Nossa ferramenta permite documentar todo o processo de enfermagem
              de forma intuitiva e eficiente. Primeiro, cadastre um novo
              paciente ou selecione um já cadastrado. Você pode salvar seu
              progresso a qualquer momento e continuar depois. Todas as etapas
              são salvas automaticamente para evitar perda de informações.
            </p>
          </div>
        </div>

        {/* Patient Search and Actions */}
        <div className="row g-3 mb-4 patient-actions">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="search"
                className="form-control"
                placeholder="Buscar paciente..."
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              />
              <button className="btn btn-outline-primary" type="button">
                <Search size={16} />
              </button>
            </div>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
              <UserPlus size={16} className="me-1" />
              Novo Paciente
            </button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-secondary w-100 d-flex align-items-center justify-content-center">
              <Calculator size={16} className="me-1" />
              Calculadoras
            </button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center">
              <History size={16} className="me-1" />
              Histórico
            </button>
          </div>
        </div>

        {/* Process Steps Tabs */}
        {selectedPatient && (
          <div>
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    currentStep === "avaliacao" ? "active" : ""
                  }`}
                  onClick={() => setCurrentStep("avaliacao")}
                >
                  Avaliação
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    currentStep === "diagnostico" ? "active" : ""
                  }`}
                  onClick={() => setCurrentStep("diagnostico")}
                >
                  Diagnóstico
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    currentStep === "planejamento" ? "active" : ""
                  }`}
                  onClick={() => {
                    if (getFlattenedDiagnoses().length === 0) {
                      alert(
                        "Selecione diagnósticos na etapa Diagnóstico antes de acessar o Planejamento."
                      );
                    } else {
                      setCurrentStep("planejamento");
                      if (planningOrder.length === 0) {
                        setPlanningOrder(getFlattenedDiagnoses());
                      }
                    }
                  }}
                >
                  Planejamento
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    currentStep === "implementacao" ? "active" : ""
                  }`}
                  onClick={() => {
                    const flattened = getFlattenedDiagnoses();
                    if (flattened.length === 0) {
                      alert(
                        "Selecione diagnósticos na etapa Diagnóstico antes de acessar a Implementação."
                      );
                    } else if (
                      planningOrder.length === 0 ||
                      flattened.some((item, index) => {
                        const key = `${item.parent}-${item.diagnosis}-${index}`;
                        return (
                          !planningSelections[key] ||
                          !planningSelections[key].expectedResult ||
                          !planningSelections[key].interventions ||
                          planningSelections[key].interventions.length === 0
                        );
                      })
                    ) {
                      alert(
                        "Preencha os resultados esperados e intervenções na etapa de Planejamento antes de acessar a Implementação."
                      );
                    } else {
                      setCurrentStep("implementacao");
                    }
                  }}
                >
                  Implementação
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    currentStep === "evolucao" ? "active" : ""
                  }`}
                  onClick={() => {
                    // Evolution is accessible only if every diagnosis in implementation has at least one intervention selected.
                    const flattened = getFlattenedDiagnoses();
                    if (
                      flattened.length === 0 ||
                      flattened.some((item, index) => {
                        const key = `${item.parent}-${item.diagnosis}-${index}`;
                        return (
                          !implementationSelections[key] ||
                          !implementationSelections[key].interventions ||
                          implementationSelections[key].interventions.length ===
                            0
                        );
                      })
                    ) {
                      alert(
                        "Selecione intervenções na etapa de Implementação antes de acessar a Evolução."
                      );
                    } else {
                      setCurrentStep("evolucao");
                    }
                  }}
                >
                  Evolução
                </button>
              </li>
            </ul>

            {/* Diagnóstico Content */}
            {currentStep === "diagnostico" && (
              <div className="diagnostico-content">
                <h3 className="h5 text-primary mb-3">
                  Diagnóstico de Enfermagem
                </h3>
                <p className="text-muted">
                  Compreende a identificação de
                  problemas existentes, condições de vulnerabilidades ou
                  disposições para melhorar comportamentos de saúde. Estes
                  representam o julgamento clínico das informações obtidas sobre
                  as necessidades do cuidado de Enfermagem e saúde da pessoa,
                  família, coletividade ou grupos especiais.
                </p>
                {/* "Pesquisar por:" Block */}
                <div className="mb-4 pesquisa-diagnostico">
                  <span className="me-2">Pesquisar por:</span>
                  <div className="btn-group">
                    <button
                      className={`btn btn-outline-primary ${
                        diagnosisTypes.protocolos ? "active" : ""
                      }`}
                      onClick={() => toggleDiagnosisType("protocolos")}
                    >
                      Protocolos de Enfermagem
                    </button>
                    <button
                      className={`btn btn-outline-primary ${
                        diagnosisTypes.necessidades ? "active" : ""
                      }`}
                      onClick={() => toggleDiagnosisType("necessidades")}
                    >
                      Necessidades Humanas Básicas
                    </button>
                  </div>
                </div>
                {/* Options for Protocolos */}
                {diagnosisTypes.protocolos && (
                  <div className="mb-3">
                    <h4 className="h6 text-primary">Selecione os Volumes:</h4>
                    {protocolOptions.map((option) => (
                      <div key={option} className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`protocolos-${option}`}
                          checked={isOptionSelected(option)}
                          onChange={(e) =>
                            handleCheckboxChange(option, e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`protocolos-${option}`}
                        >
                          {option}
                        </label>
                        {isOptionSelected(option) && (
                          <div className="mt-2 extra-options">
                            <label className="form-label">
                              Selecione diagnósticos:
                            </label>
                            <select
                              multiple
                              className="form-control"
                              onChange={(e) =>
                                handleDropdownChange(option, e.target.options)
                              }
                            >
                              {dummyDropdownOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {/* Options for Necessidades */}
                {diagnosisTypes.necessidades && (
                  <div className="mb-3">
                    <h4 className="h6 text-primary">
                      Selecione as Necessidades:
                    </h4>
                    {necessidadesOptions.map((option) => (
                      <div key={option} className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`necessidades-${option}`}
                          checked={isOptionSelected(option)}
                          onChange={(e) =>
                            handleCheckboxChange(option, e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`necessidades-${option}`}
                        >
                          {option}
                        </label>
                        {isOptionSelected(option) && (
                          <div className="mt-2 extra-options">
                            <label className="form-label">
                              Selecione diagnósticos:
                            </label>
                            <select
                              multiple
                              className="form-control"
                              onChange={(e) =>
                                handleDropdownChange(option, e.target.options)
                              }
                            >
                              {dummyDropdownOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {/* Selected Diagnoses List (Grouped by parent option) */}
                {Object.keys(extraSelections).length > 0 && (
                  <div className="selected-diagnoses mb-3">
                    <h4 className="h6 text-primary">
                      Diagnósticos Selecionados:
                    </h4>
                    {Object.entries(extraSelections).map(
                      ([option, diagnoses]) =>
                        diagnoses.length > 0 && (
                          <div key={option} className="mb-2">
                            <strong>{option}</strong>
                            <ul className="list-group">
                              {diagnoses.map((diag, idx) => (
                                <li
                                  key={`${option}-${diag}-${idx}`}
                                  className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                  <span>{diag}</span>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                      removeDiagnosis(option, diag)
                                    }
                                  >
                                    Remover
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                    )}
                  </div>
                )}
                {/* "Não encontrei..." Icon Button with Tooltip */}
                <div className="mb-3">
                  <button
                    className="btn btn-link"
                    title="Não encontrei um diagnóstico que eu procurava"
                  >
                    <Info size={16} />
                  </button>
                </div>
                {/* Action Buttons for Diagnóstico Tab */}
                <div className="d-flex justify-content-between pt-3">
                  <button
                    className="btn btn-outline-primary d-flex align-items-center"
                    onClick={() => setCurrentStep("avaliacao")}
                  >
                    <span>Voltar para: Diagnóstico de Enfermagem</span>
                  </button>
                  <button className="btn btn-outline-primary d-flex align-items-center">
                    <span>Continuar depois</span>
                  </button>
                  <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => {
                      if (getFlattenedDiagnoses().length === 0) {
                        alert(
                          "Selecione diagnósticos na etapa Diagnóstico antes de prosseguir para o Planejamento."
                        );
                      } else {
                        setCurrentStep("planejamento");
                        if (planningOrder.length === 0) {
                          setPlanningOrder(getFlattenedDiagnoses());
                        }
                      }
                    }}
                  >
                    <span>Planejamento de Enfermagem</span>
                    <ArrowRight size={16} className="ms-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Planejamento Content */}
            {currentStep === "planejamento" && (
              <div className="planejamento-content">
                <h3 className="h5 text-primary mb-3">
                  Planejamento de Enfermagem
                </h3>
                <p className="text-muted">
                  Compreende o desenvolvimento de um plano assistencial direcionado para à pessoa, família, coletividade, grupos especiais, e compartilhado com os sujeitos do cuidado e equipe de Enfermagem e saúde.
                </p>
                {!planningSubmitted && (
                  <div className="priorizacao-block mb-4">
                    <h4 className="h6 text-primary mb-3">
                      Priorização de Diagnóstico
                    </h4>
                    {planningOrder.length > 0 ? (
                      <ul className="list-group mb-3">
                        {planningOrder.map((item, index) => {
                          const key = `${item.parent}-${item.diagnosis}-${index}`;
                          return (
                            <li
                              key={key}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <span>
                                <strong>{item.parent}:</strong> {item.diagnosis}
                              </span>
                              <div>
                                <button
                                  className="btn btn-sm btn-outline-secondary me-1"
                                  onClick={() => moveUp(index)}
                                >
                                  ↑
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => moveDown(index)}
                                >
                                  ↓
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-muted">
                        Nenhum diagnóstico selecionado.
                      </p>
                    )}
                    <button
                      className="btn btn-primary"
                      onClick={() => setPlanningSubmitted(true)}
                    >
                      Prosseguir
                    </button>
                  </div>
                )}
                {planningSubmitted && (
                  <div className="planning-blocks">
                    {planningOrder.map((item, index) => {
                      const key = `${item.parent}-${item.diagnosis}-${index}`;
                      return (
                        <div key={key} className="card mb-3">
                          <div className="card-header">
                            <strong>{item.parent}:</strong> {item.diagnosis}
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6">
                                <label className="form-label">
                                  Determinação de resultados esperados
                                </label>
                                <select
                                  className="form-control"
                                  value={
                                    planningSelections[key]?.expectedResult ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleExpectedResultChange(
                                      key,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">
                                    Selecione um resultado esperado
                                  </option>
                                  {dummyExpectedResults.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">
                                  Prescrição de Enfermagem
                                </label>
                                <select
                                  multiple
                                  className="form-control"
                                  value={
                                    planningSelections[key]?.interventions || []
                                  }
                                  onChange={(e) =>
                                    handleInterventionsChange(
                                      key,
                                      e.target.options
                                    )
                                  }
                                >
                                  {dummyInterventions.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="mt-2">
                              <button
                                className="btn btn-link"
                                title="Não encontrei o resultado esperado ou intervenção que eu procurava"
                              >
                                <Info size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="d-flex justify-content-between pt-3">
                  <button
                    className="btn btn-outline-primary d-flex align-items-center"
                    onClick={() => setCurrentStep("diagnostico")}
                  >
                    <span>Voltar para: Diagnóstico de Enfermagem</span>
                  </button>
                  <button className="btn btn-outline-primary d-flex align-items-center">
                    <span>Continuar depois</span>
                  </button>
                  <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => setCurrentStep("implementacao")}
                  >
                    <span>Implementação de Enfermagem</span>
                    <ArrowRight size={16} className="ms-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Implementação Content */}
            {currentStep === "implementacao" && (
              <div className="implementacao-content">
                <h3 className="h5 text-primary mb-3">
                  Implementação de Enfermagem
                </h3>
                <p className="text-muted">
                  Compreende a realização das intervenções, ações e atividades previstas no planejamento assistencial, pela equipe de enfermagem, respeitando as resoluções/pareceres do Conselho Federal e Conselhos Regionais de Enfermagem quanto a competência técnica de cada profissional, por meio da colaboração e comunicação contínua, inclusive com a checagem quanto à execução da prescrição de enfermagem.
                </p>
                {getFlattenedDiagnoses().length > 0 ? (
                  getFlattenedDiagnoses().map((item, index) => {
                    const key = `${item.parent}-${item.diagnosis}-${index}`;
                    // Use interventions from implementationSelections (editable)
                    const interventions =
                      implementationSelections[key]?.interventions || [];
                    return (
                      <div key={key} className="card mb-3">
                        <div className="card-header">
                          <strong>{item.parent}:</strong> {item.diagnosis}
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col">
                              <label className="form-label">
                                Selecione intervenções a implementar
                              </label>
                              <select
                                multiple
                                className="form-control"
                                value={interventions}
                                onChange={(e) => {
                                  const values = Array.from(e.target.options)
                                    .filter((opt) => opt.selected)
                                    .map((opt) => opt.value);
                                  setImplementationSelections((prev) => ({
                                    ...prev,
                                    [key]: {
                                      ...prev[key],
                                      interventions: values,
                                    },
                                  }));
                                }}
                              >
                                {dummyInterventions.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted">
                    Nenhum diagnóstico para implementar.
                  </p>
                )}
                <div className="d-flex justify-content-between pt-3">
                  <button
                    className="btn btn-outline-primary d-flex align-items-center"
                    onClick={() => setCurrentStep("planejamento")}
                  >
                    <span>Voltar para: Planejamento de Enfermagem</span>
                  </button>
                  <button className="btn btn-outline-primary d-flex align-items-center">
                    <span>Continuar depois</span>
                  </button>
                  <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => {
                      const flattened = getFlattenedDiagnoses();
                      if (
                        flattened.length === 0 ||
                        flattened.some((item, index) => {
                          const key = `${item.parent}-${item.diagnosis}-${index}`;
                          return (
                            !implementationSelections[key] ||
                            !implementationSelections[key].interventions ||
                            implementationSelections[key].interventions
                              .length === 0
                          );
                        })
                      ) {
                        alert(
                          "Selecione intervenções na etapa de Implementação antes de prosseguir para a Evolução."
                        );
                      } else {
                        setCurrentStep("evolucao");
                      }
                    }}
                  >
                    <span>Evolução de Enfermagem</span>
                    <ArrowRight size={16} className="ms-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Evolução Content */}
            {currentStep === "evolucao" && (
              <div className="evolucao-content">
                <h3 className="h5 text-primary mb-3">Evolução de Enfermagem</h3>
                <p className="text-muted">
                  Compreende a avaliação dos resultados alcançados de enfermagem e saúde da pessoa, família, coletividade e grupos especiais. Esta etapa permite a análise e a revisão de todo o Processo de Enfermagem.
                </p>
                <pre className="evolution-text">{evolutionText}</pre>
                <div className="mb-3">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigator.clipboard.writeText(evolutionText)}
                  >
                    Copiar evolução para área de transferência
                  </button>
                </div>
                <div className="d-flex justify-content-between pt-3">
                  <button
                    className="btn btn-outline-primary d-flex align-items-center"
                    onClick={() => setCurrentStep("implementacao")}
                  >
                    <span>Voltar para: Implementação de Enfermagem</span>
                  </button>
                  <button className="btn btn-outline-primary d-flex align-items-center">
                    <span>Continuar depois</span>
                  </button>
                  <button className="btn btn-primary d-flex align-items-center">
                    <span>Finalizar Processo de Enfermagem</span>
                    <ArrowRight size={16} className="ms-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Avaliação Content (existing content) */}
            {currentStep === "avaliacao" && (
              <div className="avaliacao-content">
                <h3 className="h5 text-primary mb-3">Avaliação de Enfermagem</h3>
                <p className="text-muted">
                  Compreende a coleta de dados subjetivos (entrevista) e objetivos (exame físico) inicial e contínua pertinentes à saúde da pessoa, da família, coletividade e grupos especiais, realizada mediante auxílio de técnicas (laboratorial e de imagem, testes clínicos, escalas de avaliação validadas, protocolos institucionais e outros) para a obtenção de informações sobre as necessidades do cuidado de Enfermagem e saúde relevantes para a prática.
                </p>
                <div className="mb-4">
                  <h3 className="h5 text-primary mb-3">
                    Dados Subjetivos (Entrevista)
                  </h3>
                  <textarea
                    placeholder="Registre aqui as informações da entrevista com o paciente..."
                    className="form-control"
                    rows="5"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <h3 className="h5 text-primary mb-3">Dados Objetivos</h3>
                  <div className="bg-light rounded-lg p-3 mb-4">
                    <h4 className="h6 text-primary mb-3">Sinais Vitais</h4>
                    <div className="row g-3">
                      <div className="col-6 col-md-4">
                        <label className="form-label">PAS (mmHg)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="PAS"
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label">PAD (mmHg)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="PAD"
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label">FC (bpm)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="FC"
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label">FR (irpm)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="FR"
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label">Glasgow</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Glasgow"
                          min="3"
                          max="15"
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label">SpO² (%)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="SpO²"
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label">Peso (kg)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Peso"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label">Altura (cm)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Altura"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label">IMC</label>
                        <div className="d-flex align-items-center">
                          <input
                            type="number"
                            className="form-control me-2"
                            placeholder="IMC"
                            value={imc}
                            readOnly
                            style={{ maxWidth: "80px" }}
                          />
                          {(() => {
                            const { label, color } = getIMCClassification(imc);
                            if (!label) return null;
                            return (
                              <span style={{ color, fontWeight: "bold" }}>
                                {label}
                              </span>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="col-6 col-md-4">
                        <label className="form-label">
                          Circunferência Abdominal (cm)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Circunferência Abdominal"
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label">HGT (mg/dL)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="HGT"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="h6 text-primary mb-3">Psicossocial</h4>
                    <textarea
                      placeholder="História familiar, rede de apoio, trabalho, educação..."
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <h4 className="h6 text-primary mb-3">Comorbidades</h4>
                    <textarea
                      placeholder="Liste as comorbidades do paciente..."
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <h4 className="h6 text-primary mb-3">
                      Exames Laboratoriais
                    </h4>
                    <textarea
                      placeholder="Registre os resultados dos exames laboratoriais..."
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <h4 className="h6 text-primary mb-3">
                      Medicamentos em Uso
                    </h4>
                    <textarea
                      placeholder="Liste os medicamentos em uso..."
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <h4 className="h6 text-primary mb-3">Exame Físico</h4>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label">Exame Físico Geral</label>
                        <textarea className="form-control" rows="3"></textarea>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Neurológico</label>
                        <textarea className="form-control" rows="3"></textarea>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Cardiovascular</label>
                        <textarea className="form-control" rows="3"></textarea>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Respiratório</label>
                        <textarea className="form-control" rows="3"></textarea>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Gastrointestinal</label>
                        <textarea className="form-control" rows="3"></textarea>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Musculoesquelético</label>
                        <textarea className="form-control" rows="3"></textarea>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Genital</label>
                        <textarea className="form-control" rows="3"></textarea>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Psicológico</label>
                        <textarea className="form-control" rows="3"></textarea>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Social</label>
                        <textarea className="form-control" rows="3"></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between pt-3">
                    <button className="btn btn-outline-primary d-flex align-items-center">
                      <span>Continuar depois</span>
                    </button>
                    <button
                      className="btn btn-primary d-flex align-items-center"
                      onClick={() => setCurrentStep("diagnostico")}
                    >
                      <span>Diagnóstico de Enfermagem</span>
                      <ArrowRight size={16} className="ms-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProcessoEnfermagem;
