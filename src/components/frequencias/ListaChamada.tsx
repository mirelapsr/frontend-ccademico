import type { Aluno, GradeCurricular, Materia, SituacaoFrequencia, Turma } from "../../types";
import CardChamada from "./CardChamada";
import "./ListaChamada.css";

export interface LinhaChamada {
  aluno: Aluno;
  situacao: SituacaoFrequencia;
  justificativa: string;
}

interface ListaChamadaProps {
  turmas: Turma[];
  gradesDaTurma: GradeCurricular[];
  materias: Materia[];
  turmaSelecionada: number | "";
  gradeSelecionada: number | "";
  data: string;
  chamadaJaExiste: boolean;
  aoMudarTurma: (turmaId: number | "") => void;
  aoMudarGrade: (gradeId: number | "") => void;
  aoMudarData: (data: string) => void;
  aoDiaAnterior: () => void;
  aoHoje: () => void;
  aoProximoDia: () => void;
  linhas: LinhaChamada[];
  aoMudarSituacao: (alunoId: number, situacao: SituacaoFrequencia) => void;
  aoMudarJustificativa: (alunoId: number, justificativa: string) => void;
  aoMarcarTodosPresentes: () => void;
  aoSalvar: () => void;
}

function nomeMateria(materias: Materia[], materiaId: number): string {
  return materias.find((materia) => materia.idMateria === materiaId)?.nomeMateria ?? "Matéria";
}

function ListaChamada({
  turmas,
  gradesDaTurma,
  materias,
  turmaSelecionada,
  gradeSelecionada,
  data,
  chamadaJaExiste,
  aoMudarTurma,
  aoMudarGrade,
  aoMudarData,
  aoDiaAnterior,
  aoHoje,
  aoProximoDia,
  linhas,
  aoMudarSituacao,
  aoMudarJustificativa,
  aoMarcarTodosPresentes,
  aoSalvar,
}: ListaChamadaProps) {
  const prontoParaChamada = turmaSelecionada !== "" && gradeSelecionada !== "" && data !== "";

  return (
    <section className="lista-chamada">
      <header className="lista-chamada__cabecalho">
        <h2>Chamada de Frequência</h2>
      </header>

      <div className="lista-chamada__filtros">
        <label className="lista-chamada__campo">
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

        <label className="lista-chamada__campo">
          <span>Disciplina *</span>
          <select
            value={gradeSelecionada}
            onChange={(evento) =>
              aoMudarGrade(evento.target.value ? Number(evento.target.value) : "")
            }
            disabled={turmaSelecionada === ""}
          >
            <option value="">
              {turmaSelecionada === "" ? "Selecione a turma primeiro..." : "Selecione a disciplina..."}
            </option>
            {gradesDaTurma.map((grade) => (
              <option key={grade.idGrade} value={grade.idGrade}>
                {nomeMateria(materias, grade.materiaId)}
              </option>
            ))}
          </select>
        </label>

        <label className="lista-chamada__campo">
          <span>Data *</span>
          <div className="lista-chamada__data-com-navegacao">
            <input type="date" value={data} onChange={(evento) => aoMudarData(evento.target.value)} />
            <div className="lista-chamada__navegacao-data">
              <button type="button" onClick={aoDiaAnterior} title="Dia anterior">
                &lt; Dia Anterior
              </button>
              <button type="button" onClick={aoHoje} title="Ir para hoje">
                Hoje
              </button>
              <button type="button" onClick={aoProximoDia} title="Próximo dia">
                Próximo Dia &gt;
              </button>
            </div>
          </div>
        </label>
      </div>

      {prontoParaChamada && (
        <div
          className={`lista-chamada__badge${
            chamadaJaExiste ? " lista-chamada__badge--existente" : " lista-chamada__badge--nova"
          }`}
        >
          {chamadaJaExiste ? "Chamada já realizada nesta data" : "Nova Chamada"}
        </div>
      )}

      {!prontoParaChamada ? (
        <p className="lista-chamada__vazio-geral">
          Selecione turma, disciplina e data para abrir a lista de chamada.
        </p>
      ) : linhas.length === 0 ? (
        <p className="lista-chamada__vazio-geral">
          Nenhum aluno com matrícula ativa nesta turma.
        </p>
      ) : (
        <>
          <div className="lista-chamada__acoes-topo">
            <button
              type="button"
              className="lista-chamada__botao-secundario"
              onClick={aoMarcarTodosPresentes}
            >
              Marcar Todos como Presente
            </button>
          </div>

          <div className="lista-chamada__linhas">
            {linhas.map(({ aluno, situacao, justificativa }) => (
              <CardChamada
                key={aluno.idAluno}
                aluno={aluno}
                situacao={situacao}
                justificativa={justificativa}
                aoMudarSituacao={(novaSituacao) => aoMudarSituacao(aluno.idAluno, novaSituacao)}
                aoMudarJustificativa={(texto) => aoMudarJustificativa(aluno.idAluno, texto)}
              />
            ))}
          </div>

          <div className="lista-chamada__acoes-rodape">
            <button type="button" className="lista-chamada__botao-salvar" onClick={aoSalvar}>
              {chamadaJaExiste ? "Atualizar Chamada" : "Salvar Chamada"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default ListaChamada;