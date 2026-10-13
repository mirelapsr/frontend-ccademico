
import { api, ApiError } from "./api";
import type { Responsavel, ResponsavelEntrada } from "../types";

export type { Responsavel };
export type CriarResponsavelDTO = ResponsavelEntrada;
export type AtualizarResponsavelDTO = Partial<ResponsavelEntrada>;

const RECURSO = "/responsaveis";

function validarId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Identificador de responsável inválido.");
  }
}

export async function listarResponsaveis(): Promise<Responsavel[]> {
  const { data } = await api.get<Responsavel[]>(RECURSO);
  return data;
}

export async function buscarResponsavelPorId(id: number): Promise<Responsavel> {
  validarId(id);
  const { data } = await api.get<Responsavel>(`${RECURSO}/${id}`);
  return data;
}

export async function criarResponsavel(dados: CriarResponsavelDTO): Promise<Responsavel> {
  const { data } = await api.post<Responsavel>(RECURSO, dados);
  return data;
}

export async function atualizarResponsavel(
  id: number,
  dados: AtualizarResponsavelDTO
): Promise<Responsavel> {
  validarId(id);
  const { data } = await api.patch<Responsavel>(`${RECURSO}/${id}`, dados);
  return data;
}

export async function excluirResponsavel(id: number): Promise<void> {
  validarId(id);
  await api.delete(`${RECURSO}/${id}`);
}


export function ehErroDeVinculo(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  if (erro.status === 409) return true;
  return (
    erro.status === 400 &&
    /v[ií]nculo|vinculad|restrict|foreign key|chave estrangeira|referenci|aluno|boleto|pagamento|23503/i.test(
      erro.message
    )
  );
}


export function mensagemDeErroResponsavel(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError) {
    if (
      (erro.status === 409 || erro.status === 400) &&
      /cpf|unique|uq_responsavel_cpf|duplicad/i.test(erro.message)
    ) {
      return "Já existe um responsável cadastrado com este CPF.";
    }
    if (erro.status === 400 && /chk_cpf_resp|11 dígitos/i.test(erro.message)) {
      return "O CPF deve conter exatamente 11 dígitos numéricos.";
    }
  }
  return erro.message || padrao;
}