import { useMemo, useState } from "react";
import type { GradeCurricular, Turma, Materia, Professor } from "../../types";
import CardGradeCurricular from "./CardGradeCurricular";
import "./ListaGrades.css";

interface ListaGradesProps {
  grades: GradeCurricular[];
  turmas: Turma[];
  materias: Materia[];
  professores: Professor[];
  aoNovaGrade: () => void;
  aoEditarGrade: (idGrade: number) => void;
  aoExcluirGrade: (idGrade: number) => void;
}

function ListaGrades({
  grades,
  turmas,
  materias,
  professores,
  aoNovaGrade,
  aoEditarGrade,
  aoExcluirGrade,
}: ListaGradesProps) {
  const [busca, setBusca] = useState("");
  const [filtroAno, setFiltroAno] = useState<"todos" | number>("todos");

  const anosDisponiveis = useMemo(
    () => Array.from(new Set(grades.map((grade) => grade.anoLetivo))).sort((a, b) => b - a),
    [grades]
  );

  const gradesFiltradas = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();

    return grades.filter((grade) => {
      const turma = turmas.find((item) => item.idTurma === grade.turmaIdTurma);
      const materia = materias.find((item) => item.idMateria === grade.materiaIdMateria);
      const professor = professores.find((item) => item.idProfessor === grade.professorIdProfessor);

      const combinaBusca =
        buscaNormalizada === "" ||
        (materia?.nomeMateria ?? "").toLowerCase().includes(buscaNormalizada) ||
        (turma?.nomeTurma ?? "").toLowerCase().includes(buscaNormalizada) ||
        (professor?.nomeProf ?? "").toLowerCase().includes(buscaNormalizada);

      const combinaFiltro = filtroAno === "todos" || grade.anoLetivo === filtroAno;

      return combinaBusca && combinaFiltro;
    });
  }, [grades, turmas, materias, professores, busca, filtroAno]);

  return (
    <section className="lista-grades">
      <header className="lista-grades__cabecalho">
        <h2>Grade Curricular</h2>
        <button type="button" className="lista-grades__botao-novo" onClick={aoNovaGrade}>
          + Nova Grade
        </button>
      </header>

      <div className="lista-grades__filtros">
        <label className="lista-grades__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por matéria, turma ou professor..."
            aria-label="Buscar grades curriculares"
          />
        </label>

        <select
          className="lista-grades__select"
          value={filtroAno}
          onChange={(evento) =>
            setFiltroAno(evento.target.value === "todos" ? "todos" : Number(evento.target.value))
          }
          aria-label="Filtrar por ano letivo"
        >
          <option value="todos">Todos os anos letivos</option>
          {anosDisponiveis.map((ano) => (
            <option key={ano} value={ano}>
              {ano}
            </option>
          ))}
        </select>
      </div>

      {gradesFiltradas.length === 0 ? (
        <p className="lista-grades__vazio-geral">
          {grades.length === 0
            ? "Nenhuma grade curricular cadastrada ainda."
            : "Nenhuma grade encontrada para esses filtros."}
        </p>
      ) : (
        <div className="lista-grades__grade">
          {gradesFiltradas.map((grade) => (
            <CardGradeCurricular
              key={grade.idGrade}
              grade={grade}
              turmas={turmas}
              materias={materias}
              professores={professores}
              aoEditar={() => aoEditarGrade(grade.idGrade)}
              aoExcluir={() => aoExcluirGrade(grade.idGrade)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaGrades;

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
