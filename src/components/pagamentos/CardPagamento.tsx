import type { Boleto, Aluno } from "../../types";
import "./CardPagamento.css";

interface CardPagamentoProps {
  pagamento: Boleto;
  aluno?: Aluno;
  aoExcluir: () => void;
}

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

function formatarData(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR");
}

function formatarCompetencia(competencia: string): string {
  const [ano, mes] = competencia.split("-");
  if (!ano || !mes) return competencia;
  return `${mes}/${ano}`;
}

function ValorOuVazio({ valor }: { valor: string | null | undefined }) {
  if (valor) return <>{valor}</>;
  return <span className="card-pagamento__vazio">Não informado</span>;
}

function CardPagamento({ pagamento, aluno, aoExcluir }: CardPagamentoProps) {
  return (
    <article className="card-pagamento">
      <header className="card-pagamento__cabecalho">
        <div className="card-pagamento__titulo-bloco">
          <h3 className="card-pagamento__nome">
            <ValorOuVazio valor={aluno?.nomeAluno} />
          </h3>
          <p className="card-pagamento__subtitulo">
            <IconePagamento />
            Pagamento nº {pagamento.numeroBoleto}
          </p>
        </div>

        <div className="card-pagamento__acoes">
          <span
            className={`card-pagamento__selo-situacao card-pagamento__selo-situacao--${pagamento.situacao.toLowerCase()}`}
          >
            {pagamento.situacao}
          </span>
          <button
            type="button"
            className="card-pagamento__botao-excluir"
            onClick={aoExcluir}
            aria-label={`Excluir pagamento ${pagamento.numeroBoleto}`}
            title="Excluir"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-pagamento__corpo">
        <div className="card-pagamento__coluna">
          <span className="card-pagamento__rotulo">Competência</span>
          <p className="card-pagamento__valor">{formatarCompetencia(pagamento.competencia)}</p>
        </div>

        <div className="card-pagamento__coluna">
          <span className="card-pagamento__rotulo">Valor da mensalidade</span>
          <p className="card-pagamento__valor card-pagamento__valor--destaque">
            {formatarMoeda(pagamento.valorMensalidade)}
          </p>
        </div>

        <div className="card-pagamento__coluna">
          <span className="card-pagamento__rotulo">Vencimento</span>
          <p className="card-pagamento__valor">{formatarData(pagamento.dataVencimento)}</p>
          {pagamento.dataPagamento && (
            <p className="card-pagamento__valor card-pagamento__valor--suave">
              Pago em: {formatarData(pagamento.dataPagamento)}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default CardPagamento;

function IconePagamento() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <rect x="2.5" y="4" width="15" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <line x1="5" y1="7.2" x2="5" y2="12.8" stroke="currentColor" strokeWidth="1.2" />
      <line x1="7.2" y1="7.2" x2="7.2" y2="12.8" stroke="currentColor" strokeWidth="0.8" />
      <line x1="9" y1="7.2" x2="9" y2="12.8" stroke="currentColor" strokeWidth="1.2" />
      <line x1="11.2" y1="7.2" x2="11.2" y2="12.8" stroke="currentColor" strokeWidth="0.8" />
      <line x1="13" y1="7.2" x2="13" y2="12.8" stroke="currentColor" strokeWidth="1.2" />
      <line x1="15" y1="7.2" x2="15" y2="12.8" stroke="currentColor" strokeWidth="0.8" />
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