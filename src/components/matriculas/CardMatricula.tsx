import type { Aluno, Matricula, Turma } from "../../types";
import "./CardMatricula.css";

interface CardMatriculaProps {
  matricula: Matricula;
  /** Listas completas — o card resolve aluno e turma pelas FKs. */
  alunos: Aluno[];
  turmas: Turma[];
  aoEditar: () => void;
  aoExcluir: () => void;
}

const RUTULOS_TURNO: Record<Turma["turno"], string> = {
  Manha: "Manhã",
  Tarde: "Tarde",
  Noite: "Noite",
  Integral: "Integral",
};

function formatarData(iso: string): string {
  // dataMatricula vem como "YYYY-MM-DD"; força meio-dia local para não
  // sofrer o "off-by-one" de fuso ao converter para Date.
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR");
}

function ValorOuVazio({ valor }: { valor: string | null | undefined }) {
  if (valor) return <>{valor}</>;
  return <span className="card-matricula__vazio">Não informado</span>;
}

function CardMatricula({ matricula, alunos, turmas, aoEditar, aoExcluir }: CardMatriculaProps) {
  const aluno = alunos.find((item) => item.idAluno === matricula.alunoIdAluno);
  const turma = turmas.find((item) => item.idTurma === matricula.turmaIdTurma);

  return (
    <article className="card-matricula">
      <header className="card-matricula__cabecalho">
        <div className="card-matricula__titulo-bloco">
          <h3 className="card-matricula__nome">
            <ValorOuVazio valor={aluno?.nomeAluno} />
          </h3>
          <p className="card-matricula__matricula">
            <IconeMatricula />
            {aluno ? `Matrícula ${aluno.numeroMatricula}` : "Aluno não encontrado"}
          </p>
        </div>

        <div className="card-matricula__acoes">
          <span
            className={`card-matricula__selo-situacao card-matricula__selo-situacao--${matricula.situacao.toLowerCase()}`}
          >
            {matricula.situacao}
          </span>
          <button type="button" className="card-matricula__botao-editar" onClick={aoEditar}>
            Editar
          </button>
          <button
            type="button"
            className="card-matricula__botao-excluir"
            onClick={aoExcluir}
            aria-label={`Excluir matrícula de ${aluno?.nomeAluno ?? "aluno"}`}
            title="Excluir"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-matricula__corpo">
        <div className="card-matricula__coluna">
          <span className="card-matricula__rotulo">Turma</span>
          <p className="card-matricula__valor">
            <ValorOuVazio valor={turma?.nomeTurma} />
          </p>
          {turma && (
            <p className="card-matricula__valor card-matricula__valor--suave">
              {RUTULOS_TURNO[turma.turno]} · {turma.anoLetivo}
            </p>
          )}
        </div>

        <div className="card-matricula__coluna">
          <span className="card-matricula__rotulo">Data da matrícula</span>
          <p className="card-matricula__valor">{formatarData(matricula.dataMatricula)}</p>
        </div>
      </div>

      <footer className="card-matricula__rodape">
        <span>Criada em: {formatarData(matricula.criadoEm.slice(0, 10))}</span>
        <span>Atualizada em: {formatarData(matricula.atualizadoEm.slice(0, 10))}</span>
      </footer>
    </article>
  );
}

export default CardMatricula;

function IconeMatricula() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <rect x="2.5" y="4" width="15" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="7.2" cy="9" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.8 13c.4-1.5 1.5-2.2 2.4-2.2s2 .7 2.4 2.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="12" y1="8" x2="15.2" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="11" x2="15.2" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
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
