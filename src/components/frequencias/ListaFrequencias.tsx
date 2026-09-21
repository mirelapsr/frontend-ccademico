import { useMemo, useState } from "react";
import type {
  Frequencia,
  StatusFrequencia,
  Matricula,
  Aluno,
  GradeCurricular,
  Materia,
  Turma,
} from "../../types";
import CardFrequencia from "./CardFrequencia";
import "./ListaFrequencias.css";

interface ListaFrequenciasProps {
  frequencias: Frequencia[];
  matriculas: Matricula[];
  alunos: Aluno[];
  grades: GradeCurricular[];
  materias: Materia[];
  turmas: Turma[];
  aoNovaFrequencia: () => void;
  aoEditarFrequencia: (idFrequencia: number) => void;
  aoExcluirFrequencia: (idFrequencia: number) => void;
}

type FiltroStatus = "todos" | StatusFrequencia;

function ListaFrequencias({
  frequencias,
  matriculas,
  alunos,
  grades,
  materias,
  turmas,
  aoNovaFrequencia,
  aoEditarFrequencia,
  aoExcluirFrequencia,
}: ListaFrequenciasProps) {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos");
  const [filtroData, setFiltroData] = useState("");

  const frequenciasFiltradas = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();

    return frequencias
      .filter((frequencia) => {
        const matricula = matriculas.find((item) => item.idMatricula === frequencia.matriculaIdMatricula);
        const aluno = matricula ? alunos.find((item) => item.idAluno === matricula.alunoIdAluno) : undefined;
        const grade = grades.find((item) => item.idGrade === frequencia.gradeIdGrade);
        const materia = grade ? materias.find((item) => item.idMateria === grade.materiaIdMateria) : undefined;
        const turma = matricula ? turmas.find((item) => item.idTurma === matricula.turmaIdTurma) : undefined;

        const combinaBusca =
          buscaNormalizada === "" ||
          (aluno?.nomeAluno ?? "").toLowerCase().includes(buscaNormalizada) ||
          (materia?.nomeMateria ?? "").toLowerCase().includes(buscaNormalizada) ||
          (turma?.nomeTurma ?? "").toLowerCase().includes(buscaNormalizada);

        const combinaStatus = filtroStatus === "todos" || frequencia.status === filtroStatus;
        const combinaData = filtroData === "" || frequencia.dataAula === filtroData;

        return combinaBusca && combinaStatus && combinaData;
      })
      .sort((a, b) => b.dataAula.localeCompare(a.dataAula));
  }, [frequencias, matriculas, alunos, grades, materias, turmas, busca, filtroStatus, filtroData]);

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
          value={filtroStatus}
          onChange={(evento) => setFiltroStatus(evento.target.value as FiltroStatus)}
          aria-label="Filtrar por status"
        >
          <option value="todos">Todos os status</option>
          <option value="Presente">Presente</option>
          <option value="Ausente">Ausente</option>
          <option value="Justificado">Justificado</option>
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
              matriculas={matriculas}
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
