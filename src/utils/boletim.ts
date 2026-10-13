import type { Avaliacao, Frequencia, Nota, Periodo } from "../types";

export type NivelSituacao = "aprovado" | "recuperacao" | "reprovado" | "sem-notas";

export function arredondar2(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

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
  return media === null
    ? "—"
    : media.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function contarFaltas(
  frequencias: Frequencia[],
  idMatricula: number,
  idsGrade: ReadonlySet<number>,
  periodo: Periodo,
  alunoId?: number
): number {
  if (!Array.isArray(frequencias) || !periodo) return 0;

  const inicio = periodo.dataInicio ? String(periodo.dataInicio).slice(0, 10) : "";
  const fim = periodo.dataFim ? String(periodo.dataFim).slice(0, 10) : "";

  return frequencias.filter((registro) => {
    const matriculaReg =
      (registro as any).matriculaId ??
      (registro as any).matriculaIdMatricula ??
      (registro as any).idMatricula;

    const alunoReg =
      (registro as any).alunoId ??
      (registro as any).alunoIdAluno ??
      (registro as any).idAluno;

    const pertenceAoAluno =
      (matriculaReg !== undefined && matriculaReg === idMatricula) ||
      (alunoId !== undefined && alunoReg !== undefined && alunoReg === alunoId);

    if (!pertenceAoAluno) return false;

    const gradeReg =
      (registro as any).gradeId ??
      (registro as any).gradeCurricularIdGrade ??
      (registro as any).gradeIdGrade ??
      (registro as any).idGrade;

    if (idsGrade.size > 0 && gradeReg !== undefined && !idsGrade.has(Number(gradeReg))) {
      return false;
    }

    const campoData =
      (registro as any).dataAula ??
      (registro as any).dataChamada ??
      (registro as any).dataFrequencia ??
      (registro as any).data;

    if (campoData && inicio && fim) {
      const data = String(campoData).slice(0, 10);
      if (data < inicio || data > fim) {
        return false;
      }
    }

    const presenca = (registro as any).presente;
    const status = String((registro as any).status ?? (registro as any).situacao ?? "").trim().toLowerCase();

    return (
      presenca === false ||
      status === "ausente" ||
      status === "falta" ||
      status === "f" ||
      status === "nao"
    );
  }).length;
}

export function ordenarAvaliacoes(avaliacoes: Avaliacao[]): Avaliacao[] {
  if (!Array.isArray(avaliacoes)) return [];
  return [...avaliacoes].sort(
    (a, b) =>
      (a.dataAvaliacao ?? "").localeCompare(b.dataAvaliacao ?? "") || a.idAvaliacao - b.idAvaliacao
  );
}

export function acharNota(
  notas: Nota[],
  idIdentificadorAlunoOuMatricula: number,
  idAvaliacao: number
): Nota | undefined {
  if (!Array.isArray(notas)) return undefined;

  return notas.find((nota) => {
    const idAluno =
      (nota as any).alunoId ??
      (nota as any).matriculaIdMatricula ??
      (nota as any).matriculaId;
    const avaliacao = (nota as any).avaliacaoId ?? (nota as any).avaliacaoIdAvaliacao;
    return idAluno === idIdentificadorAlunoOuMatricula && avaliacao === idAvaliacao;
  });
}