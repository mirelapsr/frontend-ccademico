
import { api, ApiError } from "./api";
import type { Escola, EscolaEntrada } from "../types";


export type { Escola };

export type CriarEscolaDTO = EscolaEntrada;

export type AtualizarEscolaDTO = Partial<EscolaEntrada>;

const RECURSO = "/escolas";

function validarId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Identificador de escola inválido.");
  }
}

export async function listarEscolas(): Promise<Escola[]> {
  const { data } = await api.get<Escola[]>(RECURSO);
  return data;
}

export async function buscarEscolaPorId(id: number): Promise<Escola> {
  validarId(id);
  const { data } = await api.get<Escola>(`${RECURSO}/${id}`);
  return data;
}

export async function criarEscola(dados: CriarEscolaDTO): Promise<Escola> {
  const { data } = await api.post<Escola>(RECURSO, dados);
  return data;
}

export async function atualizarEscola(
  id: number,
  dados: AtualizarEscolaDTO
): Promise<Escola> {
  validarId(id);

  const { data } = await api.patch<Escola>(`${RECURSO}/${id}`, dados);
  return data;
}


export async function excluirEscola(id: number): Promise<void> {
  validarId(id);
  await api.delete(`${RECURSO}/${id}`);
}


export function ehErroDeVinculo(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  if (erro.status === 409) return true;
  if (erro.status === 400) {
    return /v[ií]nculo|vinculad|restrict|foreign key|chave estrangeira|referenci|turma|professor/i.test(
      erro.message
    );
  }
  return false;
}

export function mensagemDeErroEscola(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError && erro.status === 409) {
    if (/cnpj/i.test(erro.message)) return "Já existe uma escola cadastrada com este CNPJ.";
    if (/inep/i.test(erro.message)) return "Já existe uma escola cadastrada com este código INEP.";
  }
  return erro.message || padrao;
}
