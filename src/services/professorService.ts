import { api, ApiError } from "./api";
import type { Professor, ProfessorEntrada } from "../types";

export type { Professor };
export type CriarProfessorDTO = ProfessorEntrada;
export type AtualizarProfessorDTO = Partial<ProfessorEntrada>;

const RECURSO = "/professores";

function validarId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Identificador de professor inválido.");
  }
}

export async function listarProfessores(): Promise<Professor[]> {
  const { data } = await api.get<Professor[]>(RECURSO);
  return data;
}

export async function buscarProfessorPorId(id: number): Promise<Professor> {
  validarId(id);
  const { data } = await api.get<Professor>(`${RECURSO}/${id}`);
  return data;
}

export async function criarProfessor(dados: CriarProfessorDTO): Promise<Professor> {
  const { data } = await api.post<Professor>(RECURSO, dados);
  return data;
}

export async function atualizarProfessor(
  id: number,
  dados: AtualizarProfessorDTO
): Promise<Professor> {
  validarId(id);
  const { data } = await api.patch<Professor>(`${RECURSO}/${id}`, dados);
  return data;
}

export async function excluirProfessor(id: number): Promise<void> {
  validarId(id);
  await api.delete(`${RECURSO}/${id}`);
}

export function ehErroDeVinculo(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  if (erro.status === 409) return true;
  return (
    erro.status === 400 &&
    /v[ií]nculo|vinculad|restrict|foreign key|chave estrangeira|referenci|grade|turma|avalia[cç]/i.test(
      erro.message
    )
  );
}

export function mensagemDeErroProfessor(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError) {
    if (erro.status === 409 && /cpf/i.test(erro.message)) {
      return "Já existe um professor cadastrado com este CPF.";
    }
    if (erro.status === 400 && /chk_cpf_prof/i.test(erro.message)) {
      return "O CPF deve ter 11 dígitos numéricos.";
    }
  }
  return erro.message || padrao;
}
