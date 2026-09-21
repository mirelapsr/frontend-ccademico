import type { Avaliacao, GradeCurricular, Materia, Turma, Periodo } from "../../types";
import "./CardAvaliacao.css";

interface CardAvaliacaoProps {
  avaliacao: Avaliacao;
  /** Listas completas — o card resolve grade → matéria/turma, e período pelas FKs. */
  grades: GradeCurricular[];
  materias: Materia[];
  turmas: Turma[];
  periodos: Periodo[];
  aoEditar: () => void;
  aoExcluir: () => void;
}

function formatarData(iso: string): string {
  return new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString("pt-BR");
}

function formatarPeso(peso: number | null | undefined): string {
  if (peso === null || peso === undefined) return "1,00";
  return peso.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ValorOuVazio({ valor }: { valor: string | null | undefined }) {
  if (valor) return <>{valor}</>;
  return <span className="card-avaliacao__vazio">Não informado</span>;
}

function CardAvaliacao({
  avaliacao,
  grades,
  materias,
  turmas,
  periodos,
  aoEditar,
  aoExcluir,
}: CardAvaliacaoProps) {
  const grade = grades.find((item) => item.idGrade === avaliacao.gradeIdGrade);
  const materia = grade ? materias.find((item) => item.idMateria === grade.materiaIdMateria) : undefined;
  const turma = grade ? turmas.find((item) => item.idTurma === grade.turmaIdTurma) : undefined;
  const periodo = periodos.find((item) => item.idPeriodo === avaliacao.periodoIdPeriodo);

  return (
    <article className="card-avaliacao">
      <header className="card-avaliacao__cabecalho">
        <div className="card-avaliacao__titulo-bloco">
          <h3 className="card-avaliacao__nome">{avaliacao.nomeAvaliacao}</h3>
          <p className="card-avaliacao__subtitulo">
            <IconeAvaliacao />
            {materia && turma ? (
              `${materia.nomeMateria} — ${turma.nomeTurma}`
            ) : (
              <span className="card-avaliacao__vazio">Grade não encontrada</span>
            )}
          </p>
        </div>

        <div className="card-avaliacao__acoes">
          <span
            className={`card-avaliacao__selo-tipo card-avaliacao__selo-tipo--${avaliacao.tipo.toLowerCase()}`}
          >
            {avaliacao.tipo}
          </span>
          <button type="button" className="card-avaliacao__botao-editar" onClick={aoEditar}>
            Editar
          </button>
          <button
            type="button"
            className="card-avaliacao__botao-excluir"
            onClick={aoExcluir}
            aria-label={`Excluir avaliação ${avaliacao.nomeAvaliacao}`}
            title="Excluir"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-avaliacao__corpo">
        <div className="card-avaliacao__coluna">
          <span className="card-avaliacao__rotulo">Período</span>
          <p className="card-avaliacao__valor">
            <ValorOuVazio valor={periodo?.nomePeriodo} />
          </p>
        </div>

        <div className="card-avaliacao__coluna">
          <span className="card-avaliacao__rotulo">Peso</span>
          <p className="card-avaliacao__valor">{formatarPeso(avaliacao.peso)}</p>
        </div>

        <div className="card-avaliacao__coluna">
          <span className="card-avaliacao__rotulo">Data da avaliação</span>
          <p className="card-avaliacao__valor">
            {avaliacao.dataAvaliacao ? (
              formatarData(avaliacao.dataAvaliacao)
            ) : (
              <span className="card-avaliacao__vazio">A definir</span>
            )}
          </p>
        </div>
      </div>

      {(avaliacao.criadoEm || avaliacao.atualizadoEm) && (
        <footer className="card-avaliacao__rodape">
          {avaliacao.criadoEm && <span>Criada em: {formatarData(avaliacao.criadoEm)}</span>}
          {avaliacao.atualizadoEm && (
            <span>Atualizada em: {formatarData(avaliacao.atualizadoEm)}</span>
          )}
        </footer>
      )}
    </article>
  );
}

export default CardAvaliacao;

function IconeAvaliacao() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <rect x="3.5" y="2.5" width="13" height="15" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6.2 7.5h7.6M6.2 10.3h7.6M6.2 13.1h4.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
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
