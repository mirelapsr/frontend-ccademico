import type { ReactNode } from "react";

interface CardGraficoProps {
  titulo: string;
  subtitulo?: string;
  /** Controles opcionais no cabeçalho (ex.: alternar Valor/Quantidade). */
  acoes?: ReactNode;
  /** Classe de largura no grid (ex.: "dashboard__grafico--metade"). */
  className?: string;
  carregando?: boolean;
  erro?: string | null;
  /** `true` quando não há dados para o recorte atual. */
  vazio: boolean;
  mensagemVazio: string;
  /** Se informado, exibe o botão "Limpar filtros" no estado vazio. */
  aoLimparFiltros?: () => void;
  /** Texto curto abaixo do gráfico (ex.: legenda de faixas). */
  rodape?: ReactNode;
  children: ReactNode;
}

function CardGrafico({
  titulo,
  subtitulo,
  acoes,
  className = "",
  carregando = false,
  erro = null,
  vazio,
  mensagemVazio,
  aoLimparFiltros,
  rodape,
  children,
}: CardGraficoProps) {
  let corpo: ReactNode;

  if (erro) {
    corpo = (
      <p className="estado-grafico estado-grafico--erro" role="alert">
        Não foi possível carregar este gráfico. {erro}
      </p>
    );
  } else if (carregando && vazio) {
    corpo = (
      <div className="estado-grafico" aria-busy="true">
        <span className="estado-grafico__esqueleto" />
        <p>Carregando dados...</p>
      </div>
    );
  } else if (vazio) {
    corpo = (
      <div className="estado-grafico">
        <svg className="estado-grafico__icone" viewBox="0 0 48 48" aria-hidden="true">
          <rect x="6" y="26" width="8" height="16" rx="2" />
          <rect x="20" y="16" width="8" height="26" rx="2" />
          <rect x="34" y="8" width="8" height="34" rx="2" />
        </svg>
        <p>{mensagemVazio}</p>
        {aoLimparFiltros && (
          <button type="button" className="estado-grafico__botao" onClick={aoLimparFiltros}>
            Limpar filtros
          </button>
        )}
      </div>
    );
  } else {
    corpo = children;
  }

  return (
    <section className={`dashboard__grafico ${className}`.trim()} aria-label={titulo}>
      <header className="dashboard__grafico-topo">
        <div>
          <h2>{titulo}</h2>
          {subtitulo && <p className="dashboard__grafico-sub">{subtitulo}</p>}
        </div>
        {acoes}
      </header>
      {corpo}
      {!vazio && !erro && rodape && <footer className="dashboard__grafico-rodape">{rodape}</footer>}
    </section>
  );
}

export default CardGrafico;
