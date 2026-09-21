import type { Frequencia, Matricula, Aluno, Turma, GradeCurricular, Materia } from "../../types";
import "./CardFrequencia.css";

interface CardFrequenciaProps {
  frequencia: Frequencia;
  /** Listas completas — o card resolve matrícula → aluno/turma, e grade → matéria pelas FKs. */
  matriculas: Matricula[];
  alunos: Aluno[];
  turmas: Turma[];
  grades: GradeCurricular[];
  materias: Materia[];
  aoEditar: () => void;
  aoExcluir: () => void;
}

const RUTULOS_STATUS: Record<Frequencia["status"], string> = {
  Presente: "Presente",
  Ausente: "Ausente",
  Justificado: "Justificado",
};

function formatarData(iso: string): string {
  return new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString("pt-BR");
}

function ValorOuVazio({ valor }: { valor: string | null | undefined }) {
  if (valor) return <>{valor}</>;
  return <span className="card-frequencia__vazio">Não informado</span>;
}

function CardFrequencia({
  frequencia,
  matriculas,
  alunos,
  turmas,
  grades,
  materias,
  aoEditar,
  aoExcluir,
}: CardFrequenciaProps) {
  const matricula = matriculas.find((item) => item.idMatricula === frequencia.matriculaIdMatricula);
  const aluno = matricula ? alunos.find((item) => item.idAluno === matricula.alunoIdAluno) : undefined;
  const turma = matricula ? turmas.find((item) => item.idTurma === matricula.turmaIdTurma) : undefined;
  const grade = grades.find((item) => item.idGrade === frequencia.gradeIdGrade);
  const materia = grade ? materias.find((item) => item.idMateria === grade.materiaIdMateria) : undefined;

  return (
    <article className="card-frequencia">
      <header className="card-frequencia__cabecalho">
        <div className="card-frequencia__titulo-bloco">
          <h3 className="card-frequencia__nome">
            <ValorOuVazio valor={aluno?.nomeAluno} />
          </h3>
          <p className="card-frequencia__subtitulo">
            <IconeCalendario />
            {formatarData(frequencia.dataAula)}
          </p>
        </div>

        <div className="card-frequencia__acoes">
          <span
            className={`card-frequencia__selo-status card-frequencia__selo-status--${frequencia.status.toLowerCase()}`}
          >
            {RUTULOS_STATUS[frequencia.status]}
          </span>
          <button type="button" className="card-frequencia__botao-editar" onClick={aoEditar}>
            Editar
          </button>
          <button
            type="button"
            className="card-frequencia__botao-excluir"
            onClick={aoExcluir}
            aria-label={`Excluir registro de frequência de ${aluno?.nomeAluno ?? "aluno"}`}
            title="Excluir"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-frequencia__corpo">
        <div className="card-frequencia__coluna">
          <span className="card-frequencia__rotulo">Disciplina</span>
          <p className="card-frequencia__valor">
            <ValorOuVazio valor={materia?.nomeMateria} />
          </p>
        </div>

        <div className="card-frequencia__coluna">
          <span className="card-frequencia__rotulo">Turma</span>
          <p className="card-frequencia__valor">
            <ValorOuVazio valor={turma?.nomeTurma} />
          </p>
        </div>

        <div className="card-frequencia__coluna card-frequencia__coluna--larga">
          <span className="card-frequencia__rotulo">Justificativa</span>
          <p className="card-frequencia__valor">
            {frequencia.justificativa ? (
              frequencia.justificativa
            ) : (
              <span className="card-frequencia__vazio">Nenhuma justificativa registrada</span>
            )}
          </p>
        </div>
      </div>

      {(frequencia.criadoEm || frequencia.atualizadoEm) && (
        <footer className="card-frequencia__rodape">
          {frequencia.criadoEm && <span>Criada em: {formatarData(frequencia.criadoEm)}</span>}
          {frequencia.atualizadoEm && (
            <span>Atualizada em: {formatarData(frequencia.atualizadoEm)}</span>
          )}
        </footer>
      )}
    </article>
  );
}

export default CardFrequencia;

function IconeCalendario() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <rect x="2.5" y="4" width="15" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <line x1="2.5" y1="7.8" x2="17.5" y2="7.8" stroke="currentColor" strokeWidth="1.2" />
      <line x1="6" y1="2.5" x2="6" y2="5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="14" y1="2.5" x2="14" y2="5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconeLixeira() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" focusable="false">
      <path
        d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6M5.5 6l.6 10.2a1.5 1.5 0 0 0 1.5 1.4h4.8a1.5 1.5 0 0 0 1.5-1.4L14.5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
