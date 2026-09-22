import type { Avaliacao, Frequencia, Nota, Periodo } from "../types";

/**
 * Regras de cálculo do boletim, isoladas da UI para ficarem testáveis.
 */

export type NivelSituacao = "aprovado" | "recuperacao" | "reprovado" | "sem-notas";

/** Arredondamento em 2 casas, igual ao `ROUND(..., 2)` da view no banco. */
export function arredondar2(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

/**
 * Reproduz `vw_aluno_media_dinamica`: SUM(valor_nota * peso) / SUM(peso).
 * Como na view (JOIN entre notas e avaliações), só entram na conta as
 * avaliações que têm nota lançada. Sem nenhuma nota, devolve `null`.
 * `peso` ausente vale 1.
 */
export function calcularMediaPonderada(
  itens: { valor: number | null; peso?: number | null }[]
): number | null {
  let somaPonderada = 0;
  let somaPesos = 0;

  for (const { valor, peso } of itens) {
    if (valor === null) continue;
    const pesoEfetivo = peso ?? 1;
    somaPonderada += valor * pesoEfetivo;
    somaPesos += pesoEfetivo;
  }

  return somaPesos > 0 ? arredondar2(somaPonderada / somaPesos) : null;
}

/** Verde ≥ 7,0 · Amarelo de 5,0 a 6,99 · Vermelho < 5,0. */
export function situacaoPelaMedia(media: number | null): NivelSituacao {
  if (media === null) return "sem-notas";
  if (media >= 7) return "aprovado";
  if (media >= 5) return "recuperacao";
  return "reprovado";
}

export const ROTULO_SITUACAO: Record<NivelSituacao, string> = {
  aprovado: "Aprovado",
  recuperacao: "Recuperação",
  reprovado: "Reprovado",
  "sem-notas": "Sem notas",
};

export function formatarMedia(media: number | null): string {
  return media === null ? "—" : media.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Faltas = registros de `frequencias` com status "Ausente" da matrícula,
 * nas grades informadas e dentro das datas do período letivo (a tabela de
 * frequências não tem FK para o período, só a data da aula).
 */
export function contarFaltas(
  frequencias: Frequencia[],
  idMatricula: number,
  idsGrade: ReadonlySet<number>,
  periodo: Periodo
): number {
  return frequencias.filter((registro) => {
    const data = registro.dataAula.slice(0, 10);
    return (
      registro.matriculaIdMatricula === idMatricula &&
      registro.status === "Ausente" &&
      idsGrade.has(registro.gradeIdGrade) &&
      data >= periodo.dataInicio &&
      data <= periodo.dataFim
    );
  }).length;
}

export function ordenarAvaliacoes(avaliacoes: Avaliacao[]): Avaliacao[] {
  return [...avaliacoes].sort(
    (a, b) =>
      (a.dataAvaliacao ?? "").localeCompare(b.dataAvaliacao ?? "") || a.idAvaliacao - b.idAvaliacao
  );
}

/** Nota já gravada para o par matrícula+avaliação (`uq_nota_matricula_avaliacao`). */
export function acharNota(notas: Nota[], idMatricula: number, idAvaliacao: number): Nota | undefined {
  return notas.find(
    (nota) => nota.matriculaIdMatricula === idMatricula && nota.avaliacaoIdAvaliacao === idAvaliacao
  );
}
