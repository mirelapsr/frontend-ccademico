/**
 * Regras de cálculo do Dashboard (funções puras, sem React).
 *
 * Todas as agregações partem das listas já carregadas da API; os filtros globais
 * apenas recortam essas listas no cliente, sem novas requisições.
 *
 * Relações usadas (a API não tem escola/ano/turno direto em aluno, nota ou boleto):
 *   Turma (escolaId, anoLetivo, turno, serie)
 *     ├─ Matricula (turmaId → alunoId)  ── Aluno ── Boleto (alunoId)
 *     └─ GradeCurricular (turmaId, materiaId) ── Avaliacao (gradeId) ── Nota (avaliacaoId)
 */
import type {
  Aluno,
  Avaliacao,
  Boleto,
  Decimal,
  Escola,
  GradeCurricular,
  Materia,
  Matricula,
  Nota,
  SituacaoBoleto,
  Turma,
  Turno,
} from "../types";
import { arredondar2, calcularMediaPonderada } from "./boletim";

// ---------------------------------------------------------------------------
// Filtros
// ---------------------------------------------------------------------------

export type FiltroTurno = Turno | "Todos";
export type FiltroAno = number | "Todos";

export interface FiltrosDashboard {
  /** `null` = todas as escolas. */
  escolaId: number | null;
  anoLetivo: FiltroAno;
  turno: FiltroTurno;
}

export const FILTROS_PADRAO: FiltrosDashboard = {
  escolaId: null,
  anoLetivo: "Todos",
  turno: "Todos",
};

export const OPCOES_TURNO: ReadonlyArray<{ valor: FiltroTurno; rotulo: string }> = [
  { valor: "Todos", rotulo: "Todos" },
  { valor: "Manha", rotulo: "Manhã" },
  { valor: "Tarde", rotulo: "Tarde" },
  { valor: "Noite", rotulo: "Noite" },
  { valor: "Integral", rotulo: "Integral" },
];

export function filtrosEstaoNoPadrao(filtros: FiltrosDashboard): boolean {
  return (
    filtros.escolaId === FILTROS_PADRAO.escolaId &&
    filtros.anoLetivo === FILTROS_PADRAO.anoLetivo &&
    filtros.turno === FILTROS_PADRAO.turno
  );
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

/** A API devolve `Decimal` como string ("8.50"); converte com segurança. */
export function paraNumero(valor: Decimal | null | undefined): number {
  const n = typeof valor === "number" ? valor : Number(valor);
  return Number.isFinite(n) ? n : 0;
}

export function anosLetivosDisponiveis(turmas: readonly Turma[]): number[] {
  return [...new Set(turmas.map((t) => t.anoLetivo))].sort((a, b) => b - a);
}

export function filtrarTurmas(turmas: readonly Turma[], filtros: FiltrosDashboard): Turma[] {
  return turmas.filter(
    (t) =>
      (filtros.escolaId === null || t.escolaId === filtros.escolaId) &&
      (filtros.anoLetivo === "Todos" || t.anoLetivo === filtros.anoLetivo) &&
      (filtros.turno === "Todos" || t.turno === filtros.turno)
  );
}

// ---------------------------------------------------------------------------
// KPIs
// ---------------------------------------------------------------------------

export interface KpisDashboard {
  totalEscolas: number;
  alunosAtivos: number;
  totalAlunosCadastrados: number;
  totalTurmas: number;
  /** Percentual (0–100+) de matrículas ativas sobre a capacidade informada. */
  taxaOcupacao: number;
}

interface EntradaKpis {
  escolas: readonly Escola[];
  alunos: readonly Aluno[];
  matriculas: readonly Matricula[];
  turmasFiltradas: readonly Turma[];
  filtros: FiltrosDashboard;
}

export function calcularKpis({
  escolas,
  alunos,
  matriculas,
  turmasFiltradas,
  filtros,
}: EntradaKpis): KpisDashboard {
  const idsTurmas = new Set(turmasFiltradas.map((t) => t.idTurma));
  const filtroDeTurmaAtivo = filtros.anoLetivo !== "Todos" || filtros.turno !== "Todos";

  // Escolas: respeita a escola escolhida e, se houver filtro de ano/turno,
  // só conta as que realmente têm turma naquele recorte.
  const escolasComTurma = new Set(turmasFiltradas.map((t) => t.escolaId));
  const totalEscolas = escolas.filter(
    (e) =>
      (filtros.escolaId === null || e.idEscola === filtros.escolaId) &&
      (!filtroDeTurmaAtivo || escolasComTurma.has(e.idEscola))
  ).length;

  const matriculasAtivas = matriculas.filter(
    (m) => m.situacao === "Ativa" && idsTurmas.has(m.turmaId)
  );

  // Sem nenhum filtro, mantém a regra original (todo aluno com situação "Ativo").
  // Com filtro, aluno ativo = aluno "Ativo" com matrícula ativa no recorte.
  let alunosAtivos: number;
  let totalAlunosCadastrados: number;
  if (filtrosEstaoNoPadrao(filtros)) {
    alunosAtivos = alunos.filter((a) => a.situacao === "Ativo").length;
    totalAlunosCadastrados = alunos.length;
  } else {
    const idsNoRecorte = new Set(
      matriculas.filter((m) => idsTurmas.has(m.turmaId)).map((m) => m.alunoId)
    );
    const idsAtivosNoRecorte = new Set(matriculasAtivas.map((m) => m.alunoId));
    alunosAtivos = alunos.filter(
      (a) => a.situacao === "Ativo" && idsAtivosNoRecorte.has(a.idAluno)
    ).length;
    totalAlunosCadastrados = alunos.filter((a) => idsNoRecorte.has(a.idAluno)).length;
  }

  const turmasComCapacidade = turmasFiltradas.filter(
    (t) => typeof t.capacidade === "number" && t.capacidade > 0
  );
  const capacidadeTotal = turmasComCapacidade.reduce((s, t) => s + (t.capacidade ?? 0), 0);
  const idsComCapacidade = new Set(turmasComCapacidade.map((t) => t.idTurma));
  const ocupadas = matriculasAtivas.filter((m) => idsComCapacidade.has(m.turmaId)).length;

  return {
    totalEscolas,
    alunosAtivos,
    totalAlunosCadastrados,
    totalTurmas: turmasFiltradas.length,
    taxaOcupacao: capacidadeTotal === 0 ? 0 : (ocupadas / capacidadeTotal) * 100,
  };
}

// ---------------------------------------------------------------------------
// Gráficos já existentes (agora reativos aos filtros)
// ---------------------------------------------------------------------------

export interface PontoOcupacao {
  nome: string;
  capacidade: number;
  ocupacao: number;
}

export function calcularOcupacaoPorTurma(
  turmasFiltradas: readonly Turma[],
  matriculas: readonly Matricula[]
): PontoOcupacao[] {
  const ativasPorTurma = new Map<number, number>();
  for (const m of matriculas) {
    if (m.situacao === "Ativa") {
      ativasPorTurma.set(m.turmaId, (ativasPorTurma.get(m.turmaId) ?? 0) + 1);
    }
  }
  return turmasFiltradas
    .filter((t) => typeof t.capacidade === "number" && t.capacidade > 0)
    .map((t) => ({
      nome: t.nomeTurma,
      capacidade: t.capacidade ?? 0,
      ocupacao: ativasPorTurma.get(t.idTurma) ?? 0,
    }));
}

export interface PontoTurno {
  turno: Turno;
  nome: string;
  quantidade: number;
}

export function calcularTurmasPorTurno(turmasFiltradas: readonly Turma[]): PontoTurno[] {
  const rotulos: Record<Turno, string> = {
    Manha: "Manhã",
    Tarde: "Tarde",
    Noite: "Noite",
    Integral: "Integral",
  };
  return (Object.keys(rotulos) as Turno[])
    .map((turno) => ({
      turno,
      nome: rotulos[turno],
      quantidade: turmasFiltradas.filter((t) => t.turno === turno).length,
    }))
    .filter((p) => p.quantidade > 0);
}

// ---------------------------------------------------------------------------
// Novo: desempenho (média das notas por matéria)
// ---------------------------------------------------------------------------

export interface PontoDesempenho {
  materia: string;
  /** Média ponderada pelo peso da avaliação (mesma regra do boletim), 0–10. */
  media: number;
  totalNotas: number;
}

interface EntradaDesempenho {
  notas: readonly Nota[];
  avaliacoes: readonly Avaliacao[];
  grades: readonly GradeCurricular[];
  materias: readonly Materia[];
  turmasFiltradas: readonly Turma[];
}

export function calcularDesempenhoPorMateria({
  notas,
  avaliacoes,
  grades,
  materias,
  turmasFiltradas,
}: EntradaDesempenho): PontoDesempenho[] {
  const idsTurmas = new Set(turmasFiltradas.map((t) => t.idTurma));
  const avaliacaoPorId = new Map(avaliacoes.map((a) => [a.idAvaliacao, a]));
  const gradePorId = new Map(grades.map((g) => [g.idGrade, g]));
  const nomeMateria = new Map(materias.map((m) => [m.idMateria, m.nomeMateria]));

  const porMateria = new Map<number, { valor: number; peso: number }[]>();

  for (const nota of notas) {
    const avaliacao = avaliacaoPorId.get(nota.avaliacaoId);
    const grade = avaliacao ? gradePorId.get(avaliacao.gradeId) : undefined;
    if (!avaliacao || !grade || !idsTurmas.has(grade.turmaId)) continue;

    const lista = porMateria.get(grade.materiaId) ?? [];
    lista.push({ valor: paraNumero(nota.valorNota), peso: paraNumero(avaliacao.peso) || 1 });
    porMateria.set(grade.materiaId, lista);
  }

  return [...porMateria.entries()]
    .map(([materiaId, itens]) => ({
      materia: nomeMateria.get(materiaId) ?? `Matéria #${materiaId}`,
      media: calcularMediaPonderada(itens) ?? 0,
      totalNotas: itens.length,
    }))
    .sort((a, b) => b.media - a.media);
}

// ---------------------------------------------------------------------------
// Novo: saúde financeira (boletos por competência × situação)
// ---------------------------------------------------------------------------

export type SituacaoFinanceira = Extract<SituacaoBoleto, "Pago" | "Pendente" | "Atrasado">;
export const SITUACOES_FINANCEIRAS: readonly SituacaoFinanceira[] = ["Pago", "Pendente", "Atrasado"];

export interface PontoFinanceiro {
  /** AAAA-MM */
  competencia: string;
  /** Rótulo curto para o eixo, ex.: "mar/26". */
  rotulo: string;
  valorPago: number;
  valorPendente: number;
  valorAtrasado: number;
  qtdPago: number;
  qtdPendente: number;
  qtdAtrasado: number;
}

export interface ResumoFinanceiro {
  serie: PontoFinanceiro[];
  valorTotal: number;
  valorAtrasado: number;
  /** % do valor emitido que está em atraso. */
  taxaInadimplencia: number;
}

const MESES_ABREV = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function rotuloCompetencia(competencia: string): string {
  const [ano, mes] = competencia.split("-");
  const indice = Number(mes) - 1;
  return MESES_ABREV[indice] ? `${MESES_ABREV[indice]}/${ano.slice(2)}` : competencia;
}

interface EntradaFinanceiro {
  boletos: readonly Boleto[];
  matriculas: readonly Matricula[];
  turmasFiltradas: readonly Turma[];
  filtros: FiltrosDashboard;
}

export function calcularSaudeFinanceira({
  boletos,
  matriculas,
  turmasFiltradas,
  filtros,
}: EntradaFinanceiro): ResumoFinanceiro {
  const idsTurmas = new Set(turmasFiltradas.map((t) => t.idTurma));
  const alunosNoRecorte = new Set(
    matriculas.filter((m) => idsTurmas.has(m.turmaId)).map((m) => m.alunoId)
  );
  const semFiltro = filtrosEstaoNoPadrao(filtros);

  const porCompetencia = new Map<string, PontoFinanceiro>();
  let valorTotal = 0;
  let valorAtrasado = 0;

  for (const boleto of boletos) {
    if (boleto.situacao === "Cancelado") continue;
    if (!semFiltro && !alunosNoRecorte.has(boleto.alunoId)) continue;
    if (filtros.anoLetivo !== "Todos" && !boleto.competencia.startsWith(`${filtros.anoLetivo}-`)) {
      continue;
    }

    const ponto =
      porCompetencia.get(boleto.competencia) ??
      ({
        competencia: boleto.competencia,
        rotulo: rotuloCompetencia(boleto.competencia),
        valorPago: 0,
        valorPendente: 0,
        valorAtrasado: 0,
        qtdPago: 0,
        qtdPendente: 0,
        qtdAtrasado: 0,
      } satisfies PontoFinanceiro);

    const valor = paraNumero(boleto.valorMensalidade);
    valorTotal += valor;

    if (boleto.situacao === "Pago") {
      ponto.valorPago += valor;
      ponto.qtdPago += 1;
    } else if (boleto.situacao === "Atrasado") {
      ponto.valorAtrasado += valor;
      ponto.qtdAtrasado += 1;
      valorAtrasado += valor;
    } else {
      ponto.valorPendente += valor;
      ponto.qtdPendente += 1;
    }
    porCompetencia.set(boleto.competencia, ponto);
  }

  return {
    serie: [...porCompetencia.values()].sort((a, b) => a.competencia.localeCompare(b.competencia)),
    valorTotal: arredondar2(valorTotal),
    valorAtrasado: arredondar2(valorAtrasado),
    taxaInadimplencia: valorTotal === 0 ? 0 : (valorAtrasado / valorTotal) * 100,
  };
}

// ---------------------------------------------------------------------------
// Novo: alunos (matrículas ativas) por série
// ---------------------------------------------------------------------------

export interface PontoSerie {
  serie: string;
  alunos: number;
}

export function calcularAlunosPorSerie(
  turmasFiltradas: readonly Turma[],
  matriculas: readonly Matricula[]
): PontoSerie[] {
  const serieDaTurma = new Map(
    turmasFiltradas.map((t) => [t.idTurma, t.serie?.trim() || "Sem série"])
  );
  const contagem = new Map<string, number>();

  for (const m of matriculas) {
    if (m.situacao !== "Ativa") continue;
    const serie = serieDaTurma.get(m.turmaId);
    if (serie) contagem.set(serie, (contagem.get(serie) ?? 0) + 1);
  }

  return [...contagem.entries()]
    .map(([serie, alunos]) => ({ serie, alunos }))
    .sort((a, b) => a.serie.localeCompare(b.serie, "pt-BR", { numeric: true }));
}

// ---------------------------------------------------------------------------
// Formatação
// ---------------------------------------------------------------------------

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarMoedaCompacta(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  });
}
