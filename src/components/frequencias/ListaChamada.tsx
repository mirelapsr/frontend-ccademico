import type { Aluno, GradeCurricular, Materia, Matricula, StatusFrequencia, Turma } from "../../types";
import CardChamada from "./CardChamada";
import "./ListaChamada.css";

export interface LinhaChamada {
  matricula: Matricula;
  aluno: Aluno;
  status: StatusFrequencia;
  justificativa: string;
}

interface ListaChamadaProps {
  turmas: Turma[];
  gradesDaTurma: GradeCurricular[];
  materias: Materia[];
  turmaSelecionada: number | "";
  gradeSelecionada: number | "";
  data: string;
  /** Indica se já existe chamada gravada para o trio turma+disciplina+data atual. */
  chamadaJaExiste: boolean;
  aoMudarTurma: (turmaIdTurma: number | "") => void;
  aoMudarGrade: (gradeIdGrade: number | "") => void;
  aoMudarData: (data: string) => void;
  aoDiaAnterior: () => void;
  aoHoje: () => void;
  aoProximoDia: () => void;
  linhas: LinhaChamada[];
  aoMudarStatus: (matriculaIdMatricula: number, status: StatusFrequencia) => void;
  aoMudarJustificativa: (matriculaIdMatricula: number, justificativa: string) => void;
  aoMarcarTodosPresentes: () => void;
  aoSalvar: () => void;
}

function nomeMateria(materias: Materia[], materiaIdMateria: number): string {
  return materias.find((materia) => materia.idMateria === materiaIdMateria)?.nomeMateria ?? "Matéria";
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
  aoMudarStatus,
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
                {nomeMateria(materias, grade.materiaIdMateria)}
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
            {linhas.map(({ matricula, aluno, status, justificativa }) => (
              <CardChamada
                key={matricula.idMatricula}
                aluno={aluno}
                status={status}
                justificativa={justificativa}
                aoMudarStatus={(novoStatus) => aoMudarStatus(matricula.idMatricula, novoStatus)}
                aoMudarJustificativa={(texto) =>
                  aoMudarJustificativa(matricula.idMatricula, texto)
                }
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
