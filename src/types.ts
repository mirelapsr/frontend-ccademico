/**
 * Contrato JSON da API (FastAPI + Pydantic v2, alias_generator=to_camel).
 * Cada interface espelha o `*Saida` do backend; os nomes de chaves primárias
 * (`idX`) e estrangeiras (`xId`) são exatamente os que a API devolve.
 * Colunas anuláveis chegam como `null` (`T | null`); nas entidades Professor,
 * Turma, Nota, Frequencia e Boleto o campo também pode ser omitido (`campo?`).
 */

/** A API devolve `Decimal` como string ("8.50") e aceita string ou número no envio. */
export type Decimal = string | number;

export interface Auditoria {
  criadoEm?: string;
  atualizadoEm?: string;
}

// ---------------------------------------------------------------------------
// Enums (valores aceitos pelo PostgreSQL e pelo FastAPI)
// ---------------------------------------------------------------------------

export type PapelUsuario = "ADMIN" | "PROFESSOR" | "SECRETARIA";
export type Turno = "Manha" | "Tarde" | "Noite" | "Integral";
export type SituacaoPeriodo = "Ativo" | "Encerrado";
export type SituacaoAluno = "Ativo" | "Inativo" | "Transferido";
export type SituacaoProfessor = "Ativo" | "Inativo";
export type SituacaoMatricula = "Ativa" | "Cancelada" | "Transferida" | "Concluida";
export type TipoResponsavel = "Pai" | "Mae" | "ResponsavelLegal" | "Outro";
export type TipoAvaliacao =
  | "Prova"
  | "Trabalho"
  | "Projeto"
  | "Recuperacao"
  | "Seminario"
  | "Participacao"
  | "Outro";
export type SituacaoFrequencia = "Presente" | "Falta" | "FaltaJustificada";
export type SituacaoBoletim = "Aberto" | "Fechado";
export type SituacaoBoleto = "Pendente" | "Pago" | "Atrasado" | "Cancelado";

// ---------------------------------------------------------------------------
// Entidades
// ---------------------------------------------------------------------------

export interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
  papel: PapelUsuario;
}

export interface Escola extends Auditoria {
  idEscola: number;
  nomeEscola: string;
  codigoInep: string | null;
  cnpj: string | null;
  redeEnsino?: string | null;
  enderecoEscola: string | null;
  telefoneEscola: string | null;
  emailEscola: string | null;
}

export interface Periodo extends Auditoria {
  idPeriodo: number;
  ano: number;
  nomePeriodo: string;
  /** YYYY-MM-DD */
  dataInicio: string;
  /** YYYY-MM-DD */
  dataFim: string;
  situacao: SituacaoPeriodo;
}

export interface Materia extends Auditoria {
  idMateria: number;
  nomeMateria: string;
  cargaHoraria: number;
}

export interface Responsavel extends Auditoria {
  idResponsavel: number;
  nomeResp: string;
  cpfResp: string | null;
  telefoneResp: string | null;
  emailResp: string | null;
  cepResp: string | null;
  enderecoResp: string | null;
}

export interface Aluno extends Auditoria {
  idAluno: number;
  numeroMatricula: string;
  nomeAluno: string;
  /** YYYY-MM-DD */
  dataNascimento: string;
  cpfAluno: string | null;
  telefoneAluno: string | null;
  emailAluno: string | null;
  cepAluno: string | null;
  enderecoAluno: string | null;
  situacao: SituacaoAluno;
}

export interface Turma extends Auditoria {
  idTurma: number;
  nomeTurma: string;
  serie?: string | null;
  turno: Turno;
  capacidade?: number | null;
  escolaId: number;
  anoLetivo: number;
}

export interface Professor extends Auditoria {
  idProfessor: number;
  nomeProf: string;
  cpfProf?: string | null;
  telefoneProf?: string | null;
  emailProf?: string | null;
  cepProf?: string | null;
  enderecoProf?: string | null;
  situacao: SituacaoProfessor;
  escolaId: number;
}

export interface Matricula extends Auditoria {
  idMatricula: number;
  alunoId: number;
  turmaId: number;
  /** YYYY-MM-DD */
  dataMatricula: string;
  situacao: SituacaoMatricula;
}

/** Vínculo Aluno × Responsável (PK composta alunoId + responsavelId). */
export interface AlunoResponsavel extends Auditoria {
  alunoId: number;
  responsavelId: number;
  tipoResponsavel: TipoResponsavel;
  responsavelFinanceiro: boolean;
}

export type VinculoResponsavel = AlunoResponsavel;

export interface GradeCurricular extends Auditoria {
  idGrade: number;
  turmaId: number;
  materiaId: number;
  professorId: number;
  cargaHorariaSemanal?: number | null;
}

export interface Avaliacao extends Auditoria {
  idAvaliacao: number;
  gradeId: number;
  periodoId: number;
  tipo: TipoAvaliacao;
  nomeAvaliacao: string;
  /** YYYY-MM-DD */
  dataAvaliacao: string;
  peso: Decimal;
}

export interface Nota extends Auditoria {
  idNota: number;
  avaliacaoId: number;
  alunoId: number;
  /** Entre 0.00 e 10.00 */
  valorNota: Decimal;
  observacao?: string | null;
}

export interface Frequencia extends Auditoria {
  idFrequencia: number;
  gradeId: number;
  alunoId: number;
  /** YYYY-MM-DD */
  dataFrequencia: string;
  situacao: SituacaoFrequencia;
  justificativa?: string | null;
}

export interface Boletim extends Auditoria {
  idBoletim: number;
  alunoId: number;
  periodoId: number;
  materiaId: number;
  /** Entre 0.00 e 10.00 */
  mediaFinal: Decimal;
  situacao: SituacaoBoletim;
}

export interface Boleto extends Auditoria {
  idBoleto: number;
  numeroBoleto: string;
  alunoId: number;
  /** YYYY-MM */
  competencia: string;
  valorMensalidade: Decimal;
  /** YYYY-MM-DD */
  dataVencimento: string;
  /** YYYY-MM-DD; preenchido pelo PATCH quando a situação vira "Pago". */
  dataPagamento?: string | null;
  situacao: SituacaoBoleto;
}

// ---------------------------------------------------------------------------
// Corpos de criação (POST): tudo menos o que o banco gera
// ---------------------------------------------------------------------------

export type EscolaEntrada = Omit<Escola, "idEscola" | keyof Auditoria>;
export type PeriodoEntrada = Omit<Periodo, "idPeriodo" | keyof Auditoria>;
export type MateriaEntrada = Omit<Materia, "idMateria" | keyof Auditoria>;
export type ResponsavelEntrada = Omit<Responsavel, "idResponsavel" | keyof Auditoria>;
export type AlunoEntrada = Omit<Aluno, "idAluno" | keyof Auditoria>;
export type TurmaEntrada = Omit<Turma, "idTurma" | keyof Auditoria>;
export type ProfessorEntrada = Omit<Professor, "idProfessor" | keyof Auditoria>;
export type MatriculaEntrada = Omit<Matricula, "idMatricula" | keyof Auditoria>;
export type GradeCurricularEntrada = Omit<GradeCurricular, "idGrade" | keyof Auditoria>;
export type AvaliacaoEntrada = Omit<Avaliacao, "idAvaliacao" | "peso" | keyof Auditoria> & {
  peso?: Decimal;
};
export type NotaEntrada = Omit<Nota, "idNota" | keyof Auditoria>;
export type FrequenciaEntrada = Omit<Frequencia, "idFrequencia" | keyof Auditoria>;
export type BoletimEntrada = Omit<Boletim, "idBoletim" | keyof Auditoria>;
export type BoletoEntrada = Omit<Boleto, "idBoleto" | "dataPagamento" | keyof Auditoria>;

/** POST /alunos/{alunoId}/responsaveis/{responsavelId}: os ids vão na URL. */
export type AlunoResponsavelEntrada = Pick<
  AlunoResponsavel,
  "tipoResponsavel" | "responsavelFinanceiro"
>;

// ---------------------------------------------------------------------------
// Corpos de atualização (PATCH) que aceitam menos campos que o cadastro
// ---------------------------------------------------------------------------

export type NotaAtualizacao = Partial<Pick<Nota, "valorNota" | "observacao">>;
export type FrequenciaAtualizacao = Partial<
  Pick<Frequencia, "situacao" | "dataFrequencia" | "justificativa">
>;
export type BoletimAtualizacao = Partial<Pick<Boletim, "mediaFinal" | "situacao">>;
export type BoletoAtualizacao = Partial<Pick<Boleto, "dataPagamento" | "situacao">>;
