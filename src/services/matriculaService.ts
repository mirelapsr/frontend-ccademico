import { api, ApiError } from "./api";
import type { Matricula, MatriculaEntrada, SituacaoMatricula } from "../types";

export interface FiltrosMatricula {
  situacao?: SituacaoMatricula;
  alunoId?: number;
  turmaId?: number;
}

const RECURSO = "/matriculas";

export async function listarMatriculas(filtros?: FiltrosMatricula): Promise<Matricula[]> {
  const { data } = await api.get<Matricula[]>(RECURSO, { params: filtros });
  return data;
}

export async function buscarMatriculaPorId(id: number): Promise<Matricula> {
  const { data } = await api.get<Matricula>(`${RECURSO}/${id}`);
  return data;
}

export async function criarMatricula(dados: MatriculaEntrada): Promise<Matricula> {
  const { data } = await api.post<Matricula>(RECURSO, dados);
  return data;
}

export async function atualizarMatricula(
  id: number,
  dados: Partial<MatriculaEntrada>
): Promise<Matricula> {
  const { data } = await api.patch<Matricula>(`${RECURSO}/${id}`, dados);
  return data;
}

export async function excluirMatricula(id: number): Promise<void> {
  await api.delete(`${RECURSO}/${id}`);
}

export function ehErroDeVinculo(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  return erro.status === 409 || erro.status === 400;
}

export function mensagemDeErroMatricula(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError) {
    if (erro.status === 409 || /matricula_unica_ativa|já possui.*ativa/i.test(erro.message)) {
      return "Este aluno já possui uma matrícula ativa. Encerre ou transfira a matrícula atual antes de criar outra.";
    }
    if (/capacidade/i.test(erro.message)) {
      return "A turma selecionada já atingiu a capacidade máxima de alunos.";
    }
  }
  return erro.message || padrao;
}