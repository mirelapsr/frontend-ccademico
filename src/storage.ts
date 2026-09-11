/**
 * Camada única de persistência local.
 *
 * Regra de inicialização: ao ler uma coleção, se a chave ainda não existir
 * no localStorage, ela é populada com os dados de `mock.ts` (uma única vez)
 * e essa cópia inicial já é gravada de volta — assim, o localStorage vira a
 * fonte única de verdade para todas as páginas (inclusive o Dashboard) a
 * partir da primeira leitura.
 */

export const CHAVES_LOCALSTORAGE = {
  escolas: "escolas",
  alunos: "alunos",
  responsaveis: "responsaveis",
  turmas: "turmas",
  matriculas: "matriculas",
  professores: "professores",
  materias: "materias",
  periodos: "periodos",
  vinculos: "vinculos",
  boletos: "boletos",
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
