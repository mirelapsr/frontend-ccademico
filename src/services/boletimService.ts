import { api, ApiError } from "./api";
import type { Boletim, BoletimEntrada } from "../types";

const RECURSO = "/boletins";

export interface FiltrosBoletim {
  alunoId?: number;
  periodoId?: number;
}

export async function listarBoletins(filtros?: FiltrosBoletim): Promise<Boletim[]> {
  const { data } = await api.get<Boletim[]>(RECURSO, { params: filtros });
  return data;
}

export async function buscarBoletimPorId(id: number): Promise<Boletim> {
  const { data } = await api.get<Boletim>(`${RECURSO}/${id}`);
  return data;
}

export async function criarBoletim(dados: BoletimEntrada): Promise<Boletim> {
  const { data } = await api.post<Boletim>(RECURSO, dados);
  return data;
}

export async function atualizarBoletim(
  id: number,
  dados: Partial<BoletimEntrada>
): Promise<Boletim> {
  const { data } = await api.patch<Boletim>(`${RECURSO}/${id}`, dados);
  return data;
}

export async function excluirBoletim(id: number): Promise<void> {
  await api.delete(`${RECURSO}/${id}`);
}

export function mensagemDeErroBoletim(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError) {
    return erro.message;
  }
  return erro.message || padrao;
}