
import { api, ApiError } from "./api";
import type { Materia } from "../types";

export type { Materia };

export interface CriarMateriaDTO {
  nomeMateria: string;
  cargaHoraria: number;
}

export type AtualizarMateriaDTO = Partial<CriarMateriaDTO>;

const RECURSO = "/materias"; 

function validarId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Identificador de matéria inválido.");
  }
}

export async function listarMaterias(): Promise<Materia[]> {
  const { data } = await api.get<Materia[]>(RECURSO);
  return data;
}

export async function buscarMateriaPorId(id: number): Promise<Materia> {
  validarId(id);
  const { data } = await api.get<Materia>(`${RECURSO}/${id}`);
  return data;
}

export async function criarMateria(dados: CriarMateriaDTO): Promise<Materia> {
  const { data } = await api.post<Materia>(RECURSO, dados);
  return data;
}

export async function atualizarMateria(
  id: number,
  dados: AtualizarMateriaDTO
): Promise<Materia> {
  validarId(id);
  // PATCH: o backend usa `exclude_unset` (campos omitidos não são tocados).
  const { data } = await api.patch<Materia>(`${RECURSO}/${id}`, dados);
  return data;
}

/** DELETE devolve 204 (sem corpo): por isso a função resolve `void`. */
export async function excluirMateria(id: number): Promise<void> {
  validarId(id);
  await api.delete(`${RECURSO}/${id}`);
}


export function ehErroDeVinculo(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  if (erro.status === 409) return true;
  if (erro.status === 400) {
    return /v[ií]nculo|vinculad|restrict|foreign key|chave estrangeira|referenci|grade|boletim|turma|avalia[cç]/i.test(
      erro.message
    );
  }
  return false;
}

export function mensagemDeErroMateria(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError) {
    if (erro.status === 409 && /uq_materia_nome|nome_materia/i.test(erro.message)) {
      return "Já existe uma matéria cadastrada com este nome.";
    }
    if (erro.status === 400 && /chk_materia_carga/i.test(erro.message)) {
      return "A carga horária deve ser maior que zero.";
    }
  }
  return erro.message || padrao;
}
