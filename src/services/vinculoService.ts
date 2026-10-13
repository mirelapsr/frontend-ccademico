import { api, ApiError } from "./api";
import type { AlunoResponsavel, AlunoResponsavelEntrada } from "../types";

export async function criarVinculo(
  alunoId: number,
  responsavelId: number,
  dados: AlunoResponsavelEntrada
): Promise<AlunoResponsavel> {
  const { data } = await api.post<AlunoResponsavel>(
    `/alunos/${alunoId}/responsaveis/${responsavelId}`,
    dados
  );
  return data;
}

export async function excluirVinculo(alunoId: number, responsavelId: number): Promise<void> {
  await api.delete(`/alunos/${alunoId}/responsaveis/${responsavelId}`);
}

export function ehErroDeVinculo(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  return erro.status === 409 || erro.status === 400;
}

export function mensagemDeErroVinculo(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError) {
    if (erro.status === 409) {
      return "Este vínculo entre aluno e responsável já está cadastrado.";
    }
  }
  return erro.message || padrao;
}

export async function listarResponsaveisDoAluno(alunoId: number): Promise<AlunoResponsavel[]> {
  const { data } = await api.get<AlunoResponsavel[]>(`/alunos/${alunoId}/responsaveis`);
  return data;
}