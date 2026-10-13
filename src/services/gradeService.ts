import { api, ApiError } from "./api";
import type { GradeCurricular, GradeCurricularEntrada } from "../types";

export type { GradeCurricular };
export type CriarGradeDTO = GradeCurricularEntrada;
export type AtualizarGradeDTO = Partial<GradeCurricularEntrada>;

const RECURSO = "/grades";

export async function listarGrades(): Promise<GradeCurricular[]> {
  const { data } = await api.get<GradeCurricular[]>(RECURSO);
  return data;
}

export async function buscarGradePorId(id: number): Promise<GradeCurricular> {
  const { data } = await api.get<GradeCurricular>(`${RECURSO}/${id}`);
  return data;
}

export async function criarGrade(dados: CriarGradeDTO): Promise<GradeCurricular> {
  const { data } = await api.post<GradeCurricular>(RECURSO, dados);
  return data;
}

export async function atualizarGrade(id: number, payload: AtualizarGradeDTO): Promise<GradeCurricular> {
  const { data } = await api.patch<GradeCurricular>(`${RECURSO}/${id}`, payload);
  return data;
}

export async function excluirGrade(id: number): Promise<void> {
  await api.delete(`${RECURSO}/${id}`);
}


export function ehErroDeVinculo(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  if (erro.status === 409) return true;
  return (
    erro.status === 400 &&
    /v[ií]nculo|vinculad|restrict|foreign key|chave estrangeira|referenci|avaliacao|nota|frequencia|23503/i.test(
      erro.message
    )
  );
}

export function mensagemDeErroGrade(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError) {
    if (erro.status === 409) {
      return "Já existe uma atribuição cadastrada com esses dados para a turma selecionada.";
    }
    if (erro.status === 400) {
      if (/turma/i.test(erro.message)) return "Turma inválida ou não encontrada.";
      if (/materia/i.test(erro.message)) return "Matéria inválida ou não encontrada.";
      if (/professor/i.test(erro.message)) return "Professor inválido ou não encontrado.";
    }
  }
  return erro.message || padrao;
}