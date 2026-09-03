/*
 * FRONTEIRA COM O BACKEND (api.ts) — ESQUELETO, implemente você mesmo
 * ==================================================================
 *
 * Este é o arquivo mais importante do trabalho, e o motivo é o Módulo III.
 *
 * A REGRA: nenhum componente pode importar o `mock.ts`. Os componentes
 * chamam SÓ as funções deste arquivo. Hoje, essas funções devolvem os dados
 * do mock; no Módulo III, o corpo delas vira um `fetch` na API de verdade —
 * e os componentes não mudam UMA linha. É isso que separa um app que "está
 * pronto para integrar" de um que precisa ser reescrito.
 *
 * Por isso todas as funções são `async` e devolvem `Promise`, mesmo agora que
 * os dados são locais: é assim que vai ser quando forem de rede.
 *
 * -----------------------------------------------------------------------
 * COMO CADA FUNÇÃO VAI FICAR NO MÓDULO III (só para você ver o destino):
 *
 *   export async function listarAlunos(): Promise<Aluno[]> {
 *     const resposta = await fetch("http://127.0.0.1:8000/alunos");
 *     if (!resposta.ok) throw new Error("Falha ao carregar alunos");
 *     return resposta.json();
 *   }
 *
 * Repare: a ASSINATURA é a mesma que você vai escrever hoje. Só o corpo muda.
 * -----------------------------------------------------------------------
 */

// DICA — o que você vai importar aqui:
//   import type { Aluno, AlunoEntrada, Disciplina, FiltrosAluno } from "./types";
//   import { alunosIniciais, disciplinasIniciais } from "./mock";

/**
 * Simula a demora da rede (já vem pronto — use e agradeça).
 * Serve para você VER a tela de "Carregando...", que aparece e desaparece
 * rápido demais quando os dados são locais.
 *
 *   await esperar(600);   // pausa de 600 milissegundos
 */
export function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =========================== ALUNOS ===========================
//
// ANTES DOS TODOs — o "banco de mentira" em memória:
//   O mock é a carga INICIAL, e ele não muda. Mas criar e excluir aluno
//   precisam de algum lugar que MUDE. Então declare aqui, no topo deste
//   arquivo, uma cópia da lista que este módulo vai manter:
//
//     let banco: Aluno[] = [...alunosIniciais];
//
//   `listarAlunos` lê do `banco`; `criarAluno` e `excluirAluno` alteram o
//   `banco`. É o papel que o PostgreSQL faz no backend. (Some ao recarregar
//   a página — normal: é memória, não banco de verdade.)
//
// TODO 1 (Etapa 1): listarAlunos(filtros?): Promise<Aluno[]>
//   Devolva a lista de alunos. Comece simples: `await esperar(500)` e devolva
//   `alunosIniciais`. Os filtros entram no Desafio 2.
//   DICA da assinatura:
//     export async function listarAlunos(filtros?: FiltrosAluno): Promise<Aluno[]> { ... }
//
// TODO 2 (Desafio 2): faça listarAlunos APLICAR os filtros recebidos:
//   - q            -> nome contém o texto, ignorando maiúsculas/minúsculas
//                     (DICA: nome.toLowerCase().includes(q.toLowerCase()))
//   - idade_minima -> idade >= idade_minima
//   - media_minima -> media >= media_minima
//   Os filtros são COMBINÁVEIS: passando dois, o aluno precisa satisfazer os
//   dois. Use .filter().
//   POR QUE aqui e não no componente: na API real quem filtra é o backend
//   (`GET /alunos?q=ana&idade_minima=18`). Filtrando aqui, o componente já
//   está escrito do jeito certo para o Módulo III.
//
// TODO 3 (Desafio 3): criarAluno(dados: AlunoEntrada): Promise<Aluno>
//   Gere um id novo, monte o Aluno completo e devolva.
//   REGRA DE NEGÓCIO (a API responde 409 nesse caso): se já existir um aluno
//   com a MESMA matricula, lance um erro:
//     throw new Error("Já existe um aluno com essa matrícula");
//   O seu formulário vai capturar esse erro e mostrar a mensagem na tela.
//   DICA do id: Math.max(0, ...lista.map(a => a.id)) + 1
//
// TODO 4 (Desafio 3): excluirAluno(id: number): Promise<void>
//   Remova o aluno da lista. Se o id não existir, lance um erro
//   (é o 404 da API).

// ========================= DISCIPLINAS =========================
//
// TODO 5 (bônus): listarDisciplinas(): Promise<Disciplina[]>
//
// TODO 6 (bônus): disciplinasDoAluno(alunoId: number): Promise<Disciplina[]>
//   Na API isso é um JOIN (`GET /alunos/{id}/disciplinas`). Aqui, você pode
//   guardar as matrículas como uma lista de pares { aluno_id, disciplina_id }
//   no mock e cruzar com .filter() + .map().
