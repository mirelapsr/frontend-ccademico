import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatarMoeda,
  formatarMoedaCompacta,
  type ResumoFinanceiro,
  type SituacaoFinanceira,
} from "../../utils/dashboard";
import { ANIMACAO_GRAFICO } from "./animacao";
import CardGrafico from "./CardGrafico";
import { AMBAR, AZUL_CLARO, VERMELHO } from "./cores";
import TooltipGrafico from "./TooltipGrafico";

type Modo = "valor" | "quantidade";

const SERIES: ReadonlyArray<{
  situacao: SituacaoFinanceira;
  cor: string;
  chaveValor: "valorPago" | "valorPendente" | "valorAtrasado";
  chaveQtd: "qtdPago" | "qtdPendente" | "qtdAtrasado";
}> = [
  { situacao: "Pago", cor: AZUL_CLARO, chaveValor: "valorPago", chaveQtd: "qtdPago" },
  { situacao: "Pendente", cor: AMBAR, chaveValor: "valorPendente", chaveQtd: "qtdPendente" },
  { situacao: "Atrasado", cor: VERMELHO, chaveValor: "valorAtrasado", chaveQtd: "qtdAtrasado" },
];

interface Props {
  resumo: ResumoFinanceiro;
  carregando: boolean;
  erro: string | null;
  className?: string;
  aoLimparFiltros?: () => void;
}

function GraficoSaudeFinanceira({ resumo, carregando, erro, className, aoLimparFiltros }: Props) {
  const [modo, setModo] = useState<Modo>("valor");
  const porValor = modo === "valor";

  const seletor = (
    <div className="alternador" role="group" aria-label="Unidade do gráfico">
      {(["valor", "quantidade"] as const).map((opcao) => (
        <button
          key={opcao}
          type="button"
          aria-pressed={modo === opcao}
          className={modo === opcao ? "alternador__botao alternador__botao--ativo" : "alternador__botao"}
          onClick={() => setModo(opcao)}
        >
          {opcao === "valor" ? "R$" : "Qtd."}
        </button>
      ))}
    </div>
  );

  return (
    <CardGrafico
      titulo="Saúde Financeira — Boletos"
      subtitulo={
        resumo.valorTotal > 0
          ? `Inadimplência: ${resumo.taxaInadimplencia.toFixed(1)}% (${formatarMoeda(resumo.valorAtrasado)} em atraso de ${formatarMoeda(resumo.valorTotal)})`
          : "Boletos por competência e situação"
      }
      acoes={seletor}
      className={className}
      carregando={carregando}
      erro={erro}
      vazio={resumo.serie.length === 0}
      mensagemVazio="Nenhum boleto encontrado para os filtros selecionados."
      aoLimparFiltros={aoLimparFiltros}
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={resumo.serie} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5dfd2" vertical={false} />
          <XAxis dataKey="rotulo" tick={{ fontSize: 12, fill: "#6b6558" }} tickLine={false} />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#6b6558" }}
            tickFormatter={(v: number) => (porValor ? formatarMoedaCompacta(v) : String(v))}
            width={porValor ? 72 : 40}
          />
          <Tooltip
            cursor={{ fill: "rgba(22, 35, 63, 0.06)" }}
            content={
              <TooltipGrafico
                formatarValor={(v) => (porValor ? formatarMoeda(v) : `${v} boleto(s)`)}
                rodape={(itens) => {
                  const total = itens.reduce((soma, i) => soma + Number(i.value ?? 0), 0);
                  return `Total: ${porValor ? formatarMoeda(total) : `${total} boleto(s)`}`;
                }}
              />
            }
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          {SERIES.map((s, i) => (
            <Bar
              key={s.situacao}
              dataKey={porValor ? s.chaveValor : s.chaveQtd}
              name={s.situacao}
              stackId="boletos"
              fill={s.cor}
              radius={i === SERIES.length - 1 ? [4, 4, 0, 0] : 0}
              {...ANIMACAO_GRAFICO}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}

export default GraficoSaudeFinanceira;
