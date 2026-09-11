import type {
  Escola,
  Aluno,
  Turma,
  Matricula,
  Professor,
  Materia,
  Periodo,
  Responsavel,
} from "./types.ts";

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
    cpfAluno: "12345678901",
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
    cpfAluno: "98765432100",
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
    cpfAluno: "45678912322",
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

export const professoresMock: Professor[] = [
  {
    idProfessor: 1,
    nomeProf: "Carlos Eduardo Santos Rêgo",
    cpfProf: "11122233344",
    telefoneProf: "86 99911-4455",
    emailProf: "carlos.rego@dompedro2.edu.br",
    cepProf: "64000-100",
    enderecoProf: "Rua Áurea de Barros, 210 — Centro, Teresina/PI",
    situacao: "Ativo",
    escolaIdEscola: 1,
    criadoEm: "2024-02-05T08:00:00",
    atualizadoEm: "2024-02-05T08:00:00"
  },
  {
    idProfessor: 2,
    nomeProf: "Francisca das Chagas Oliveira",
    cpfProf: "22233344455",
    telefoneProf: "86 99822-6677",
    emailProf: "francisca.oliveira@machadodeassis.edu.br",
    cepProf: "64001-200",
    enderecoProf: "Av. Frei Serafim, 1500 — Centro, Teresina/PI",
    situacao: "Ativo",
    escolaIdEscola: 2,
    criadoEm: "2023-08-15T09:30:00",
    atualizadoEm: "2023-08-15T09:30:00"
  },
  {
    idProfessor: 3,
    nomeProf: "José Ribamar Costa Filho",
    cpfProf: "33344455566",
    telefoneProf: "86 99733-8899",
    emailProf: "jose.ribamar@dompedro2.edu.br",
    cepProf: "64002-300",
    enderecoProf: "Rua Bertha Tavares, 55 — Vermelha, Teresina/PI",
    situacao: "Ativo",
    escolaIdEscola: 1,
    criadoEm: "2025-01-20T10:00:00",
    atualizadoEm: "2025-01-20T10:00:00"
  },
  {
    idProfessor: 4,
    nomeProf: "Antônia Maria Lopes Sousa",
    cpfProf: "44455566677",
    telefoneProf: "86 99644-1122",
    emailProf: "antonia.sousa@beirario.edu.br",
    cepProf: "64200-050",
    enderecoProf: "Rua Cel. José Cordeiro, 320 — Centro, Parnaíba/PI",
    situacao: "Ativo",
    escolaIdEscola: 4,
    criadoEm: "2024-06-20T11:00:00",
    atualizadoEm: "2024-06-20T11:00:00"
  },
  {
    idProfessor: 5,
    nomeProf: "Raimundo Nonato Alves Pereira",
    cpfProf: "55566677788",
    telefoneProf: "89 99555-3344",
    emailProf: "raimundo.pereira@novaaurora.edu.br",
    cepProf: "64800-100",
    enderecoProf: "Rua Coronel José Cordeiro, 400 — Centro, Floriano/PI",
    situacao: "Inativo",
    escolaIdEscola: 3,
    criadoEm: "2025-03-01T08:45:00",
    atualizadoEm: "2026-01-10T14:00:00"
  },
  {
    idProfessor: 6,
    nomeProf: "Luzia Helena Ferreira Diniz",
    cpfProf: "66677788899",
    telefoneProf: "86 99366-5588",
    emailProf: "luzia.diniz@machadodeassis.edu.br",
    cepProf: "64001-350",
    enderecoProf: "Av. Rio Poti, 900 — Ilhotas, Teresina/PI",
    situacao: "Ativo",
    escolaIdEscola: 2,
    criadoEm: "2026-01-05T13:20:00",
    atualizadoEm: "2026-01-05T13:20:00"
  }
];

export const materiasMock: Materia[] = [
  { idMateria: 1, nomeMateria: "Matemática", cargaHoraria: 120 },
  { idMateria: 2, nomeMateria: "Língua Portuguesa", cargaHoraria: 120 },
  { idMateria: 3, nomeMateria: "História", cargaHoraria: 80 },
  { idMateria: 4, nomeMateria: "Geografia", cargaHoraria: 80 },
  { idMateria: 5, nomeMateria: "Biologia", cargaHoraria: 80 },
  { idMateria: 6, nomeMateria: "Física", cargaHoraria: 40 },
  { idMateria: 7, nomeMateria: "Química", cargaHoraria: 40 },
  { idMateria: 8, nomeMateria: "Educação Física", cargaHoraria: 40 },
  { idMateria: 9, nomeMateria: "Artes", cargaHoraria: 40 },
  { idMateria: 10, nomeMateria: "Língua Inglesa", cargaHoraria: 40 }
];

export const periodosMock: Periodo[] = [
  {
    idPeriodo: 1,
    ano: 2026,
    nomePeriodo: "1º Bimestre",
    dataInicio: "2026-02-02",
    dataFim: "2026-04-10",
    situacao: "Encerrado",
    criadoEm: "2026-01-15T08:00:00",
    atualizadoEm: "2026-04-10T18:00:00"
  },
  {
    idPeriodo: 2,
    ano: 2026,
    nomePeriodo: "2º Bimestre",
    dataInicio: "2026-04-13",
    dataFim: "2026-06-19",
    situacao: "Ativo",
    criadoEm: "2026-01-15T08:00:00",
    atualizadoEm: "2026-01-15T08:00:00"
  },
  {
    idPeriodo: 3,
    ano: 2026,
    nomePeriodo: "3º Bimestre",
    dataInicio: "2026-07-27",
    dataFim: "2026-09-25",
    situacao: "Ativo",
    criadoEm: "2026-01-15T08:00:00",
    atualizadoEm: "2026-01-15T08:00:00"
  },
  {
    idPeriodo: 4,
    ano: 2026,
    nomePeriodo: "4º Bimestre",
    dataInicio: "2026-09-28",
    dataFim: "2026-12-18",
    situacao: "Ativo",
    criadoEm: "2026-01-15T08:00:00",
    atualizadoEm: "2026-01-15T08:00:00"
  },
  {
    idPeriodo: 5,
    ano: 2026,
    nomePeriodo: "1º Semestre",
    dataInicio: "2026-02-02",
    dataFim: "2026-06-19",
    situacao: "Ativo",
    criadoEm: "2026-01-15T08:00:00",
    atualizadoEm: "2026-01-15T08:00:00"
  }
];

export const responsaveisMock: Responsavel[] = [
  {
    idResponsavel: 1,
    nomeResp: "Sebastião Nunes Carvalho",
    cpfResp: "12345678900",
    telefoneResp: "86 99911-2200",
    emailResp: "sebastiao.carvalho@gmail.com",
    cepResp: "64000-000",
    enderecoResp: "Rua das Palmeiras, 45 — Centro, Teresina/PI",
    criadoEm: "2026-02-03T09:00:00",
    atualizadoEm: "2026-02-03T09:00:00"
  },
  {
    idResponsavel: 2,
    nomeResp: "Maria do Socorro Ferreira Nunes",
    cpfResp: "23456789011",
    telefoneResp: "86 99822-3311",
    emailResp: "socorro.nunes@hotmail.com",
    cepResp: "64000-050",
    enderecoResp: "Rua Areolino de Abreu, 780 — Centro, Teresina/PI",
    criadoEm: "2025-03-10T08:30:00",
    atualizadoEm: "2025-03-10T08:30:00"
  },
  {
    idResponsavel: 3,
    nomeResp: "Antônio Carlos Almeida Costa",
    cpfResp: "34567890122",
    telefoneResp: "86 99733-4422",
    emailResp: "antonio.costa@yahoo.com.br",
    cepResp: "64200-120",
    enderecoResp: "Av. Nações Unidas, 780 — Reis Velloso, Parnaíba/PI",
    criadoEm: "2024-02-01T08:00:00",
    atualizadoEm: "2024-02-01T08:00:00"
  },
  {
    idResponsavel: 4,
    nomeResp: "Francisca Edileuza Castro Rodrigues",
    cpfResp: "45678901233",
    telefoneResp: "89 99644-5533",
    emailResp: "edileuza.rodrigues@gmail.com",
    cepResp: "64600-000",
    enderecoResp: "Rua Almirante Gervásio Fioravante, 210 — Centro, Picos/PI",
    criadoEm: "2026-01-15T10:00:00",
    atualizadoEm: "2026-01-15T10:00:00"
  },
  {
    idResponsavel: 5,
    nomeResp: "José Wilson Pereira Rocha",
    cpfResp: "56789012344",
    telefoneResp: "89 99555-6644",
    emailResp: "wilson.rocha@outlook.com",
    cepResp: "64800-000",
    enderecoResp: "Rua Coronel José Cordeiro, 88 — Centro, Floriano/PI",
    criadoEm: "2026-02-10T13:00:00",
    atualizadoEm: "2026-02-10T13:00:00"
  },
  {
    idResponsavel: 6,
    nomeResp: "Rosa Maria Sousa Lima",
    cpfResp: "67890123455",
    telefoneResp: "86 99466-7755",
    emailResp: "rosa.lima@gmail.com",
    cepResp: "64001-200",
    enderecoResp: "Av. Rio Poti, 845 — Ilhotas, Teresina/PI",
    criadoEm: "2023-08-12T10:00:00",
    atualizadoEm: "2023-08-12T10:00:00"
  },
  {
    idResponsavel: 7,
    nomeResp: "Pedro Henrique Bezerra Martins",
    cpfResp: "78901234566",
    telefoneResp: "86 99377-8866",
    emailResp: "pedro.martins@hotmail.com",
    cepResp: "64002-300",
    enderecoResp: "Rua Bertha Tavares, 55 — Vermelha, Teresina/PI",
    criadoEm: "2025-01-20T10:00:00",
    atualizadoEm: "2025-01-20T10:00:00"
  },
  {
    idResponsavel: 8,
    nomeResp: "Vera Lúcia Barros Monteiro",
    cpfResp: "89012345677",
    telefoneResp: "86 99288-9977",
    emailResp: "vera.monteiro@yahoo.com.br",
    cepResp: "64200-050",
    enderecoResp: "Rua Cel. José Cordeiro, 320 — Centro, Parnaíba/PI",
    criadoEm: "2024-06-20T11:00:00",
    atualizadoEm: "2024-06-20T11:00:00"
  },
  {
    idResponsavel: 9,
    nomeResp: "João Batista Araújo Freitas",
    cpfResp: "90123456788",
    telefoneResp: "89 99199-0088",
    emailResp: "joao.freitas@gmail.com",
    cepResp: "64800-100",
    enderecoResp: "Rua Coronel José Cordeiro, 400 — Centro, Floriano/PI",
    criadoEm: "2025-03-01T08:45:00",
    atualizadoEm: "2025-03-01T08:45:00"
  },
  {
    idResponsavel: 10,
    nomeResp: "Cleonice Rodrigues Vieira",
    cpfResp: "01234567899",
    telefoneResp: "86 99080-1199",
    emailResp: "cleonice.vieira@outlook.com",
    cepResp: "64001-350",
    enderecoResp: "Av. Rio Poti, 900 — Ilhotas, Teresina/PI",
    criadoEm: "2026-01-05T13:20:00",
    atualizadoEm: "2026-01-05T13:20:00"
  }
];
