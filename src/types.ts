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

/**
 * Professor — pertence a uma Escola (`escolaIdEscola`), assim como Turma.
 */
export type SituacaoProfessor = "Ativo" | "Inativo";

export interface Professor {
  idProfessor: number;
  nomeProf: string;
  cpfProf: string | null;
  telefoneProf: string | null;
  emailProf: string | null;
  cepProf: string | null;
  enderecoProf: string | null;
  situacao: SituacaoProfessor;
  /** FK — id da Escola a que este professor está vinculado. */
  escolaIdEscola: number;
  criadoEm: string;
  atualizadoEm: string;
}

export type ProfessorEntrada = Omit<Professor, "idProfessor" | "criadoEm" | "atualizadoEm">;

/**
 * Matéria — catálogo simples de disciplinas, sem vínculo com outra entidade
 * neste módulo (a associação com Turma/Professor fica para uma fase futura).
 */
export interface Materia {
  idMateria: number;
  nomeMateria: string;
  cargaHoraria?: number | null;
}

export type MateriaEntrada = Omit<Materia, "idMateria">;

/**
 * Período letivo — bimestre/semestre de um ano letivo. Entidade independente,
 * sem vínculo direto com outras (referenciada por nome/ano quando necessário).
 */
export type SituacaoPeriodo = "Ativo" | "Encerrado";

export interface Periodo {
  idPeriodo: number;
  ano: number;
  nomePeriodo: string;
  /** Data ISO (ex.: "2026-02-02"). */
  dataInicio: string;
  /** Data ISO (ex.: "2026-04-10"). */
  dataFim: string;
  situacao: SituacaoPeriodo;
  criadoEm: string;
  atualizadoEm: string;
}

export type PeriodoEntrada = Omit<Periodo, "idPeriodo" | "criadoEm" | "atualizadoEm">;

/**
 * Responsável — contato de um responsável legal. Entidade independente
 * neste módulo (o vínculo com Aluno fica para uma fase futura).
 */
export interface Responsavel {
  idResponsavel: number;
  nomeResp: string;
  cpfResp: string | null;
  telefoneResp: string | null;
  emailResp: string | null;
  cepResp: string | null;
  enderecoResp: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export type ResponsavelEntrada = Omit<Responsavel, "idResponsavel" | "criadoEm" | "atualizadoEm">;

/**
 * AlunoResponsavel — junção Aluno×Responsável, espelhando a tabela
 * `alunoresponsavel` (PK composta, sem idAluno/idResponsavel próprios).
 * `responsavelFinanceiro` é único por aluno — regra reforçada tanto aqui
 * (client-side, em `PaginaResponsaveis`/`PaginaAlunos`) quanto pelo trigger
 * `func_ar_financeiro_unico_ins/upd` no banco.
 */
/**
 * Vínculo Aluno/Responsável
 */
export type TipoResponsavel = "Pai" | "Mae" | "ResponsavelLegal" | "Outro";

export interface AlunoResponsavel {
  alunoIdAluno: number;
  responsavelIdResponsavel: number;
  tipoResponsavel: TipoResponsavel;
  responsavelFinanceiro: boolean;
}

export type AlunoResponsavelEntrada = AlunoResponsavel;

/**
 * Boleto
 */
export type SituacaoBoleto = "Pendente" | "Pago" | "Atrasado" | "Cancelado";

export interface Boleto {
  idBoleto: number;
  numeroBoleto: string;
  alunoIdAluno: number;
  competencia: string; // formato YYYY-MM
  valorMensalidade: number;
  dataVencimento: string; // formato YYYY-MM-DD
  dataPagamento: string | null;
  situacao: SituacaoBoleto;
}

export type BoletoEntrada = Omit<Boleto, "idBoleto">;

/**
 * Grade Curricular — junção Turma × Matéria × Professor: para cada turma,
 * quais matérias são lecionadas, por qual professor, em que ano letivo.
 * Espelha `uq_grade_turma_materia`: uma turma não pode ter a mesma matéria
 * cadastrada duas vezes na grade (client-side em `PaginaGrades`).
 */
export interface GradeCurricular {
  idGrade: number;
  /** FK — id da Turma a que esta grade pertence. */
  turmaIdTurma: number;
  /** FK — id da Matéria lecionada. */
  materiaIdMateria: number;
  /** FK — id do Professor responsável por essa matéria nesta turma. */
  professorIdProfessor: number;
  anoLetivo: number;
  cargaHorariaSemanal?: number | null;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type GradeCurricularEntrada = Omit<
  GradeCurricular,
  "idGrade" | "criadoEm" | "atualizadoEm"
>;

/**
 * Avaliação — instrumento de avaliação vinculado a uma Grade Curricular
 * (ou seja, a uma combinação turma+matéria+professor) e a um Período letivo.
 */
export type TipoAvaliacao = "Prova" | "Trabalho" | "Seminario" | "Participacao" | "Outro";

export interface Avaliacao {
  idAvaliacao: number;
  /** FK — id da Grade Curricular (turma+matéria+professor) avaliada. */
  gradeIdGrade: number;
  /** FK — id do Período letivo em que a avaliação ocorre. */
  periodoIdPeriodo: number;
  nomeAvaliacao: string;
  peso?: number;
  /** Data ISO (ex.: "2026-03-20"). */
  dataAvaliacao?: string;
  tipo: TipoAvaliacao;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type AvaliacaoEntrada = Omit<Avaliacao, "idAvaliacao" | "criadoEm" | "atualizadoEm">;

/**
 * Frequência — registro de presença de uma Matrícula (aluno matriculado em
 * uma turma) em uma aula de uma Grade Curricular (turma+matéria+professor)
 * em uma data específica.
 */
export type StatusFrequencia = "Presente" | "Ausente" | "Justificado";

export interface Frequencia {
  idFrequencia: number;
  /** FK — id da Matrícula (aluno na turma) cuja presença está sendo registrada. */
  matriculaIdMatricula: number;
  /** FK — id da Grade Curricular (aula de qual matéria/professor). */
  gradeIdGrade: number;
  /** Data ISO (ex.: "2026-03-09"). */
  dataAula: string;
  status: StatusFrequencia;
  justificativa?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type FrequenciaEntrada = Omit<Frequencia, "idFrequencia" | "criadoEm" | "atualizadoEm">;

/**
 * Nota — resultado de uma Matrícula em uma Avaliação específica.
 * `uq_nota_matricula_avaliacao` garante uma única nota por par
 * matrícula+avaliação — reforçado client-side em `PaginaNotas`.
 */
export interface Nota {
  idNota: number;
  /** FK — id da Matrícula (aluno na turma) avaliado. */
  matriculaIdMatricula: number;
  /** FK — id da Avaliação a que esta nota se refere. */
  avaliacaoIdAvaliacao: number;
  /** Entre 0.00 e 10.00 (`chk_valor_nota`). */
  valorNota: number;
  observacao?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type NotaEntrada = Omit<Nota, "idNota" | "criadoEm" | "atualizadoEm">;

/**
 * Boletim — consolidado de uma Matrícula (aluno) num Período letivo: média
 * final, total de faltas e situação. Único por par matrícula+período
 * (`uq_boletim_matricula_periodo`).
 */
export type SituacaoBoletim = "Aprovado" | "Reprovado" | "Recuperacao" | "Em Andamento";

export interface Boletim {
  idBoletim: number;
  /** FK — id da Matrícula (aluno) a que este boletim se refere. */
  matriculaIdMatricula: number;
  /** FK — id do Período letivo consolidado neste boletim. */
  periodoIdPeriodo: number;
  /** Entre 0.00 e 10.00, ou nulo enquanto o período ainda está em curso. */
  mediaFinal?: number | null;
  totalFaltas?: number;
  situacao: SituacaoBoletim;
  observacoes?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type BoletimEntrada = Omit<Boletim, "idBoletim" | "criadoEm" | "atualizadoEm">;