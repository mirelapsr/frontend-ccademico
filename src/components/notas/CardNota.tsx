import type { Nota, Aluno, Avaliacao, GradeCurricular, Materia, Turma } from "../../types";
import "./CardNota.css";

interface CardNotaProps {
  nota: Nota;
  alunos: Aluno[];
  avaliacoes: Avaliacao[];
  grades: GradeCurricular[];
  materias: Materia[];
  turmas: Turma[];
  aoEditar: () => void;
  aoExcluir: () => void;
}

function formatarData(iso: string): string {
  return new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString("pt-BR");
}

function formatarNota(valor: number | string): string {
  const num = typeof valor === "string" ? Number(valor) : valor;
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function classeFaixaNota(valor: number | string): string {
  const num = typeof valor === "string" ? Number(valor) : valor;
  if (num >= 7) return "card-nota__selo-faixa--boa";
  if (num >= 5) return "card-nota__selo-faixa--media";
  return "card-nota__selo-faixa--baixa";
}

function ValorOuVazio({ valor }: { valor: string | null | undefined }) {
  if (valor) return <>{valor}</>;
  return <span className="card-nota__vazio">Não informado</span>;
}

function CardNota({
  nota,
  alunos,
  avaliacoes,
  grades,
  materias,
  turmas,
  aoEditar,
  aoExcluir,
}: CardNotaProps) {
  const aluno = alunos.find((item) => item.idAluno === nota.alunoId);
  const avaliacao = avaliacoes.find((item) => item.idAvaliacao === nota.avaliacaoId);
  const grade = avaliacao ? grades.find((item) => item.idGrade === avaliacao.gradeId) : undefined;
  const materia = grade ? materias.find((item) => item.idMateria === grade.materiaId) : undefined;
  const turma = grade ? turmas.find((item) => item.idTurma === grade.turmaId) : undefined;

  return (
    <article className="card-nota">
      <header className="card-nota__cabecalho">
        <div className="card-nota__titulo-bloco">
          <h3 className="card-nota__nome">
            <ValorOuVazio valor={aluno?.nomeAluno} />
          </h3>
          <p className="card-nota__subtitulo">
            <IconeNota />
            {avaliacao ? (
              `${avaliacao.nomeAvaliacao}${materia ? ` — ${materia.nomeMateria}` : ""}${
                turma ? ` (${turma.nomeTurma})` : ""
              }`
            ) : (
              <span className="card-nota__vazio">Avaliação não encontrada</span>
            )}
          </p>
        </div>

        <div className="card-nota__acoes">
          <button type="button" className="card-nota__botao-editar" onClick={aoEditar}>
            Editar
          </button>
          <button
            type="button"
            className="card-nota__botao-excluir"
            onClick={aoExcluir}
            aria-label={`Excluir nota de ${aluno?.nomeAluno ?? "aluno"}`}
            title="Excluir"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-nota__destaque">
        <span className={`card-nota__valor-nota ${classeFaixaNota(nota.valorNota)}`}>
          {formatarNota(nota.valorNota)} <span className="card-nota__valor-nota-max">/ 10.0</span>
        </span>
      </div>

      <div className="card-nota__corpo">
        <div className="card-nota__coluna">
          <span className="card-nota__rotulo">Data da avaliação</span>
          <p className="card-nota__valor">
            {avaliacao?.dataAvaliacao ? (
              formatarData(avaliacao.dataAvaliacao)
            ) : (
              <span className="card-nota__vazio">A definir</span>
            )}
          </p>
        </div>

        <div className="card-nota__coluna card-nota__coluna--larga">
          <span className="card-nota__rotulo">Observações</span>
          <p className="card-nota__valor">
            {nota.observacao ? (
              nota.observacao
            ) : (
              <span className="card-nota__vazio">Nenhuma observação registrada</span>
            )}
          </p>
        </div>
      </div>

      {(nota.criadoEm || nota.atualizadoEm) && (
        <footer className="card-nota__rodape">
          {nota.criadoEm && <span>Criada em: {formatarData(nota.criadoEm)}</span>}
          {nota.atualizadoEm && <span>Atualizada em: {formatarData(nota.atualizadoEm)}</span>}
        </footer>
      )}
    </article>
  );
}

export default CardNota;

function IconeNota() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <rect x="3.5" y="2.5" width="13" height="15" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6.5 10.2 8.6 12.3 13.5 7" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
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