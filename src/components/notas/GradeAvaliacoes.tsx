import { useMemo, useState } from "react";
import type { Avaliacao, Escola, GradeCurricular, Materia, Periodo, Turma } from "../../types";
import CardAvaliacaoResumo from "../avaliacoes/CardAvaliacaoResumo";
import "./GradeAvaliacoes.css";

export interface ItemAvaliacaoResumo {
  avaliacao: Avaliacao;
  nomeMateria: string;
  media: number | null;
  notasLancadas: number;
  totalAlunos: number;
}

export interface GradeAvaliacoesProps {
  escolas: Escola[];
  turmas: Turma[];
  gradesDaTurma: GradeCurricular[];
  materias: Materia[];
  periodos: Periodo[];
  turmaSelecionada: number | "";
  gradeSelecionada: number | "";
  periodoSelecionado: number | "";
  aoMudarTurma: (turmaId: number | "") => void;
  aoMudarGrade: (gradeId: number | "") => void;
  aoMudarPeriodo: (periodoId: number | "") => void;
  itens: ItemAvaliacaoResumo[];
  aoLancarNotas: (idAvaliacao: number) => void;
}

function GradeAvaliacoes({
  escolas,
  turmas,
  gradesDaTurma,
  materias,
  periodos,
  turmaSelecionada,
  gradeSelecionada,
  periodoSelecionado,
  aoMudarTurma,
  aoMudarGrade,
  aoMudarPeriodo,
  itens,
  aoLancarNotas,
}: GradeAvaliacoesProps) {
  const [filtroEscola, setFiltroEscola] = useState("todas"); // "todas" ou o idEscola como texto

  const mapaTurmas = useMemo(() => new Map(turmas.map((t) => [t.idTurma, t])), [turmas]);
  const mapaMaterias = useMemo(() => new Map(materias.map((m) => [m.idMateria, m])), [materias]);
  const turmasVisiveis = useMemo(
    () =>
      filtroEscola === "todas"
        ? turmas
        : turmas.filter((turma) => String(turma.escolaId) === filtroEscola),
    [turmas, filtroEscola]
  );

  function mudarEscola(novaEscola: string) {
    setFiltroEscola(novaEscola);
    const turmaAtual = turmaSelecionada === "" ? undefined : mapaTurmas.get(turmaSelecionada);
    if (turmaAtual && novaEscola !== "todas" && String(turmaAtual.escolaId) !== novaEscola) {
      aoMudarTurma("");
    }
  }

  return (
    <section className="grade-avaliacoes">
      <header className="grade-avaliacoes__cabecalho">
        <h2>Gestão de Notas</h2>
      </header>

      <div className="grade-avaliacoes__filtros">
        <label className="grade-avaliacoes__campo">
          <span>Escola</span>
          <select value={filtroEscola} onChange={(evento) => mudarEscola(evento.target.value)}>
            <option value="todas">Todas as escolas</option>
            {escolas.map((escola) => (
              <option key={escola.idEscola} value={escola.idEscola}>
                {escola.nomeEscola}
              </option>
            ))}
          </select>
        </label>

        <label className="grade-avaliacoes__campo">
          <span>Turma *</span>
          <select
            value={turmaSelecionada}
            onChange={(evento) =>
              aoMudarTurma(evento.target.value ? Number(evento.target.value) : "")
            }
          >
            <option value="">Selecione a turma...</option>
            {turmasVisiveis.map((turma) => (
              <option key={turma.idTurma} value={turma.idTurma}>
                {turma.nomeTurma}
              </option>
            ))}
          </select>
        </label>

        <label className="grade-avaliacoes__campo">
          <span>Disciplina</span>
          <select
            value={gradeSelecionada}
            onChange={(evento) =>
              aoMudarGrade(evento.target.value ? Number(evento.target.value) : "")
            }
            disabled={turmaSelecionada === ""}
          >
            <option value="">
              {turmaSelecionada === "" ? "Selecione a turma primeiro..." : "Todas as disciplinas"}
            </option>
            {gradesDaTurma.map((grade) => (
              <option key={grade.idGrade} value={grade.idGrade}>
                {mapaMaterias.get(grade.materiaId)?.nomeMateria ?? "Matéria"}
              </option>
            ))}
          </select>
        </label>

        <label className="grade-avaliacoes__campo">
          <span>Período letivo</span>
          <select
            value={periodoSelecionado}
            onChange={(evento) =>
              aoMudarPeriodo(evento.target.value ? Number(evento.target.value) : "")
            }
          >
            <option value="">Todos os períodos</option>
            {periodos.map((periodo) => (
              <option key={periodo.idPeriodo} value={periodo.idPeriodo}>
                {periodo.nomePeriodo} ({periodo.ano})
              </option>
            ))}
          </select>
        </label>
      </div>

      {turmaSelecionada === "" ? (
        <p className="grade-avaliacoes__vazio-geral">
          Selecione uma turma para ver as avaliações cadastradas.
        </p>
      ) : itens.length === 0 ? (
        <p className="grade-avaliacoes__vazio-geral">
          Nenhuma avaliação encontrada para esses filtros.
        </p>
      ) : (
        <div className="grade-avaliacoes__grade">
          {itens.map(({ avaliacao, nomeMateria, media, notasLancadas, totalAlunos }) => (
            <CardAvaliacaoResumo
              key={avaliacao.idAvaliacao}
              avaliacao={avaliacao}
              nomeMateria={nomeMateria}
              media={media}
              notasLancadas={notasLancadas}
              totalAlunos={totalAlunos}
              aoLancarNotas={() => aoLancarNotas(avaliacao.idAvaliacao)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default GradeAvaliacoes;