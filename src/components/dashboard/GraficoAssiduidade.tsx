import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PontoAssiduidade, ResumoAssiduidade } from "../../utils/dashboard";
import { ANIMACAO_GRAFICO } from "./animacao";
import CardGrafico from "./CardGrafico";
import TooltipGrafico from "./TooltipGrafico";

// Paleta institucional: marinho (presença), neutro (justificada), vinho (falta).
const COR_PRESENCA = "#1e3a8a";
const COR_JUSTIFICADA = "#b9b2a2";
const COR_FALTA = "#6e1423";

function formatarPercentual(valor: number): string {
  return `${valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

interface Props {
  resumo: ResumoAssiduidade;
  carregando: boolean;
  erro: string | null;
  className?: string;
  aoLimparFiltros?: () => void;
}

function GraficoAssiduidade({ resumo, carregando, erro, className, aoLimparFiltros }: Props) {
  const dados = resumo.serie;
  const altura = Math.max(260, dados.length * 40 + 80);
  // Rótulos desambiguados ("1º A - Escola X") são mais longos: eixo acompanha, com teto.
  const maiorRotulo = dados.reduce((maximo, p) => Math.max(maximo, p.turma.length), 0);
  const larguraEixo = Math.min(240, Math.max(112, maiorRotulo * 7));

  return (
    <CardGrafico
      titulo="Assiduidade por Turma"
      subtitulo={
        resumo.totalRegistros > 0
          ? `Presença geral: ${formatarPercentual(resumo.taxaGeral)} · ${resumo.totalRegistros} registro(s) de chamada`
          : "Presenças e faltas registradas nas chamadas"
      }
      className={className}
      carregando={carregando}
      erro={erro}
      vazio={dados.length === 0}
      mensagemVazio="Nenhuma chamada registrada para os filtros selecionados."
      aoLimparFiltros={aoLimparFiltros}
    >
      <ResponsiveContainer width="100%" height={altura}>
        <BarChart
          data={[...dados]}
          layout="vertical"
          stackOffset="expand"
          margin={{ top: 4, right: 56, left: 0, bottom: 4 }}
          barCategoryGap="22%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5dfd2" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 1]}
            ticks={[0, 0.25, 0.5, 0.75, 1]}
            tickFormatter={(v: number) => formatarPercentual(v * 100)}
            tick={{ fontSize: 12, fill: "#6b6558" }}
          />
          <YAxis
            type="category"
            dataKey="turma"
            width={larguraEixo}
            tick={{ fontSize: 12, fill: "#201c16" }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(22, 35, 63, 0.06)" }}
            content={
              <TooltipGrafico
                formatarValor={(valor) => `${valor} registro(s)`}
                rodape={(itens) => {
                  const ponto = (itens[0] as unknown as { payload?: PontoAssiduidade }).payload;
                  return ponto ? `Assiduidade: ${formatarPercentual(ponto.taxaAssiduidade)}` : null;
                }}
              />
            }
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="presencas" name="Presenças" stackId="chamada" fill={COR_PRESENCA} {...ANIMACAO_GRAFICO} />
          <Bar
            dataKey="faltasJustificadas"
            name="Faltas justificadas"
            stackId="chamada"
            fill={COR_JUSTIFICADA}
            {...ANIMACAO_GRAFICO}
          />
          <Bar
            dataKey="faltas"
            name="Faltas"
            stackId="chamada"
            fill={COR_FALTA}
            {...ANIMACAO_GRAFICO}
          >
            <LabelList
              dataKey="taxaAssiduidade"
              position="right"
              formatter={(v: unknown) => formatarPercentual(Number(v))}
              style={{ fontSize: 12, fill: "#201c16", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}

export default GraficoAssiduidade;
