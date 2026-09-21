
export const CHAVES_LOCALSTORAGE = {
  escolas: "portal_v2_escolas",
  alunos: "portal_v2_alunos",
  responsaveis: "portal_v2_responsaveis",
  turmas: "portal_v2_turmas",
  matriculas: "portal_v2_matriculas",
  professores: "portal_v2_professores",
  materias: "portal_v2_materias",
  periodos: "portal_v2_periodos",
  vinculos: "portal_v2_vinculos",
  boletos: "portal_v2_boletos",
  gradesCurriculares: "portal_v2_gradesCurriculares",
  avaliacoes: "portal_v2_avaliacoes",
  frequencias: "portal_v2_frequencias",
  notas: "portal_v2_notas",
  boletins: "portal_v2_boletins",
} as const;

export function carregarColecao<T>(chave: string, mockInicial: T[]): T[] {
  try {
    const bruto = localStorage.getItem(chave);
    if (bruto !== null) {
      return JSON.parse(bruto) as T[];
    }
  } catch {
    // JSON corrompido ou localStorage indisponível (ex.: modo privado) —
    // segue para a inicialização a partir do mock, abaixo.
  }

  salvarColecao(chave, mockInicial);
  return mockInicial;
}

export function salvarColecao<T>(chave: string, dados: T[]): void {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
  } catch {
    // Armazenamento cheio ou indisponível — a UI segue funcionando em
    // memória para o resto desta sessão, só não persiste entre recargas.
  }
}
