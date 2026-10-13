import { useMemo, useState } from "react";
import type {
  Frequencia,
  SituacaoFrequencia,
  Aluno,
  GradeCurricular,
  Materia,
  Turma,
} from "../../types";
import CardFrequencia from "./CardFrequencia";
import "./ListaFrequencias.css";

interface ListaFrequenciasProps {
  frequencias: Frequencia[];
  alunos: Aluno[];
  grades: GradeCurricular[];
  materias: Materia[];
  turmas: Turma[];
  aoNovaFrequencia: () => void;
  aoEditarFrequencia: (idFrequencia: number) => void;
  aoExcluirFrequencia: (idFrequencia: number) => void;
}

type FiltroSituacao = "todos" | SituacaoFrequencia;

function ListaFrequencias({
  frequencias,
  alunos,
  grades,
  materias,
  turmas,
  aoNovaFrequencia,
  aoEditarFrequencia,
  aoExcluirFrequencia,
}: ListaFrequenciasProps) {
  const [busca, setBusca] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState<FiltroSituacao>("todos");
  const [filtroData, setFiltroData] = useState("");

  const frequenciasFiltradas = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();

    return frequencias
      .filter((frequencia) => {
        const aluno = alunos.find((item) => item.idAluno === frequencia.alunoId);
        const grade = grades.find((item) => item.idGrade === frequencia.gradeId);
        const materia = grade ? materias.find((item) => item.idMateria === grade.materiaId) : undefined;
        const turma = grade ? turmas.find((item) => item.idTurma === grade.turmaId) : undefined;

        const combinaBusca =
          buscaNormalizada === "" ||
          (aluno?.nomeAluno ?? "").toLowerCase().includes(buscaNormalizada) ||
          (materia?.nomeMateria ?? "").toLowerCase().includes(buscaNormalizada) ||
          (turma?.nomeTurma ?? "").toLowerCase().includes(buscaNormalizada);

        const combinaSituacao = filtroSituacao === "todos" || frequencia.situacao === filtroSituacao;
        const combinaData = filtroData === "" || frequencia.dataFrequencia === filtroData;

        return combinaBusca && combinaSituacao && combinaData;
      })
      .sort((a, b) => b.dataFrequencia.localeCompare(a.dataFrequencia));
  }, [frequencias, alunos, grades, materias, turmas, busca, filtroSituacao, filtroData]);

  return (
    <section className="lista-frequencias">
      <header className="lista-frequencias__cabecalho">
        <h2>Registro de Frequência</h2>
        <button type="button" className="lista-frequencias__botao-novo" onClick={aoNovaFrequencia}>
          + Nova Frequência
        </button>
      </header>

      <div className="lista-frequencias__filtros">
        <label className="lista-frequencias__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por aluno, matéria ou turma..."
            aria-label="Buscar frequências"
          />
        </label>

        <input
          type="date"
          className="lista-frequencias__data"
          value={filtroData}
          onChange={(evento) => setFiltroData(evento.target.value)}
          aria-label="Filtrar por data da aula"
        />

        <select
          className="lista-frequencias__select"
          value={filtroSituacao}
          onChange={(evento) => setFiltroSituacao(evento.target.value as FiltroSituacao)}
          aria-label="Filtrar por situação"
        >
          <option value="todos">Todas as situações</option>
          <option value="Presente">Presente</option>
          <option value="Falta">Ausente</option>
          <option value="FaltaJustificada">Justificado</option>
        </select>
      </div>

      {frequenciasFiltradas.length === 0 ? (
        <p className="lista-frequencias__vazio-geral">
          {frequencias.length === 0
            ? "Nenhum registro de frequência cadastrado ainda."
            : "Nenhum registro encontrado para esses filtros."}
        </p>
      ) : (
        <div className="lista-frequencias__grade">
          {frequenciasFiltradas.map((frequencia) => (
            <CardFrequencia
              key={frequencia.idFrequencia}
              frequencia={frequencia}
              alunos={alunos}
              turmas={turmas}
              grades={grades}
              materias={materias}
              aoEditar={() => aoEditarFrequencia(frequencia.idFrequencia)}
              aoExcluir={() => aoExcluirFrequencia(frequencia.idFrequencia)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaFrequencias;

function IconeBusca() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
      <circle cx="9" cy="9" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <line
        x1="13.8"
        y1="13.8"
        x2="18.2"
        y2="18.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}