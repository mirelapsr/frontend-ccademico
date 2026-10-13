import type { GradeCurricular, Turma, Materia, Professor } from "../../types";
import "./CardGradeCurricular.css";

interface CardGradeCurricularProps {
  grade: GradeCurricular;
  turmas: Turma[];
  materias: Materia[];
  professores: Professor[];
  aoEditar: (idGrade: number) => void;
  aoExcluir: (idGrade: number) => void;
}

function formatarDataHora(dataIso: string | null | undefined): string {
  if (!dataIso) return "—";
  try {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return dataIso;
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(data);
  } catch {
    return dataIso;
  }
}

function ValorOuVazio({ valor }: { valor: string | number | null | undefined }) {
  if (valor !== null && valor !== undefined && valor !== "") return <>{valor}</>;
  return <span className="card-grade__vazio">Não informado</span>;
}

function CardGradeCurricular({
  grade,
  turmas,
  materias,
  professores,
  aoEditar,
  aoExcluir,
}: CardGradeCurricularProps) {
  const idGrade = grade.idGrade;

  const turma = turmas.find((item) => item.idTurma === grade.turmaId);
  const materia = materias.find((item) => item.idMateria === grade.materiaId);
  const professor = professores.find((item) => item.idProfessor === grade.professorId);

  const dataCriacao = grade.criadoEm;
  const dataAtualizacao = grade.atualizadoEm;
  return (
    <article className="card-grade">
      <header className="card-grade__cabecalho">
        <div className="card-grade__titulo-bloco">
          <h3 className="card-grade__nome">
            <ValorOuVazio valor={materia?.nomeMateria} />
          </h3>
          <p className="card-grade__subtitulo">
            <IconeGrade />
            <ValorOuVazio valor={turma?.nomeTurma} />
          </p>
        </div>

        <div className="card-grade__acoes">
          <span className="card-grade__selo-ano">{turma?.anoLetivo ?? "—"}</span>
          <button
            type="button"
            className="card-grade__botao-editar"
            onClick={() => aoEditar(idGrade)}
          >
            Editar
          </button>
          <button
            type="button"
            className="card-grade__botao-excluir"
            onClick={() => aoExcluir(idGrade)}
            aria-label={`Excluir grade de ${materia?.nomeMateria ?? "matéria"} da turma ${turma?.nomeTurma ?? ""}`}
            title="Excluir"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-grade__corpo">
        <div className="card-grade__coluna">
          <span className="card-grade__rotulo">Turma</span>
          <p className="card-grade__valor">
            <ValorOuVazio valor={turma?.nomeTurma} />
          </p>
        </div>

        <div className="card-grade__coluna">
          <span className="card-grade__rotulo">Professor</span>
          <p className="card-grade__valor">
            <ValorOuVazio valor={professor?.nomeProf} />
          </p>
        </div>

        <div className="card-grade__coluna">
          <span className="card-grade__rotulo">Ano letivo</span>
          <p className="card-grade__valor">{turma?.anoLetivo ?? "—"}</p>
        </div>

        <div className="card-grade__coluna">
          <span className="card-grade__rotulo">Carga horária semanal</span>
          <p className="card-grade__valor">
            {grade.cargaHorariaSemanal ? (
              `${grade.cargaHorariaSemanal}h/semana`
            ) : materia?.cargaHoraria ? (
              `${materia.cargaHoraria}h total`
            ) : (
              <span className="card-grade__vazio">Não informado</span>
            )}
          </p>
        </div>
      </div>

      <footer className="card-grade__rodape">
        {dataCriacao && (
          <span>Adicionado em: {formatarDataHora(dataCriacao)}</span>
        )}
        {dataAtualizacao && (
          <span>Alterado em: {formatarDataHora(dataAtualizacao)}</span>
        )}
      </footer>
    </article>
  );
}

export default CardGradeCurricular;

function IconeGrade() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        d="M3 5.5 10 3l7 2.5v6L10 14 3 11.5v-6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M6 8v5.5c0 1 1.8 2 4 2s4-1 4-2V8" fill="none" stroke="currentColor" strokeWidth="1.2" />
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