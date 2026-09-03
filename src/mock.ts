import type { Escola, Aluno, Turma, Matricula } from "./types.ts";

export const escolasMock: Escola[] = [
  {
    idEscola: 1,
    nomeEscola: "Escola Municipal Dom Pedro II",
    codigoInep: "22012345",
    cnpj: "12345678000190",
    enderecoEscola: "Rua das Acácias, 120 — Centro, Teresina/PI",
    telefoneEscola: "86 3222-1010",
    emailEscola: "contato@dompedro2.edu.br",
    criadoEm: "2024-02-01T08:00:00",
    atualizadoEm: "2024-02-01T08:00:00"
  },
  {
    idEscola: 2,
    nomeEscola: "Colégio Estadual Machado de Assis",
    codigoInep: "22054321",
    cnpj: "12345678000122",
    enderecoEscola: "Av. Rio Poti, 845 — Ilhotas, Teresina/PI",
    telefoneEscola: "86 3225-5678",
    emailEscola: "secretaria@machadodeassis.edu.br",
    criadoEm: "2023-08-12T10:00:00",
    atualizadoEm: "2023-08-12T10:00:00"
  },
  {
    idEscola: 3,
    nomeEscola: "Instituto Educacional Nova Aurora",
    codigoInep: null,
    cnpj: "98765432000155",
    enderecoEscola: null,
    telefoneEscola: null,
    emailEscola: "nova.aurora@ensino.org.br",
    criadoEm: "2026-01-20T14:30:00",
    atualizadoEm: "2026-01-20T14:30:00"
  },
  {
    idEscola: 4,
    nomeEscola: "Escola Municipal Beira Rio",
    codigoInep: "22077889",
    cnpj: "45678912000133",
    enderecoEscola: "Rua Coronel Miranda, 310 — Centro, Parnaíba/PI",
    telefoneEscola: "86 3322-4455",
    emailEscola: "contato@beirario.edu.br",
    criadoEm: "2024-06-18T09:15:00",
    atualizadoEm: "2024-06-18T09:15:00"
  }
];

export const alunosMock: Aluno[] = [
  {
    idAluno: 1,
    numeroMatricula: "2026001",
    nomeAluno: "Beatriz Souza Lima",
    dataNascimento: "2010-05-14",
    cpfAluno: "123.456.789-01",
    telefoneAluno: "86 99988-7766",
    emailAluno: "beatriz.lima@aluno.edu.br",
    cepAluno: "64000-000",
    enderecoAluno: "Rua das Palmeiras, 45 — Centro, Teresina/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-03T09:00:00",
    atualizadoEm: "2026-02-03T09:00:00"
  },
  {
    idAluno: 2,
    numeroMatricula: "2026002",
    nomeAluno: "Gabriel Ferreira Nunes",
    dataNascimento: "2011-11-02",
    cpfAluno: null,
    telefoneAluno: null,
    emailAluno: "gabriel.nunes@aluno.edu.br",
    cepAluno: null,
    enderecoAluno: null,
    situacao: "Transferido",
    criadoEm: "2025-03-10T08:30:00",
    atualizadoEm: "2026-01-05T16:00:00"
  },
  {
    idAluno: 3,
    numeroMatricula: "2025187",
    nomeAluno: "Larissa Costa Almeida",
    dataNascimento: "2009-08-22",
    cpfAluno: "987.654.321-00",
    telefoneAluno: "86 99911-2233",
    emailAluno: null,
    cepAluno: "64200-120",
    enderecoAluno: "Av. Nações Unidas, 780 — Reis Velloso, Parnaíba/PI",
    situacao: "Inativo",
    criadoEm: "2024-02-01T08:00:00",
    atualizadoEm: "2025-12-10T11:20:00"
  },
  {
    idAluno: 4,
    numeroMatricula: "2026004",
    nomeAluno: "Miguel Rodrigues Castro",
    dataNascimento: "2010-01-30",
    cpfAluno: "456.789.123-22",
    telefoneAluno: "89 99877-1122",
    emailAluno: "miguel.castro@aluno.edu.br",
    cepAluno: "64600-000",
    enderecoAluno: "Rua Almirante Gervásio Fioravante, 210 — Centro, Picos/PI",
    situacao: "Ativo",
    criadoEm: "2026-01-15T10:00:00",
    atualizadoEm: "2026-01-15T10:00:00"
  },
  {
    idAluno: 5,
    numeroMatricula: "2026005",
    nomeAluno: "Ana Clara Pereira Rocha",
    dataNascimento: "2011-07-09",
    cpfAluno: null,
    telefoneAluno: "89 99655-3344",
    emailAluno: "ana.rocha@aluno.edu.br",
    cepAluno: "64800-000",
    enderecoAluno: "Rua Coronel José Cordeiro, 88 — Centro, Floriano/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-10T13:00:00",
    atualizadoEm: "2026-02-10T13:00:00"
  }
];

export const turmasMock: Turma[] = [
  {
    idTurma: 1,
    nomeTurma: "9º Ano A",
    serie: "9º Ano",
    turno: "Manha",
    capacidade: 35,
    escolaIdEscola: 1,
    anoLetivo: 2026,
    criadoEm: "2026-01-10T08:00:00",
    atualizadoEm: "2026-01-10T08:00:00"
  },
  {
    idTurma: 2,
    nomeTurma: "1º Ano EM B",
    serie: "1º Ano Ensino Médio",
    turno: "Tarde",
    capacidade: 30,
    escolaIdEscola: 2,
    anoLetivo: 2026,
    criadoEm: "2026-01-12T08:30:00",
    atualizadoEm: "2026-01-12T08:30:00"
  },
  {
    idTurma: 3,
    nomeTurma: "6º Ano C",
    serie: "6º Ano",
    turno: "Integral",
    capacidade: null,
    escolaIdEscola: 1,
    anoLetivo: 2026,
    criadoEm: "2026-02-01T09:00:00",
    atualizadoEm: "2026-02-01T09:00:00"
  },
  {
    idTurma: 4,
    nomeTurma: "3º Ano EM A",
    serie: "3º Ano Ensino Médio",
    turno: "Noite",
    capacidade: 40,
    escolaIdEscola: 4,
    anoLetivo: 2026,
    criadoEm: "2026-01-20T07:45:00",
    atualizadoEm: "2026-01-20T07:45:00"
  }
];

export const matriculasMock: Matricula[] = [
  {
    idMatricula: 1,
    alunoIdAluno: 1,
    turmaIdTurma: 1,
    dataMatricula: "2026-02-03",
    situacao: "Ativa",
    criadoEm: "2026-02-03T09:00:00",
    atualizadoEm: "2026-02-03T09:00:00"
  },
  {
    idMatricula: 2,
    alunoIdAluno: 3,
    turmaIdTurma: 2,
    dataMatricula: "2024-02-01",
    situacao: "Transferida",
    criadoEm: "2024-02-01T08:00:00",
    atualizadoEm: "2025-12-10T11:20:00"
  },
  {
    idMatricula: 3,
    alunoIdAluno: 4,
    turmaIdTurma: 4,
    dataMatricula: "2026-01-15",
    situacao: "Ativa",
    criadoEm: "2026-01-15T10:00:00",
    atualizadoEm: "2026-01-15T10:00:00"
  },
  {
    idMatricula: 4,
    alunoIdAluno: 5,
    turmaIdTurma: 3,
    dataMatricula: "2026-02-10",
    situacao: "Concluida",
    criadoEm: "2026-02-10T13:00:00",
    atualizadoEm: "2026-02-10T13:00:00"
  }
];
