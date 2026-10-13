import { api, ApiError } from "./api";
import type { Aluno, AlunoEntrada, Decimal, SituacaoAluno } from "../types";

export interface FiltrosAluno {
  situacao?: SituacaoAluno;
  nome?: string;
}

export interface EscolaAtualDoAluno {
  id_aluno: number;
  id_escola: number;
  nome_escola: string;
}

export interface ResponsavelFinanceiro {
  aluno_id: number;
  id_responsavel: number;
  nome_resp: string;
  email_resp: string | null;
  telefone_resp: string | null;
}

export interface MediaDinamica {
  aluno_id: number;
  periodo_id: number;
  materia_id: number;
  media_calculada: Decimal;
  qtd_avaliacoes_contabilizadas: number;
}

const RECURSO = "/alunos";

export async function listarAlunos(filtros?: FiltrosAluno): Promise<Aluno[]> {
  const { data } = await api.get<Aluno[]>(RECURSO, { params: filtros });
  return data;
}

export async function buscarAlunoPorId(id: number): Promise<Aluno> {
  const { data } = await api.get<Aluno>(`${RECURSO}/${id}`);
  return data;
}

export async function criarAluno(dados: AlunoEntrada): Promise<Aluno> {
  const { data } = await api.post<Aluno>(RECURSO, dados);
  return data;
}

export async function atualizarAluno(id: number, dados: Partial<AlunoEntrada>): Promise<Aluno> {
  const { data } = await api.patch<Aluno>(`${RECURSO}/${id}`, dados);
  return data;
}

export async function excluirAluno(id: number): Promise<void> {
  await api.delete(`${RECURSO}/${id}`);
}

export async function obterEscolaAtual(id: number): Promise<EscolaAtualDoAluno> {
  const { data } = await api.get<EscolaAtualDoAluno>(`${RECURSO}/${id}/escola-atual`);
  return data;
}

export async function listarResponsaveisFinanceiros(id: number): Promise<ResponsavelFinanceiro[]> {
  const { data } = await api.get<ResponsavelFinanceiro[]>(`${RECURSO}/${id}/responsaveis-financeiros`);
  return data;
}

export async function obterMedias(id: number): Promise<MediaDinamica[]> {
  const { data } = await api.get<MediaDinamica[]>(`${RECURSO}/${id}/medias`);
  return data;
}

export function ehErroDeVinculo(erro: unknown): boolean {
  if (!(erro instanceof ApiError)) return false;
  if (erro.status === 409) return true;
  return (
    erro.status === 400 &&
    /vinculad|restrict|foreign key|chave estrangeira|referenci|matr[ií]cula|nota|frequ[eê]ncia|boletim|boleto/i.test(
      erro.message
    )
  );
}

export function mensagemDeErroAluno(erro: unknown, padrao: string): string {
  if (!(erro instanceof Error)) return padrao;
  if (erro instanceof ApiError) {
    if (erro.status === 409 && /cpf/i.test(erro.message)) {
      return "Já existe um aluno cadastrado com este CPF.";
    }
    if (erro.status === 409 && /numero_matricula|matr[ií]cula/i.test(erro.message)) {
      return "Já existe um aluno cadastrado com este número de matrícula.";
    }
    if (erro.status === 400 && /chk_cpf_aluno/i.test(erro.message)) {
      return "O CPF deve ter 11 dígitos numéricos.";
    }
  }
  return erro.message || padrao;
}

