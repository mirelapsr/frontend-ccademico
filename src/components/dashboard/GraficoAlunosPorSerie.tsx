import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PontoSerie } from "../../utils/dashboard";
import { ANIMACAO_GRAFICO } from "./animacao";
import CardGrafico from "./CardGrafico";
import { AZUL_CLARO } from "./cores";
import TooltipGrafico from "./TooltipGrafico";

interface Props {
  dados: readonly PontoSerie[];
  carregando: boolean;
  erro: string | null;
  className?: string;
  aoLimparFiltros?: () => void;
}

function GraficoAlunosPorSerie({ dados, carregando, erro, className, aoLimparFiltros }: Props) {
  const muitasSeries = dados.length > 6;
  const total = dados.reduce((soma, d) => soma + d.alunos, 0);

  return (
    <CardGrafico
      titulo="Alunos por Série"
      subtitulo={total > 0 ? `${total} matrícula(s) ativa(s)` : "Distribuição de matrículas ativas"}
      className={className}
      carregando={carregando}
      erro={erro}
      vazio={dados.length === 0}
      mensagemVazio="Nenhuma matrícula ativa para os filtros selecionados."
      aoLimparFiltros={aoLimparFiltros}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={[...dados]} margin={{ top: 20, right: 12, left: 0, bottom: muitasSeries ? 28 : 4 }}>
          <defs>
            <linearGradient id="gradiente-series" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={AZUL_CLARO} />
              <stop offset="100%" stopColor="#16233f" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5dfd2" vertical={false} />
          <XAxis
            dataKey="serie"
            interval={0}
            tick={{ fontSize: 12, fill: "#6b6558" }}
            tickLine={false}
            angle={muitasSeries ? -25 : 0}
            textAnchor={muitasSeries ? "end" : "middle"}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b6558" }} width={36} />
          <Tooltip
            cursor={{ fill: "rgba(22, 35, 63, 0.06)" }}
            content={<TooltipGrafico formatarValor={(v) => `${v} aluno(s)`} />}
          />
          <Bar dataKey="alunos" name="Alunos" fill="url(#gradiente-series)" radius={[6, 6, 0, 0]} {...ANIMACAO_GRAFICO}>
            <LabelList dataKey="alunos" position="top" style={{ fontSize: 12, fontWeight: 600, fill: "#16233f" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}

export default GraficoAlunosPorSerie;
