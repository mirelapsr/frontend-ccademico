import type { Periodo } from "../../types";
import "./CardPeriodo.css";

interface CardPeriodoProps {
  periodo: Periodo;
  aoEditar: () => void;
  aoExcluir: () => void;
}

function formatarData(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR");
}

function CardPeriodo({ periodo, aoEditar, aoExcluir }: CardPeriodoProps) {
  return (
    <article className="card-periodo">
      <header className="card-periodo__cabecalho">
        <div className="card-periodo__titulo-bloco">
          <h3 className="card-periodo__nome">{periodo.nomePeriodo}</h3>
          <p className="card-periodo__ano">
            <IconeCalendario />
            Ano letivo {periodo.ano}
          </p>
        </div>

        <div className="card-periodo__acoes">
          <span
            className={`card-periodo__selo-situacao card-periodo__selo-situacao--${periodo.situacao.toLowerCase()}`}
          >
            {periodo.situacao}
          </span>
          <button type="button" className="card-periodo__botao-editar" onClick={aoEditar}>
            Editar
          </button>
          <button
            type="button"
            className="card-periodo__botao-excluir"
            onClick={aoExcluir}
            aria-label={`Excluir ${periodo.nomePeriodo}`}
            title="Excluir"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-periodo__corpo">
        <div className="card-periodo__coluna">
          <span className="card-periodo__rotulo">Início</span>
          <p className="card-periodo__valor">{formatarData(periodo.dataInicio)}</p>
        </div>

        <div className="card-periodo__coluna">
          <span className="card-periodo__rotulo">Término</span>
          <p className="card-periodo__valor">{formatarData(periodo.dataFim)}</p>
        </div>
      </div>

      <footer className="card-periodo__rodape">
        <span>Criado em: {formatarData(periodo.criadoEm.slice(0, 10))}</span>
        <span>Atualizado em: {formatarData(periodo.atualizadoEm.slice(0, 10))}</span>
      </footer>
    </article>
  );
}

export default CardPeriodo;

function IconeCalendario() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <rect x="3" y="4.5" width="14" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.4" />
      <line x1="6.5" y1="3" x2="6.5" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="13.5" y1="3" x2="13.5" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
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
