import { api, ApiError } from "./api";
import type { Avaliacao, AvaliacaoEntrada, TipoAvaliacao } from "../types";

export interface FiltrosAvaliacao {
  gradeId?: number;
  periodoId?: number;
  tipo?: TipoAvaliacao;
}

const RECURSO = "/avaliacoes";

export async function listarAvaliacoes(filtros?: FiltrosAvaliacao): Promise<Avaliacao[]> {
  const { data } = await api.get<Avaliacao[]>(RECURSO, { params: filtros });
  return data;
}

export async function buscarAvaliacaoPorId(id: number): Promise<Avaliacao> {
  const { data } = await api.get<Avaliacao>(`${RECURSO}/${id}`);
  return data;
}

export async function criarAvaliacao(dados: AvaliacaoEntrada): Promise<Avaliacao> {
  const { data } = await api.post<Avaliacao>(RECURSO, dados);
  return data;
}

export async function atualizarAvaliacao(
  id: number,
  dados: Partial<AvaliacaoEntrada>
): Promise<Avaliacao> {
  const { data } = await api.patch<Avaliacao>(`${RECURSO}/${id}`, dados);
  return data;
}

export async function excluirAvaliacao(id: number): Promise<void> {
  await api.delete(`${RECURSO}/${id}`);
}

export function ehErroDeVinculo(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  return erro.status === 409 || erro.status === 400;
}

export function mensagemDeErroAvaliacao(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError) {
    if (erro.status === 409) {
      return "Não foi possível realizar esta ação devido a um conflito de dados.";
    }
  }
  return erro.message || padrao;
}