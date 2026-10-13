import { api, ApiError } from "./api";
import type { Boleto, BoletoEntrada } from "../types";

const RECURSO = "/boletos";

export interface FiltrosPagamento {
  alunoId?: number;
  situacao?: string;
  competencia?: string;
}

export async function listarPagamentos(filtros?: FiltrosPagamento): Promise<Boleto[]> {
  const { data } = await api.get<Boleto[]>(RECURSO, { params: filtros });
  return data;
}

export async function buscarPagamentoPorId(id: number): Promise<Boleto> {
  const { data } = await api.get<Boleto>(`${RECURSO}/${id}`);
  return data;
}

export async function criarPagamento(dados: BoletoEntrada): Promise<Boleto> {
  const { data } = await api.post<Boleto>(RECURSO, dados);
  return data;
}

export async function atualizarPagamento(
  id: number,
  dados: Partial<BoletoEntrada>
): Promise<Boleto> {
  const { data } = await api.patch<Boleto>(`${RECURSO}/${id}`, dados);
  return data;
}

export async function excluirPagamento(id: number): Promise<void> {
  await api.delete(`${RECURSO}/${id}`);
}

export function ehErroDeVinculoPagamento(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  return erro.status === 409 || erro.status === 400;
}

export function mensagemDeErroPagamento(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  return erro.message || padrao;
}