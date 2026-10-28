import type { ReactNode } from "react";

export interface ItemTooltip {
  name?: string | number;
  value?: string | number | ReadonlyArray<string | number>;
  color?: string;
  dataKey?: string | number | ((obj: never) => unknown);
}

interface TooltipGraficoProps {
  /** Injetadas pelo Recharts. */
  active?: boolean;
  payload?: ReadonlyArray<ItemTooltip>;
  label?: string | number;
  /** Como exibir cada valor (ex.: moeda, nota, "alunos"). */
  formatarValor?: (valor: number, item: ItemTooltip) => string;
  /** Linha extra ao final (ex.: total do mês). */
  rodape?: (itens: ReadonlyArray<ItemTooltip>) => ReactNode;
}

function TooltipGrafico({ active, payload, label, formatarValor, rodape }: TooltipGraficoProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="tooltip-grafico" role="status">
      {label !== undefined && label !== "" && <strong className="tooltip-grafico__titulo">{label}</strong>}
      <ul className="tooltip-grafico__lista">
        {payload.map((item, indice) => {
          const numero = Number(item.value);
          return (
            <li key={`${String(item.dataKey)}-${indice}`}>
              <span className="tooltip-grafico__marcador" style={{ background: item.color }} />
              <span className="tooltip-grafico__nome">{item.name}</span>
              <span className="tooltip-grafico__valor">
                {formatarValor && Number.isFinite(numero) ? formatarValor(numero, item) : String(item.value)}
              </span>
            </li>
          );
        })}
      </ul>
      {rodape && <div className="tooltip-grafico__rodape">{rodape(payload)}</div>}
    </div>
  );
}

export default TooltipGrafico;
