import { useState, type FormEvent } from "react";
import type {
  Avaliacao,
  AvaliacaoEntrada,
  TipoAvaliacao,
  GradeCurricular,
  Materia,
  Turma,
  Periodo,
} from "../../types";
import "./FormularioAvaliacao.css";

interface FormularioAvaliacaoProps {
  avaliacaoEditando?: Avaliacao | null;
  /** Grades curriculares cadastradas, para o <select> (rotulado com matéria+turma). */
  grades: GradeCurricular[];
  materias: Materia[];
  turmas: Turma[];
  /** Períodos letivos cadastrados, para o <select> de período. */
  periodos: Periodo[];
  salvar: (dados: AvaliacaoEntrada) => void;
  cancelar: () => void;
}

function rotuloGrade(grade: GradeCurricular, materias: Materia[], turmas: Turma[]): string {
  const materia = materias.find((item) => item.idMateria === grade.materiaIdMateria);
  const turma = turmas.find((item) => item.idTurma === grade.turmaIdTurma);
  return `${materia?.nomeMateria ?? "Matéria"} — ${turma?.nomeTurma ?? "Turma"}`;
}

function FormularioAvaliacao({
  avaliacaoEditando,
  grades,
  materias,
  turmas,
  periodos,
  salvar,
  cancelar,
}: FormularioAvaliacaoProps) {
  const [gradeIdGrade, setGradeIdGrade] = useState(
    avaliacaoEditando?.gradeIdGrade ?? grades[0]?.idGrade ?? 0
  );
  const [periodoIdPeriodo, setPeriodoIdPeriodo] = useState(
    avaliacaoEditando?.periodoIdPeriodo ?? periodos[0]?.idPeriodo ?? 0
  );
  const [nomeAvaliacao, setNomeAvaliacao] = useState(avaliacaoEditando?.nomeAvaliacao ?? "");
  const [tipo, setTipo] = useState<TipoAvaliacao>(avaliacaoEditando?.tipo ?? "Prova");
  const [dataAvaliacao, setDataAvaliacao] = useState(avaliacaoEditando?.dataAvaliacao ?? "");
  const [peso, setPeso] = useState(avaliacaoEditando?.peso?.toString() ?? "1.00");
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!gradeIdGrade || !periodoIdPeriodo || !nomeAvaliacao.trim()) {
      setErro("Grade curricular, período e nome da avaliação são obrigatórios.");
      return;
    }

    setErro(null);
    salvar({
      gradeIdGrade: Number(gradeIdGrade),
      periodoIdPeriodo: Number(periodoIdPeriodo),
      nomeAvaliacao: nomeAvaliacao.trim(),
      tipo,
      dataAvaliacao: dataAvaliacao || undefined,
      peso: peso ? Number(peso) : undefined,
    });
  }

  return (
    <section className="formulario-avaliacao">
      <header className="formulario-avaliacao__cabecalho">
        <h2>{avaliacaoEditando ? "Editar Avaliação" : "Nova Avaliação"}</h2>
      </header>

      <form className="formulario-avaliacao__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-avaliacao__campo formulario-avaliacao__campo--largo">
          <span>Grade curricular (matéria — turma) *</span>
          <select
            value={gradeIdGrade}
            onChange={(evento) => setGradeIdGrade(Number(evento.target.value))}
          >
            {grades.length === 0 && <option value={0}>Nenhuma grade cadastrada</option>}
            {grades.map((grade) => (
              <option key={grade.idGrade} value={grade.idGrade}>
                {rotuloGrade(grade, materias, turmas)}
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-avaliacao__campo formulario-avaliacao__campo--largo">
          <span>Nome da avaliação *</span>
          <input
            type="text"
            value={nomeAvaliacao}
            onChange={(evento) => setNomeAvaliacao(evento.target.value)}
            placeholder="Ex.: Prova Bimestral 1"
            maxLength={100}
          />
        </label>

        <label className="formulario-avaliacao__campo">
          <span>Período letivo *</span>
          <select
            value={periodoIdPeriodo}
            onChange={(evento) => setPeriodoIdPeriodo(Number(evento.target.value))}
          >
            {periodos.length === 0 && <option value={0}>Nenhum período cadastrado</option>}
            {periodos.map((periodo) => (
              <option key={periodo.idPeriodo} value={periodo.idPeriodo}>
                {periodo.nomePeriodo} ({periodo.ano})
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-avaliacao__campo">
          <span>Tipo *</span>
          <select value={tipo} onChange={(evento) => setTipo(evento.target.value as TipoAvaliacao)}>
            <option value="Prova">Prova</option>
            <option value="Trabalho">Trabalho</option>
            <option value="Seminario">Seminário</option>
            <option value="Participacao">Participação</option>
            <option value="Outro">Outro</option>
          </select>
        </label>

        <label className="formulario-avaliacao__campo">
          <span>Data da avaliação</span>
          <input
            type="date"
            value={dataAvaliacao}
            onChange={(evento) => setDataAvaliacao(evento.target.value)}
          />
        </label>

        <label className="formulario-avaliacao__campo">
          <span>Peso</span>
          <input
            type="number"
            value={peso}
            onChange={(evento) => setPeso(evento.target.value)}
            min={0}
            max={99.99}
            step="0.01"
          />
        </label>

        {erro && (
          <p className="formulario-avaliacao__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-avaliacao__acoes">
          <button
            type="button"
            className="formulario-avaliacao__botao-cancelar"
            onClick={cancelar}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-avaliacao__botao-salvar">
            {avaliacaoEditando ? "Salvar alterações" : "Cadastrar avaliação"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioAvaliacao;
