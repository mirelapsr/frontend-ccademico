import { api, ApiError } from "./api";
import type { Frequencia, FrequenciaEntrada, FrequenciaAtualizacao, SituacaoFrequencia } from "../types";

export interface FiltrosFrequencia {
  alunoId?: number;
  gradeId?: number;
  dataFrequencia?: string;
  situacao?: SituacaoFrequencia;
}

const RECURSO = "/frequencias";

export async function listarFrequencias(filtros?: FiltrosFrequencia): Promise<Frequencia[]> {
  const { data } = await api.get<Frequencia[]>(RECURSO, { params: filtros });
  return data;
}

export async function buscarFrequenciaPorId(id: number): Promise<Frequencia> {
  const { data } = await api.get<Frequencia>(`${RECURSO}/${id}`);
  return data;
}

export async function criarFrequencia(dados: FrequenciaEntrada): Promise<Frequencia> {
  const { data } = await api.post<Frequencia>(RECURSO, dados);
  return data;
}

export async function atualizarFrequencia(
  id: number,
  dados: FrequenciaAtualizacao
): Promise<Frequencia> {
  const { data } = await api.patch<Frequencia>(`${RECURSO}/${id}`, dados);
  return data;
}

export async function excluirFrequencia(id: number): Promise<void> {
  await api.delete(`${RECURSO}/${id}`);
}

export function ehErroDeVinculo(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  return erro.status === 409 || erro.status === 400;
}

export function mensagemDeErroFrequencia(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError) {
    if (erro.status === 409 || /unique|duplicad/i.test(erro.message)) {
      return "Já existe um registro de frequência cadastrado para este aluno nesta disciplina e data.";
    }
  }
  return erro.message || padrao;
}