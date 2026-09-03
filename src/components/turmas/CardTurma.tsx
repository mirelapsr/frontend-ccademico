import type { Escola, Turma } from "../../types";
import "./CardTurma.css";

interface CardTurmaProps {
  turma: Turma;
  /** Lista completa de escolas — o card resolve o nome pela FK `escolaIdEscola`. */
  escolas: Escola[];
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
  return new Date(iso).toLocaleDateString("pt-BR");
}

function ValorOuVazio({ valor }: { valor: string | number | null | undefined }) {
  if (valor !== null && valor !== undefined && valor !== "") return <>{valor}</>;
  return <span className="card-turma__vazio">Não informado</span>;
}

function CardTurma({ turma, escolas, aoEditar, aoExcluir }: CardTurmaProps) {
  const escolaVinculada = escolas.find((escola) => escola.idEscola === turma.escolaIdEscola);

  return (
    <article className="card-turma">
      <header className="card-turma__cabecalho">
        <div className="card-turma__titulo-bloco">
          <h3 className="card-turma__nome">{turma.nomeTurma}</h3>
          <p className="card-turma__serie">
            <IconeSerie />
            <ValorOuVazio valor={turma.serie} />
          </p>
        </div>

        <div className="card-turma__acoes">
          <span className={`card-turma__selo-turno card-turma__selo-turno--${turma.turno.toLowerCase()}`}>
            {RUTULOS_TURNO[turma.turno]}
          </span>
          <button type="button" className="card-turma__botao-editar" onClick={aoEditar}>
            Editar
          </button>
          <button
            type="button"
            className="card-turma__botao-excluir"
            onClick={aoExcluir}
            aria-label={`Excluir ${turma.nomeTurma}`}
            title="Excluir"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-turma__corpo">
        <div className="card-turma__coluna">
          <span className="card-turma__rotulo">Detalhes</span>
          <p className="card-turma__valor">Turno: {RUTULOS_TURNO[turma.turno]}</p>
          <p className="card-turma__valor">Ano letivo: {turma.anoLetivo}</p>
          <p className="card-turma__valor">
            Capacidade: <ValorOuVazio valor={turma.capacidade} />
          </p>
        </div>

        <div className="card-turma__coluna">
          <span className="card-turma__rotulo">Instituição</span>
          <p className="card-turma__valor">
            <ValorOuVazio valor={escolaVinculada?.nomeEscola} />
          </p>
          {escolaVinculada?.enderecoEscola && (
            <p className="card-turma__valor card-turma__valor--suave">
              {escolaVinculada.enderecoEscola}
            </p>
          )}
        </div>
      </div>

      <footer className="card-turma__rodape">
        <span>Criada em: {formatarData(turma.criadoEm)}</span>
        <span>Atualizada em: {formatarData(turma.atualizadoEm)}</span>
      </footer>
    </article>
  );
}

export default CardTurma;

function IconeSerie() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        d="M2 6.5 10 3l8 3.5-8 3.5-8-3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 8.3v3.6c0 1.2 2 2.2 4.5 2.2s4.5-1 4.5-2.2V8.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
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
