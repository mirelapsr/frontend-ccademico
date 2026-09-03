/**
 * Tipos (types.ts)
 * ================
 * Espelho fiel do contrato JSON da API do Módulo I (FastAPI + Pydantic).
 * Os campos aqui são `camelCase` porque é isso que a API devolve: o Pydantic
 * usa `alias_generator=to_camel` para traduzir o `snake_case` do PostgreSQL
 * (`nome_escola`) para o JSON (`nomeEscola`). Não inventar nomes — o que está
 * aqui precisa bater 1:1 com o schema `EscolaSaida` do backend.
 */

/**
 * Escola — entidade raiz do sistema (não depende de nenhuma outra tabela).
 */


export interface Escola {
  /** Gerado pelo banco (SERIAL). Não existe antes de criar o registro. */
  idEscola: number;
  nomeEscola: string;
  /** Código do INEP. Único quando informado, mas pode não existir ainda. */
  codigoInep: string | null;
  cnpj: string | null;
  enderecoEscola: string | null;
  telefoneEscola: string | null;
  emailEscola: string | null;
  /** Timestamps ISO 8601 (ex.: "2026-02-10T13:45:00"), gerados pelo banco. */
  criadoEm: string;
  atualizadoEm: string;
}

// Formulário de cadastro/edição (`FormularioEscola`): o que o usuário digita
// e envia — sem os campos que o "banco" (aqui, o `App.tsx`) controla sozinho.
export type EscolaEntrada = Omit<Escola, "idEscola" | "criadoEm" | "atualizadoEm">;

export type SituacaoAluno = "Ativo" | "Inativo" | "Transferido";

/**
 * Aluno — depende de uma escola (matrícula), mas essa relação ainda não faz
 * parte do contrato exposto aqui (sem `escolaId` até o backend expor isso).
 */
export interface Aluno {
  idAluno: number;
  numeroMatricula: string;
  nomeAluno: string;
  dataNascimento: string;
  cpfAluno: string | null;
  telefoneAluno: string | null;
  emailAluno: string | null;
  cepAluno: string | null;
  enderecoAluno: string | null;
  situacao: SituacaoAluno;
  criadoEm: string;
  atualizadoEm: string;
}

export type AlunoEntrada = Omit<Aluno, "idAluno" | "criadoEm" | "atualizadoEm">;

/**
 * Turma — pertence a uma Escola (`escolaIdEscola`). Uma escola tem várias
 * turmas por ano letivo.
 */
export type Turno = "Manha" | "Tarde" | "Noite" | "Integral";

export interface Turma {
  idTurma: number;
  nomeTurma: string;
  serie?: string | null;
  turno: Turno;
  capacidade?: number | null;
  /** FK — id da Escola a que esta turma pertence. */
  escolaIdEscola: number;
  anoLetivo: number;
  criadoEm: string;
  atualizadoEm: string;
}

export type TurmaEntrada = Omit<Turma, "idTurma" | "criadoEm" | "atualizadoEm">;

/**
 * Matrícula — entidade associativa entre Aluno e Turma (N:1 para cada lado:
 * um aluno pode ter várias matrículas ao longo do tempo, uma turma tem
 * várias matrículas).
 */
export type SituacaoMatricula = "Ativa" | "Cancelada" | "Transferida" | "Concluida";

export interface Matricula {
  idMatricula: number;
  /** FK — id do Aluno matriculado. */
  alunoIdAluno: number;
  /** FK — id da Turma em que o aluno foi matriculado. */
  turmaIdTurma: number;
  /** Data ISO (ex.: "2026-02-03"). */
  dataMatricula: string;
  situacao: SituacaoMatricula;
  criadoEm: string;
  atualizadoEm: string;
}

export type MatriculaEntrada = Omit<Matricula, "idMatricula" | "criadoEm" | "atualizadoEm">;

