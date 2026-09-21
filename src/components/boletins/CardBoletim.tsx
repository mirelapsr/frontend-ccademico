import type { Boletim, Matricula, Aluno, Turma, Periodo } from "../../types";
import "./CardBoletim.css";

interface CardBoletimProps {
  boletim: Boletim;
  /** Listas completas — o card resolve matrícula → aluno/turma, e período pelas FKs. */
  matriculas: Matricula[];
  alunos: Aluno[];
  turmas: Turma[];
  periodos: Periodo[];
  aoEditar: () => void;
  aoExcluir: () => void;
}

const RUTULOS_SITUACAO: Record<Boletim["situacao"], string> = {
  Aprovado: "Aprovado",
  Reprovado: "Reprovado",
  Recuperacao: "Recuperação",
  "Em Andamento": "Em Andamento",
};

function formatarData(iso: string): string {
  return new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString("pt-BR");
}

function formatarMedia(valor: number): string {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function classeFaixaMedia(valor: number): string {
  if (valor >= 7) return "card-boletim__valor-media--boa";
  if (valor >= 5) return "card-boletim__valor-media--media";
  return "card-boletim__valor-media--baixa";
}

function ValorOuVazio({ valor }: { valor: string | null | undefined }) {
  if (valor) return <>{valor}</>;
  return <span className="card-boletim__vazio">Não informado</span>;
}

function CardBoletim({
  boletim,
  matriculas,
  alunos,
  turmas,
  periodos,
  aoEditar,
  aoExcluir,
}: CardBoletimProps) {
  const matricula = matriculas.find((item) => item.idMatricula === boletim.matriculaIdMatricula);
  const aluno = matricula ? alunos.find((item) => item.idAluno === matricula.alunoIdAluno) : undefined;
  const turma = matricula ? turmas.find((item) => item.idTurma === matricula.turmaIdTurma) : undefined;
  const periodo = periodos.find((item) => item.idPeriodo === boletim.periodoIdPeriodo);

  return (
    <article className="card-boletim">
      <header className="card-boletim__cabecalho">
        <div className="card-boletim__titulo-bloco">
          <h3 className="card-boletim__nome">
            <ValorOuVazio valor={aluno?.nomeAluno} />
          </h3>
          <p className="card-boletim__subtitulo">
            <IconeBoletim />
            {periodo ? `${periodo.nomePeriodo} (${periodo.ano})` : "Período não encontrado"}
            {turma ? ` · ${turma.nomeTurma}` : ""}
          </p>
        </div>

        <div className="card-boletim__acoes">
          <span
            className={`card-boletim__selo-situacao card-boletim__selo-situacao--${boletim.situacao
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {RUTULOS_SITUACAO[boletim.situacao]}
          </span>
          <button type="button" className="card-boletim__botao-editar" onClick={aoEditar}>
            Editar
          </button>
          <button
            type="button"
            className="card-boletim__botao-excluir"
            onClick={aoExcluir}
            aria-label={`Excluir boletim de ${aluno?.nomeAluno ?? "aluno"}`}
            title="Excluir"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-boletim__destaque">
        {boletim.mediaFinal !== null && boletim.mediaFinal !== undefined ? (
          <span className={`card-boletim__valor-media ${classeFaixaMedia(boletim.mediaFinal)}`}>
            {formatarMedia(boletim.mediaFinal)} <span className="card-boletim__valor-media-max">/ 10.0</span>
          </span>
        ) : (
          <span className="card-boletim__valor-media card-boletim__valor-media--pendente">
            Média ainda não fechada
          </span>
        )}
      </div>

      <div className="card-boletim__corpo">
        <div className="card-boletim__coluna">
          <span className="card-boletim__rotulo">Total de faltas</span>
          <p className="card-boletim__valor">{boletim.totalFaltas ?? 0}</p>
        </div>

        <div className="card-boletim__coluna card-boletim__coluna--larga">
          <span className="card-boletim__rotulo">Observações</span>
          <p className="card-boletim__valor">
            {boletim.observacoes ? (
              boletim.observacoes
            ) : (
              <span className="card-boletim__vazio">Nenhuma observação registrada</span>
            )}
          </p>
        </div>
      </div>

      {(boletim.criadoEm || boletim.atualizadoEm) && (
        <footer className="card-boletim__rodape">
          {boletim.criadoEm && <span>Criado em: {formatarData(boletim.criadoEm)}</span>}
          {boletim.atualizadoEm && <span>Atualizado em: {formatarData(boletim.atualizadoEm)}</span>}
        </footer>
      )}
    </article>
  );
}

export default CardBoletim;

function IconeBoletim() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <rect x="3.5" y="2.5" width="13" height="15" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6.2 6.5h7.6M6.2 9.3h7.6M6.2 12.1h4.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
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
