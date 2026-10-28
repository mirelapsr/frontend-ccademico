import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ANIMACAO_GRAFICO } from "../components/dashboard/animacao";
import { AZUL_CLARO } from "../components/dashboard/cores";
import CardGrafico from "../components/dashboard/CardGrafico";
import FiltrosDashboard from "../components/dashboard/FiltrosDashboard";
import GraficoAlunosPorSerie from "../components/dashboard/GraficoAlunosPorSerie";
import GraficoDesempenhoMaterias from "../components/dashboard/GraficoDesempenhoMaterias";
import GraficoSaudeFinanceira from "../components/dashboard/GraficoSaudeFinanceira";
import TooltipGrafico from "../components/dashboard/TooltipGrafico";
import { useLista } from "../hooks/useLista";
import type {
  Aluno,
  Avaliacao,
  Boleto,
  Escola,
  GradeCurricular,
  Materia,
  Matricula,
  Nota,
  Turma,
  Turno,
} from "../types";
import {
  FILTROS_PADRAO,
  anosLetivosDisponiveis,
  calcularAlunosPorSerie,
  calcularDesempenhoPorMateria,
  calcularKpis,
  calcularOcupacaoPorTurma,
  calcularSaudeFinanceira,
  calcularTurmasPorTurno,
  filtrarTurmas,
  filtrosEstaoNoPadrao,
  type FiltrosDashboard as Filtros,
} from "../utils/dashboard";
import "../components/dashboard/dashboard.css";
import "./Dashboard.css";

// Paleta institucional (marinho + variações) para o gráfico de pizza.
const CORES_TURNO: Record<Turno, string> = {
  Manha: "#1e3a8a",
  Tarde: AZUL_CLARO,
  Integral: "#16233f",
  Noite: "#6e1423",
};

function formatarDataHoje(): string {
  const formatado = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return formatado.charAt(0).toUpperCase() + formatado.slice(1);
}

interface CardKpiProps {
  rotulo: string;
  valor: string;
  descricao?: string;
}

function CardKpi({ rotulo, valor, descricao }: CardKpiProps) {
  return (
    <article className="card-kpi">
      <span className="card-kpi__rotulo">{rotulo}</span>
      <strong className="card-kpi__valor">{valor}</strong>
      {descricao && <span className="card-kpi__descricao">{descricao}</span>}
    </article>
  );
}

function Dashboard() {
  const dataHoje = useMemo(formatarDataHoje, []);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_PADRAO);

  // --- Dados brutos: carregados UMA vez; filtros nunca disparam nova requisição ---
  const { dados: escolas, carregando: carregandoEscolas, erro: erroEscolas } = useLista<Escola>("/escolas");
  const { dados: alunos, carregando: carregandoAlunos, erro: erroAlunos } = useLista<Aluno>("/alunos");
  const { dados: turmas, carregando: carregandoTurmas, erro: erroTurmas } = useLista<Turma>("/turmas");
  const { dados: matriculas, carregando: carregandoMatriculas, erro: erroMatriculas } =
    useLista<Matricula>("/matriculas");

  // Dados dos gráficos novos: cada um falha de forma isolada (o erro aparece só no seu card).
  const { dados: notas, carregando: carregandoNotas, erro: erroNotas } = useLista<Nota>("/notas");
  const { dados: avaliacoes, carregando: carregandoAvaliacoes, erro: erroAvaliacoes } =
    useLista<Avaliacao>("/avaliacoes");
  const { dados: grades, carregando: carregandoGrades, erro: erroGrades } =
    useLista<GradeCurricular>("/grades");
  const { dados: materias, carregando: carregandoMaterias, erro: erroMaterias } =
    useLista<Materia>("/materias");
  const { dados: boletos, carregando: carregandoBoletos, erro: erroBoletos } = useLista<Boleto>("/boletos");

  const carregandoBase = carregandoEscolas || carregandoAlunos || carregandoTurmas || carregandoMatriculas;
  const erroBase = erroEscolas ?? erroAlunos ?? erroTurmas ?? erroMatriculas;

  const carregandoDesempenho = carregandoNotas || carregandoAvaliacoes || carregandoGrades || carregandoMaterias;
  const erroDesempenho = erroNotas ?? erroAvaliacoes ?? erroGrades ?? erroMaterias;

  // --- Cálculos reativos aos filtros (useMemo; nenhum acesso à rede) ----------------
  const anosDisponiveis = useMemo(() => anosLetivosDisponiveis(turmas), [turmas]);

  const turmasFiltradas = useMemo(() => filtrarTurmas(turmas, filtros), [turmas, filtros]);

  const kpis = useMemo(
    () => calcularKpis({ escolas, alunos, matriculas, turmasFiltradas, filtros }),
    [escolas, alunos, matriculas, turmasFiltradas, filtros]
  );

  const dadosOcupacao = useMemo(
    () => calcularOcupacaoPorTurma(turmasFiltradas, matriculas),
    [turmasFiltradas, matriculas]
  );

  const dadosPorTurno = useMemo(() => calcularTurmasPorTurno(turmasFiltradas), [turmasFiltradas]);

  const dadosDesempenho = useMemo(
    () => calcularDesempenhoPorMateria({ notas, avaliacoes, grades, materias, turmasFiltradas }),
    [notas, avaliacoes, grades, materias, turmasFiltradas]
  );

  const resumoFinanceiro = useMemo(
    () => calcularSaudeFinanceira({ boletos, matriculas, turmasFiltradas, filtros }),
    [boletos, matriculas, turmasFiltradas, filtros]
  );

  const dadosPorSerie = useMemo(
    () => calcularAlunosPorSerie(turmasFiltradas, matriculas),
    [turmasFiltradas, matriculas]
  );

  const limparFiltros = () => setFiltros(FILTROS_PADRAO);
  // O botão "Limpar filtros" nos estados vazios só faz sentido se há filtro aplicado.
  const acaoLimpar = filtrosEstaoNoPadrao(filtros) ? undefined : limparFiltros;

  const valorKpi = (valor: string) => (carregandoBase ? "—" : valor);

  return (
    <div className="dashboard">
      <header className="dashboard__cabecalho">
        <h1>Dashboard — Visão Geral</h1>
        <p className="dashboard__data">{dataHoje}</p>
      </header>

      <FiltrosDashboard
        filtros={filtros}
        escolas={escolas}
        anosDisponiveis={anosDisponiveis}
        aoMudar={setFiltros}
        desabilitado={carregandoBase}
      />

      {erroBase && (
        <p className="dashboard__erro" role="alert">
          {erroBase}
        </p>
      )}

      <section className="dashboard__kpis" aria-label="Indicadores gerais" aria-live="polite">
        <CardKpi rotulo="Total de Escolas" valor={valorKpi(String(kpis.totalEscolas))} />
        <CardKpi
          rotulo="Alunos Ativos"
          valor={valorKpi(String(kpis.alunosAtivos))}
          descricao={`de ${kpis.totalAlunosCadastrados} ${acaoLimpar ? "no recorte" : "cadastrados"}`}
        />
        <CardKpi rotulo="Total de Turmas" valor={valorKpi(String(kpis.totalTurmas))} />
        <CardKpi
          rotulo="Taxa Média de Ocupação"
          valor={valorKpi(`${kpis.taxaOcupacao.toFixed(1)}%`)}
          descricao="matrículas ativas / capacidade"
        />
      </section>

      <div className="dashboard__graficos">
        <CardGrafico
          titulo="Ocupação das Turmas"
          className="dashboard__grafico--principal"
          carregando={carregandoBase}
          vazio={dadosOcupacao.length === 0}
          mensagemVazio="Nenhuma turma com capacidade informada para os filtros selecionados."
          aoLimparFiltros={acaoLimpar}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosOcupacao} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5dfd2" vertical={false} />
              <XAxis
                dataKey="nome"
                tick={{ fontSize: 12, fill: "#6b6558" }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={56}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b6558" }} />
              <Tooltip
                cursor={{ fill: "rgba(22, 35, 63, 0.06)" }}
                content={<TooltipGrafico formatarValor={(v) => `${v} aluno(s)`} />}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="capacidade" name="Capacidade" fill="#b9b2a2" radius={[6, 6, 0, 0]} {...ANIMACAO_GRAFICO} />
              <Bar dataKey="ocupacao" name="Ocupação Real" fill="#1e3a8a" radius={[6, 6, 0, 0]} {...ANIMACAO_GRAFICO} />
            </BarChart>
          </ResponsiveContainer>
        </CardGrafico>

        <CardGrafico
          titulo="Turmas por Turno"
          className="dashboard__grafico--secundario"
          carregando={carregandoBase}
          vazio={dadosPorTurno.length === 0}
          mensagemVazio="Nenhuma turma para os filtros selecionados."
          aoLimparFiltros={acaoLimpar}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip content={<TooltipGrafico formatarValor={(v) => `${v} turma(s)`} />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Pie
                data={dadosPorTurno}
                dataKey="quantidade"
                nameKey="nome"
                innerRadius={48}
                outerRadius={84}
                paddingAngle={2}
                {...ANIMACAO_GRAFICO}
              >
                {dadosPorTurno.map((entrada) => (
                  <Cell key={entrada.turno} fill={CORES_TURNO[entrada.turno]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardGrafico>

        <GraficoDesempenhoMaterias
          className="dashboard__grafico--metade"
          dados={dadosDesempenho}
          carregando={carregandoDesempenho || carregandoBase}
          erro={erroDesempenho}
          aoLimparFiltros={acaoLimpar}
        />

        <GraficoAlunosPorSerie
          className="dashboard__grafico--metade"
          dados={dadosPorSerie}
          carregando={carregandoBase}
          erro={null}
          aoLimparFiltros={acaoLimpar}
        />

        <GraficoSaudeFinanceira
          className="dashboard__grafico--cheio"
          resumo={resumoFinanceiro}
          carregando={carregandoBoletos || carregandoBase}
          erro={erroBoletos}
          aoLimparFiltros={acaoLimpar}
        />
      </div>
    </div>
  );
}

export default Dashboard;
