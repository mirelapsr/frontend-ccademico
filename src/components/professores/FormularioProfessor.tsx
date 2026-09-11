import { useState, type FormEvent } from "react";
import type { Escola, Professor, ProfessorEntrada, SituacaoProfessor } from "../../types";
import { limparCpf } from "../../utils/formatadores";
import "./FormularioProfessor.css";

interface FormularioProfessorProps {
  professorEditando?: Professor | null;
  /** Escolas disponíveis no localStorage, para o <select> de vínculo. */
  escolas: Escola[];
  salvar: (dados: ProfessorEntrada) => void;
  cancelar: () => void;
}

function FormularioProfessor({
  professorEditando,
  escolas,
  salvar,
  cancelar,
}: FormularioProfessorProps) {
  const [nomeProf, setNomeProf] = useState(professorEditando?.nomeProf ?? "");
  const [cpfProf, setCpfProf] = useState(professorEditando?.cpfProf ?? "");
  const [telefoneProf, setTelefoneProf] = useState(professorEditando?.telefoneProf ?? "");
  const [emailProf, setEmailProf] = useState(professorEditando?.emailProf ?? "");
  const [cepProf, setCepProf] = useState(professorEditando?.cepProf ?? "");
  const [enderecoProf, setEnderecoProf] = useState(professorEditando?.enderecoProf ?? "");
  const [situacao, setSituacao] = useState<SituacaoProfessor>(
    professorEditando?.situacao ?? "Ativo"
  );
  const [escolaIdEscola, setEscolaIdEscola] = useState(
    professorEditando?.escolaIdEscola ?? escolas[0]?.idEscola ?? 0
  );
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!nomeProf.trim() || !escolaIdEscola) {
      setErro("Nome e escola são obrigatórios.");
      return;
    }

    setErro(null);
    salvar({
      nomeProf: nomeProf.trim(),
      cpfProf: cpfProf.trim() ? limparCpf(cpfProf) : null,
      telefoneProf: telefoneProf.trim() || null,
      emailProf: emailProf.trim() || null,
      cepProf: cepProf.trim() || null,
      enderecoProf: enderecoProf.trim() || null,
      situacao,
      escolaIdEscola: Number(escolaIdEscola),
    });
  }

  return (
    <section className="formulario-professor">
      <header className="formulario-professor__cabecalho">
        <h2>{professorEditando ? "Editar Professor" : "Novo Professor"}</h2>
      </header>

      <form className="formulario-professor__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-professor__campo formulario-professor__campo--largo">
          <span>Nome completo *</span>
          <input
            value={nomeProf}
            onChange={(evento) => setNomeProf(evento.target.value)}
            placeholder="Ex.: Maria da Silva Rocha"
          />
        </label>

        <label className="formulario-professor__campo">
          <span>CPF *</span>
          <input
            value={cpfProf}
            onChange={(evento) => setCpfProf(evento.target.value)}
            placeholder="000.000.000-00"
          />
        </label>

        <label className="formulario-professor__campo">
          <span>Telefone</span>
          <input
            value={telefoneProf}
            onChange={(evento) => setTelefoneProf(evento.target.value)}
            placeholder="86 99999-0000"
          />
        </label>

        <label className="formulario-professor__campo">
          <span>E-mail</span>
          <input
            type="email"
            value={emailProf}
            onChange={(evento) => setEmailProf(evento.target.value)}
            placeholder="nome@escola.edu.br"
          />
        </label>

        <label className="formulario-professor__campo">
          <span>CEP</span>
          <input
            value={cepProf}
            onChange={(evento) => setCepProf(evento.target.value)}
            placeholder="64000-000"
          />
        </label>

        <label className="formulario-professor__campo formulario-professor__campo--largo">
          <span>Endereço</span>
          <input
            value={enderecoProf}
            onChange={(evento) => setEnderecoProf(evento.target.value)}
            placeholder="Rua, número — bairro, cidade/UF"
          />
        </label>

        <label className="formulario-professor__campo">
          <span>Situação *</span>
          <select
            value={situacao}
            onChange={(evento) => setSituacao(evento.target.value as SituacaoProfessor)}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </label>

        <label className="formulario-professor__campo">
          <span>Escola *</span>
          <select
            value={escolaIdEscola}
            onChange={(evento) => setEscolaIdEscola(Number(evento.target.value))}
          >
            {escolas.length === 0 && <option value={0}>Nenhuma escola cadastrada</option>}
            {escolas.map((escola) => (
              <option key={escola.idEscola} value={escola.idEscola}>
                {escola.nomeEscola}
              </option>
            ))}
          </select>
        </label>

        {erro && (
          <p className="formulario-professor__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-professor__acoes">
          <button
            type="button"
            className="formulario-professor__botao-cancelar"
            onClick={cancelar}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-professor__botao-salvar">
            {professorEditando ? "Salvar alterações" : "Cadastrar professor"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioProfessor;
