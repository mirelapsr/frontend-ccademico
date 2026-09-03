import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { escolasMock, alunosMock, turmasMock, matriculasMock } from "../mock";
import type { Turno } from "../types";
import "./Dashboard.css";

const RUTULOS_TURNO: Record<Turno, string> = {
  Manha: "Manhã",
  Tarde: "Tarde",
  Noite: "Noite",
  Integral: "Integral",
};

// Paleta institucional (marinho + variações) para o gráfico de pizza.
const CORES_TURNO: Record<Turno, string> = {
  Manha: "#1e3a8a",
  Tarde: "#2f6fed",
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

  // --- KPIs -----------------------------------------------------------
  const totalEscolas = escolasMock.length;

  const totalAlunosAtivos = useMemo(
    () => alunosMock.filter((aluno) => aluno.situacao === "Ativo").length,
    []
  );

  const totalTurmas = turmasMock.length;

  // Só entram no cálculo as turmas com capacidade informada — sem isso a
  // "taxa de ocupação" perderia o sentido (denominador desconhecido).
  const turmasComCapacidade = useMemo(
    () => turmasMock.filter((turma) => typeof turma.capacidade === "number" && turma.capacidade > 0),
    []
  );

  const taxaOcupacaoMedia = useMemo(() => {
    const capacidadeTotal = turmasComCapacidade.reduce(
      (soma, turma) => soma + (turma.capacidade ?? 0),
      0
    );
    if (capacidadeTotal === 0) return 0;

    const idsComCapacidade = new Set(turmasComCapacidade.map((turma) => turma.idTurma));
    const matriculasAtivasComCapacidade = matriculasMock.filter(
      (matricula) => matricula.situacao === "Ativa" && idsComCapacidade.has(matricula.turmaIdTurma)
    ).length;

    return (matriculasAtivasComCapacidade / capacidadeTotal) * 100;
  }, [turmasComCapacidade]);

  // --- Gráfico principal: ocupação por turma ---------------------------
  const dadosOcupacao = useMemo(
    () =>
      turmasComCapacidade.map((turma) => {
        const ocupacaoReal = matriculasMock.filter(
          (matricula) =>
            matricula.turmaIdTurma === turma.idTurma && matricula.situacao === "Ativa"
        ).length;

        return {
          nome: turma.nomeTurma,
          capacidade: turma.capacidade ?? 0,
          ocupacao: ocupacaoReal,
        };
      }),
    [turmasComCapacidade]
  );

  // --- Gráfico secundário: turmas por turno -----------------------------
  const dadosPorTurno = useMemo(() => {
    const turnos: Turno[] = ["Manha", "Tarde", "Noite", "Integral"];
    return turnos
      .map((turno) => ({
        turno,
        nome: RUTULOS_TURNO[turno],
        quantidade: turmasMock.filter((turma) => turma.turno === turno).length,
      }))
      .filter((item) => item.quantidade > 0);
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard__cabecalho">
        <h1>Dashboard — Visão Geral</h1>
        <p className="dashboard__data">{dataHoje}</p>
      </header>

      <section className="dashboard__kpis" aria-label="Indicadores gerais">
        <CardKpi rotulo="Total de Escolas" valor={String(totalEscolas)} />
        <CardKpi
          rotulo="Alunos Ativos"
          valor={String(totalAlunosAtivos)}
          descricao={`de ${alunosMock.length} cadastrados`}
        />
        <CardKpi rotulo="Total de Turmas" valor={String(totalTurmas)} />
        <CardKpi
          rotulo="Taxa Média de Ocupação"
          valor={`${taxaOcupacaoMedia.toFixed(1)}%`}
          descricao="matrículas ativas / capacidade"
        />
      </section>

      <section className="dashboard__graficos">
        <div className="dashboard__grafico dashboard__grafico--principal">
          <h2>Ocupação das Turmas</h2>
          {dadosOcupacao.length === 0 ? (
            <p className="dashboard__grafico-vazio">
              Nenhuma turma com capacidade informada ainda.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosOcupacao} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="nome"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={56}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="capacidade" name="Capacidade" fill="#e5e7eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="ocupacao" name="Ocupação Real" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="dashboard__grafico dashboard__grafico--secundario">
          <h2>Turmas por Turno</h2>
          {dadosPorTurno.length === 0 ? (
            <p className="dashboard__grafico-vazio">Nenhuma turma cadastrada ainda.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={dadosPorTurno}
                  dataKey="quantidade"
                  nameKey="nome"
                  innerRadius={48}
                  outerRadius={84}
                  paddingAngle={2}
                >
                  {dadosPorTurno.map((entrada) => (
                    <Cell key={entrada.turno} fill={CORES_TURNO[entrada.turno]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
