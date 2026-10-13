import { api, ApiError } from "./api";
import type { Nota, NotaEntrada } from "../types";

export interface FiltrosNota {
  alunoId?: number;
  avaliacaoId?: number;
}

const RECURSO = "/notas";

export async function listarNotas(filtros?: FiltrosNota): Promise<Nota[]> {
  const { data } = await api.get<Nota[]>(RECURSO, { params: filtros });
  return data;
}

export async function buscarNotaPorId(id: number): Promise<Nota> {
  const { data } = await api.get<Nota>(`${RECURSO}/${id}`);
  return data;
}

export async function criarNota(dados: NotaEntrada): Promise<Nota> {
  const { data } = await api.post<Nota>(RECURSO, dados);
  return data;
}

export async function atualizarNota(
  id: number,
  dados: Partial<Pick<NotaEntrada, "valorNota" | "observacao">>
): Promise<Nota> {
  const { data } = await api.patch<Nota>(`${RECURSO}/${id}`, dados);
  return data;
}

export async function excluirNota(id: number): Promise<void> {
  await api.delete(`${RECURSO}/${id}`);
}

export function ehErroDeConflito(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  return erro.status === 409 || erro.status === 400;
}

export function mensagemDeErroNota(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError) {
    if (erro.status === 409 || /unique|duplicad/i.test(erro.message)) {
      return "Já existe uma nota registrada para este aluno nesta avaliação.";
    }
  }
  return erro.message || padrao;
}