import type { Matricula, Turma } from "../types";

/**
 * Índice idAluno → idEscola a partir da matrícula ativa de cada aluno
 * (mesmo critério do join de `PaginaAlunos`). Usar dentro de `useMemo`:
 * a montagem é O(matrículas) e cada consulta depois é O(1).
 */
export function mapearEscolaPorAluno(
  matriculas: Matricula[],
  turmas: Turma[]
): Map<number, number> {
  const escolaPorTurma = new Map(turmas.map((turma) => [turma.idTurma, turma.escolaId]));
  const escolaPorAluno = new Map<number, number>();
  for (const matricula of matriculas) {
    if (matricula.situacao !== "Ativa") continue;
    const escolaId = escolaPorTurma.get(matricula.turmaId);
    if (escolaId !== undefined) escolaPorAluno.set(matricula.alunoId, escolaId);
  }
  return escolaPorAluno;
}
