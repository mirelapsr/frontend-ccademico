import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatarMedia, situacaoPelaMedia, type NivelSituacao } from "../../utils/boletim";
import type { PontoDesempenho } from "../../utils/dashboard";
import { ANIMACAO_GRAFICO } from "./animacao";
import CardGrafico from "./CardGrafico";
import { AMBAR, AZUL_CLARO, VERMELHO } from "./cores";
import TooltipGrafico from "./TooltipGrafico";

const COR_POR_NIVEL: Record<NivelSituacao, string> = {
  aprovado: AZUL_CLARO,
  recuperacao: AMBAR,
  reprovado: VERMELHO,
  "sem-notas": "#a39d8f",
};

interface Props {
  dados: readonly PontoDesempenho[];
  carregando: boolean;
  erro: string | null;
  className?: string;
  aoLimparFiltros?: () => void;
}

function GraficoDesempenhoMaterias({ dados, carregando, erro, className, aoLimparFiltros }: Props) {
  const altura = Math.max(260, dados.length * 40 + 48);

  return (
    <CardGrafico
      titulo="Desempenho por Matéria"
      subtitulo="Média das notas (ponderada pelo peso das avaliações)"
      className={className}
      carregando={carregando}
      erro={erro}
      vazio={dados.length === 0}
      mensagemVazio="Nenhuma nota lançada para os filtros selecionados."
      aoLimparFiltros={aoLimparFiltros}
      rodape={
        <span className="legenda-faixas">
          <i style={{ background: COR_POR_NIVEL.aprovado }} /> ≥ 7,0
          <i style={{ background: COR_POR_NIVEL.recuperacao }} /> 5,0 a 6,9
          <i style={{ background: COR_POR_NIVEL.reprovado }} /> &lt; 5,0
        </span>
      }
    >
      <ResponsiveContainer width="100%" height={altura}>
        <BarChart
          data={[...dados]}
          layout="vertical"
          margin={{ top: 4, right: 36, left: 0, bottom: 4 }}
          barCategoryGap="22%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5dfd2" horizontal={false} />
          <XAxis type="number" domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 12, fill: "#6b6558" }} />
          <YAxis
            type="category"
            dataKey="materia"
            width={112}
            tick={{ fontSize: 12, fill: "#201c16" }}
            tickLine={false}
          />
          <ReferenceLine x={7} stroke="#16233f" strokeDasharray="4 4" />
          <Tooltip
            cursor={{ fill: "rgba(22, 35, 63, 0.06)" }}
            content={
              <TooltipGrafico
                formatarValor={(valor) => formatarMedia(valor)}
                rodape={(itens) => {
                  const ponto = (itens[0] as unknown as { payload?: PontoDesempenho }).payload;
                  return ponto ? `${ponto.totalNotas} nota(s) lançada(s)` : null;
                }}
              />
            }
          />
          <Bar dataKey="media" name="Média" radius={[0, 6, 6, 0]} {...ANIMACAO_GRAFICO}>
            {dados.map((ponto) => (
              <Cell key={ponto.materia} fill={COR_POR_NIVEL[situacaoPelaMedia(ponto.media)]} />
            ))}
            <LabelList
              dataKey="media"
              position="right"
              formatter={(v: unknown) => formatarMedia(Number(v))}
              style={{ fontSize: 12, fill: "#201c16", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}

export default GraficoDesempenhoMaterias;
