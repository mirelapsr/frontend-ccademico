import { api, ApiError } from "./api";
import type { Turma, TurmaEntrada } from "../types";

export type { Turma };
export type CriarTurmaDTO = TurmaEntrada;
export type AtualizarTurmaDTO = Partial<TurmaEntrada>;

const RECURSO = "/turmas";

function validarId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Identificador de turma inválido.");
  }
}

export async function listarTurmas(): Promise<Turma[]> {
  const { data } = await api.get<Turma[]>(RECURSO);
  return data;
}

export async function buscarTurmaPorId(id: number): Promise<Turma> {
  validarId(id);
  const { data } = await api.get<Turma>(`${RECURSO}/${id}`);
  return data;
}

export async function criarTurma(dados: CriarTurmaDTO): Promise<Turma> {
  const { data } = await api.post<Turma>(RECURSO, dados);
  return data;
}

export async function atualizarTurma(id: number, dados: AtualizarTurmaDTO): Promise<Turma> {
  validarId(id);
  const { data } = await api.patch<Turma>(`${RECURSO}/${id}`, dados);
  return data;
}

export async function excluirTurma(id: number): Promise<void> {
  validarId(id);
  await api.delete(`${RECURSO}/${id}`);
}

export function ehErroDeVinculo(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  if (erro.status === 409) return true;
  return (
    erro.status === 400 &&
    /v[ií]nculo|vinculad|restrict|foreign key|chave estrangeira|referenci|matr[ií]cula|grade|nota|aluno/i.test(
      erro.message
    )
  );
}

export function mensagemDeErroTurma(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError && erro.status === 400) {
    if (/chk_turma_capacidade/i.test(erro.message)) {
      return "A capacidade deve ser maior que zero.";
    }
    if (/chk_turma_turno/i.test(erro.message)) {
      return "Turno inválido: use Manhã, Tarde, Noite ou Integral.";
    }
    if (/fk_turma_escola/i.test(erro.message)) {
      return "A escola selecionada não existe mais. Recarregue a página e escolha outra.";
    }
  }
  return erro.message || padrao;
}
