// Caminho: src/services/periodoService.ts
//
// Camada de serviço do módulo Períodos Letivos: único lugar que conhece as
// URLs do backend. Usa a instância `api` (JWT injetado automaticamente).
//
// Contrato real do backend (main.py / schemas.py):
//   GET    /periodos            -> 200 PeriodoSaida[]
//   GET    /periodos/{id}       -> 200 PeriodoSaida | 404
//   POST   /periodos            -> 201 PeriodoSaida | 400 (CHECK) | 422
//   PATCH  /periodos/{id}       -> 200 PeriodoSaida | 404 | 400   (NÃO existe PUT!)
//   DELETE /periodos/{id}       -> 204 | 404 | 400 (FK ON DELETE RESTRICT)
//
// FKs que apontam para `periodo` (ON DELETE RESTRICT): `avaliacao` e `boletim`.

import { api, ApiError } from "./api";
import type { Periodo, PeriodoEntrada } from "../types";

// `Periodo` e `PeriodoEntrada` vivem em `src/types.ts` e batem com o schema
// do backend (camelCase via to_camel): idPeriodo, ano, nomePeriodo,
// dataInicio, dataFim (datas "YYYY-MM-DD") e situacao ("Ativo" | "Encerrado").
// Obs.: o backend usa `ano` e `situacao` — não `anoLetivo`/`status`.
export type { Periodo };

/** Corpo do POST /periodos: tudo menos o que o banco gera (id). */
export type CriarPeriodoDTO = PeriodoEntrada;

/** Corpo do PATCH /periodos/{id} (`PeriodoAtualizacao`): todos os campos opcionais. */
export type AtualizarPeriodoDTO = Partial<PeriodoEntrada>;

const RECURSO = "/periodos"; // sem barra final: as rotas do FastAPI são declaradas assim

/** Evita chamadas como `/periodos/undefined` (o FastAPI responderia 422). */
function validarId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Identificador de período inválido.");
  }
}

export async function listarPeriodos(): Promise<Periodo[]> {
  const { data } = await api.get<Periodo[]>(RECURSO);
  return data;
}

export async function buscarPeriodoPorId(id: number): Promise<Periodo> {
  validarId(id);
  const { data } = await api.get<Periodo>(`${RECURSO}/${id}`);
  return data;
}

export async function criarPeriodo(dados: CriarPeriodoDTO): Promise<Periodo> {
  const { data } = await api.post<Periodo>(RECURSO, dados);
  return data;
}

export async function atualizarPeriodo(
  id: number,
  dados: AtualizarPeriodoDTO
): Promise<Periodo> {
  validarId(id);
  // PATCH: o backend usa `exclude_unset` (campos omitidos não são tocados).
  const { data } = await api.patch<Periodo>(`${RECURSO}/${id}`, dados);
  return data;
}

/** DELETE devolve 204 (sem corpo): por isso a função resolve `void`. */
export async function excluirPeriodo(id: number): Promise<void> {
  validarId(id);
  await api.delete(`${RECURSO}/${id}`);
}

// ---------------------------------------------------------------------------
// Classificação / tradução de erros para a UI
// ---------------------------------------------------------------------------

/**
 * `true` quando a exclusão foi barrada por integridade referencial
 * (FK `ON DELETE RESTRICT`: o período ainda tem avaliações ou boletins).
 * O backend devolve 400 "Erro de integridade referencial: ..." (pgcode 23503)
 * ou 409 quando um trigger bloqueia a operação.
 */
export function ehErroDeVinculo(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  if (erro.status === 409) return true;
  if (erro.status === 400) {
    return /v[ií]nculo|vinculad|restrict|foreign key|chave estrangeira|referenci|avalia[cç]|boletim/i.test(
      erro.message
    );
  }
  return false;
}

/** O backend devolve a mensagem crua do PostgreSQL; aqui ela vira texto amigável. */
export function mensagemDeErroPeriodo(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError && erro.status === 400) {
    if (/chk_periodo_datas/i.test(erro.message)) {
      return "A data de término deve ser posterior à data de início.";
    }
    if (/chk_periodo_situacao/i.test(erro.message)) {
      return "Situação inválida: use Ativo ou Encerrado.";
    }
  }
  return erro.message || padrao;
}
