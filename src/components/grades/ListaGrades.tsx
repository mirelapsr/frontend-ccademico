import { useMemo, useState } from "react";
import type { Escola, GradeCurricular, Turma, Materia, Professor } from "../../types";
import CardGradeCurricular from "./CardGradeCurricular";
import "./ListaGrades.css";

interface ListaGradesProps {
  grades: GradeCurricular[];
  escolas: Escola[];
  turmas: Turma[];
  materias: Materia[];
  professores: Professor[];
  carregando: boolean;
  erro: string | null;
  aoDispensarErro: () => void;
  aoRecarregar: () => void;
  aoNovaGrade: () => void;
  aoEditarGrade: (idGrade: number) => void;
  aoExcluirGrade: (idGrade: number) => void;
}

function ListaGrades({
  grades,
  escolas,
  turmas,
  materias,
  professores,
  carregando,
  erro,
  aoDispensarErro,
  aoRecarregar,
  aoNovaGrade,
  aoEditarGrade,
  aoExcluirGrade,
}: ListaGradesProps) {
  const [busca, setBusca] = useState("");
  const [filtroAno, setFiltroAno] = useState<"todos" | number>("todos");
  const [filtroTurma, setFiltroTurma] = useState("todas"); // "todas" ou o idTurma como texto
  const [filtroEscola, setFiltroEscola] = useState("todas"); // "todas" ou o idEscola como texto

  const mapaTurmas = useMemo(() => new Map(turmas.map((t) => [t.idTurma, t])), [turmas]);
  const mapaMaterias = useMemo(() => new Map(materias.map((m) => [m.idMateria, m])), [materias]);
  const mapaProfessores = useMemo(
    () => new Map(professores.map((p) => [p.idProfessor, p])),
    [professores]
  );

  const turmasOrdenadas = useMemo(
    () =>
      [...turmas].sort(
        (a, b) => b.anoLetivo - a.anoLetivo || a.nomeTurma.localeCompare(b.nomeTurma, "pt-BR")
      ),
    [turmas]
  );

  const turmasVisiveis = useMemo(
    () =>
      filtroEscola === "todas"
        ? turmasOrdenadas
        : turmasOrdenadas.filter((turma) => String(turma.escolaId) === filtroEscola),
    [turmasOrdenadas, filtroEscola]
  );

  // Cascata: descarta a turma escolhida se ela não pertence à nova escola.
  function mudarEscola(novaEscola: string) {
    setFiltroEscola(novaEscola);
    const turmaAtual = filtroTurma === "todas" ? undefined : mapaTurmas.get(Number(filtroTurma));
    if (turmaAtual && novaEscola !== "todas" && String(turmaAtual.escolaId) !== novaEscola) {
      setFiltroTurma("todas");
    }
  }

  const anosDisponiveis = useMemo(() => {
    const anos = grades
      .map((g) => mapaTurmas.get(g.turmaId)?.anoLetivo)
      .filter((ano): ano is number => typeof ano === "number");
    return Array.from(new Set(anos)).sort((a, b) => b - a);
  }, [grades, mapaTurmas]);

  const gradesFiltradas = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();

    return grades.filter((grade) => {
      const turma = mapaTurmas.get(grade.turmaId);
      const materia = mapaMaterias.get(grade.materiaId);
      const professor = mapaProfessores.get(grade.professorId);

      const combinaBusca =
        buscaNormalizada === "" ||
        (materia?.nomeMateria ?? "").toLowerCase().includes(buscaNormalizada) ||
        (turma?.nomeTurma ?? "").toLowerCase().includes(buscaNormalizada) ||
        (professor?.nomeProf ?? "").toLowerCase().includes(buscaNormalizada);

      const combinaFiltro = filtroAno === "todos" || turma?.anoLetivo === filtroAno;

      const combinaTurma = filtroTurma === "todas" || String(grade.turmaId) === filtroTurma;

      const combinaEscola = filtroEscola === "todas" || String(turma?.escolaId) === filtroEscola;

      return combinaBusca && combinaFiltro && combinaTurma && combinaEscola;
    });
  }, [grades, mapaTurmas, mapaMaterias, mapaProfessores, busca, filtroAno, filtroTurma, filtroEscola]);

  return (
    <section className="lista-grades">
      <header className="lista-grades__cabecalho">
        <h2>Grade Curricular</h2>
        <button type="button" className="lista-grades__botao-novo" onClick={aoNovaGrade}>
          + Nova Grade
        </button>
      </header>

      {erro && (
        <div className="lista-grades__alerta" role="alert">
          <p>{erro}</p>
          <div className="lista-grades__alerta-acoes">
            <button type="button" onClick={aoRecarregar} disabled={carregando}>
              Tentar novamente
            </button>
            <button
              type="button"
              className="lista-grades__alerta-fechar"
              onClick={aoDispensarErro}
              aria-label="Dispensar alerta"
            >
              ×
            </button>
          </div>
        </div>
      )}

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
          value={filtroEscola}
          onChange={(evento) => mudarEscola(evento.target.value)}
          aria-label="Filtrar por escola"
        >
          <option value="todas">Todas as escolas</option>
          {escolas.map((escola) => (
            <option key={escola.idEscola} value={escola.idEscola}>
              {escola.nomeEscola}
            </option>
          ))}
        </select>

        <select
          className="lista-grades__select"
          value={filtroTurma}
          onChange={(evento) => setFiltroTurma(evento.target.value)}
          aria-label="Filtrar por turma"
        >
          <option value="todas">Todas as turmas</option>
          {turmasVisiveis.map((turma) => (
            <option key={turma.idTurma} value={turma.idTurma}>
              {turma.nomeTurma} ({turma.anoLetivo})
            </option>
          ))}
        </select>

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

      {carregando ? (
        <p className="lista-grades__estado" role="status">
          A carregar grades curriculares...
        </p>
      ) : gradesFiltradas.length === 0 ? (
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
              aoEditar={aoEditarGrade}
              aoExcluir={aoExcluirGrade}
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