import type { Avaliacao, GradeCurricular, Materia, Periodo, Turma } from "../../types";
import CardAvaliacaoResumo from "./CardAvaliacaoResumo";
import "./GradeAvaliacoes.css";

export interface ItemAvaliacaoResumo {
  avaliacao: Avaliacao;
  nomeMateria: string;
  media: number | null;
  notasLancadas: number;
  totalAlunos: number;
}

interface GradeAvaliacoesProps {
  turmas: Turma[];
  gradesDaTurma: GradeCurricular[];
  materias: Materia[];
  periodos: Periodo[];
  turmaSelecionada: number | "";
  gradeSelecionada: number | "";
  periodoSelecionado: number | "";
  aoMudarTurma: (turmaIdTurma: number | "") => void;
  aoMudarGrade: (gradeIdGrade: number | "") => void;
  aoMudarPeriodo: (periodoIdPeriodo: number | "") => void;
  itens: ItemAvaliacaoResumo[];
  aoLancarNotas: (idAvaliacao: number) => void;
}

function nomeMateriaPorGrade(
  gradesDaTurma: GradeCurricular[],
  materias: Materia[],
  idGrade: number
): string {
  const grade = gradesDaTurma.find((item) => item.idGrade === idGrade);
  if (!grade) return "Matéria";
  return materias.find((materia) => materia.idMateria === grade.materiaIdMateria)?.nomeMateria ?? "Matéria";
}

function GradeAvaliacoes({
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
  return (
    <section className="grade-avaliacoes">
      <header className="grade-avaliacoes__cabecalho">
        <h2>Gestão de Notas</h2>
      </header>

      <div className="grade-avaliacoes__filtros">
        <label className="grade-avaliacoes__campo">
          <span>Turma *</span>
          <select
            value={turmaSelecionada}
            onChange={(evento) =>
              aoMudarTurma(evento.target.value ? Number(evento.target.value) : "")
            }
          >
            <option value="">Selecione a turma...</option>
            {turmas.map((turma) => (
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
                {nomeMateriaPorGrade(gradesDaTurma, materias, grade.idGrade)}
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
