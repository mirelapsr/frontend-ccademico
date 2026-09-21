import type { Escola, Aluno, Turma, Matricula, Professor, Materia, Responsavel, AlunoResponsavel, Boleto, Periodo, GradeCurricular, Avaliacao, Frequencia, Nota, Boletim } from "./types";

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
    numeroMatricula: "20260001",
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
    numeroMatricula: "20260002",
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
    numeroMatricula: "20240187",
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
    numeroMatricula: "20260004",
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
    numeroMatricula: "20260005",
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
  },
  {
    idAluno: 6,
    numeroMatricula: "20260006",
    nomeAluno: "Pedro Henrique Almeida Souza",
    dataNascimento: "2012-03-11",
    cpfAluno: "11223344501",
    telefoneAluno: "86 99006-1006",
    emailAluno: "pedro.souza@aluno.edu.br",
    cepAluno: "64001-010",
    enderecoAluno: "Rua Simplício Mendes, 210 — Centro, Teresina/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 7,
    numeroMatricula: "20260007",
    nomeAluno: "Manuela Cardoso Freitas",
    dataNascimento: "2011-09-24",
    cpfAluno: "11223344502",
    telefoneAluno: "86 99007-1007",
    emailAluno: "manuela.freitas@aluno.edu.br",
    cepAluno: "64002-330",
    enderecoAluno: "Rua Magalhães Filho, 88 — Centro, Teresina/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 8,
    numeroMatricula: "20260008",
    nomeAluno: "João Vitor Nascimento Barros",
    dataNascimento: "2012-01-07",
    cpfAluno: "11223344503",
    telefoneAluno: "86 99008-1008",
    emailAluno: "joão.barros@aluno.edu.br",
    cepAluno: "64200-210",
    enderecoAluno: "Rua Cel. Domingos Costa, 154 — Centro, Parnaíba/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 9,
    numeroMatricula: "20260009",
    nomeAluno: "Isabela Ribeiro Martins",
    dataNascimento: "2010-06-19",
    cpfAluno: "11223344504",
    telefoneAluno: "86 99009-1009",
    emailAluno: "isabela.martins@aluno.edu.br",
    cepAluno: "64000-410",
    enderecoAluno: "Rua David Caldas, 305 — Centro, Teresina/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 10,
    numeroMatricula: "20260010",
    nomeAluno: "Gabriel Moreira Dias",
    dataNascimento: "2010-11-02",
    cpfAluno: "11223344505",
    telefoneAluno: "89 99010-1010",
    emailAluno: "gabriel.dias@aluno.edu.br",
    cepAluno: "64800-210",
    enderecoAluno: "Rua Simplício Dias, 45 — Centro, Floriano/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 11,
    numeroMatricula: "20260011",
    nomeAluno: "Laura Teixeira Nunes",
    dataNascimento: "2011-02-28",
    cpfAluno: "11223344506",
    telefoneAluno: "86 99011-1011",
    emailAluno: "laura.nunes@aluno.edu.br",
    cepAluno: "64600-110",
    enderecoAluno: "Rua Coelho Rodrigues, 320 — Centro, Picos/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 12,
    numeroMatricula: "20260012",
    nomeAluno: "Nicolas Andrade Machado",
    dataNascimento: "2010-08-15",
    cpfAluno: "11223344507",
    telefoneAluno: "86 99012-1012",
    emailAluno: "nicolas.machado@aluno.edu.br",
    cepAluno: "64001-220",
    enderecoAluno: "Av. Miguel Rosa, 670 — Cabral, Teresina/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 13,
    numeroMatricula: "20260013",
    nomeAluno: "Alice Marques Vieira",
    dataNascimento: "2015-04-05",
    cpfAluno: "11223344508",
    telefoneAluno: "86 99013-1013",
    emailAluno: "alice.vieira@aluno.edu.br",
    cepAluno: "64003-140",
    enderecoAluno: "Rua Paissandu, 512 — Centro, Teresina/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 14,
    numeroMatricula: "20260014",
    nomeAluno: "Théo Batista Correia",
    dataNascimento: "2014-12-20",
    cpfAluno: "11223344509",
    telefoneAluno: "86 99014-1014",
    emailAluno: "théo.correia@aluno.edu.br",
    cepAluno: "64201-050",
    enderecoAluno: "Rua Itaúna, 98 — Pindorama, Parnaíba/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 15,
    numeroMatricula: "20260015",
    nomeAluno: "Yasmin Farias Monteiro",
    dataNascimento: "2015-07-13",
    cpfAluno: "11223344510",
    telefoneAluno: "89 99015-1015",
    emailAluno: "yasmin.monteiro@aluno.edu.br",
    cepAluno: "64800-330",
    enderecoAluno: "Rua Boa Esperança, 12 — Centro, Floriano/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 16,
    numeroMatricula: "20260016",
    nomeAluno: "Bernardo Pinheiro Castro",
    dataNascimento: "2014-10-09",
    cpfAluno: "11223344511",
    telefoneAluno: "86 99016-1016",
    emailAluno: "bernardo.castro@aluno.edu.br",
    cepAluno: "64600-260",
    enderecoAluno: "Rua João Pessoa, 77 — Junco, Picos/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 17,
    numeroMatricula: "20260017",
    nomeAluno: "Sofia Cavalcante Rocha",
    dataNascimento: "2008-05-30",
    cpfAluno: "11223344512",
    telefoneAluno: "86 99017-1017",
    emailAluno: "sofia.rocha@aluno.edu.br",
    cepAluno: "64000-620",
    enderecoAluno: "Av. Frei Serafim, 1220 — Centro, Teresina/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 18,
    numeroMatricula: "20260018",
    nomeAluno: "Arthur Fonseca Lopes",
    dataNascimento: "2009-01-18",
    cpfAluno: "11223344513",
    telefoneAluno: "86 99018-1018",
    emailAluno: "arthur.lopes@aluno.edu.br",
    cepAluno: "64001-330",
    enderecoAluno: "Rua Coelho de Resende, 400 — Centro, Teresina/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 19,
    numeroMatricula: "20260019",
    nomeAluno: "Helena Brito Gomes",
    dataNascimento: "2008-09-22",
    cpfAluno: "11223344514",
    telefoneAluno: "86 99019-1019",
    emailAluno: "helena.gomes@aluno.edu.br",
    cepAluno: "64200-450",
    enderecoAluno: "Av. São Sebastião, 210 — Centro, Parnaíba/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 20,
    numeroMatricula: "20260020",
    nomeAluno: "Samuel Moura Ribeiro",
    dataNascimento: "2009-03-27",
    cpfAluno: "11223344515",
    telefoneAluno: "89 99020-1020",
    emailAluno: "samuel.ribeiro@aluno.edu.br",
    cepAluno: "64800-450",
    enderecoAluno: "Rua Marechal Deodoro, 66 — Centro, Floriano/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 21,
    numeroMatricula: "20260021",
    nomeAluno: "Valentina Costa Andrade",
    dataNascimento: "2008-11-11",
    cpfAluno: "11223344516",
    telefoneAluno: "86 99021-1021",
    emailAluno: "valentina.andrade@aluno.edu.br",
    cepAluno: "64600-380",
    enderecoAluno: "Rua Coronel José Vieira, 90 — Centro, Picos/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 22,
    numeroMatricula: "20260022",
    nomeAluno: "Otávio Nascimento Pereira",
    dataNascimento: "2009-06-06",
    cpfAluno: "11223344517",
    telefoneAluno: "86 99022-1022",
    emailAluno: "otávio.pereira@aluno.edu.br",
    cepAluno: "64002-090",
    enderecoAluno: "Rua Alvaro Mendes, 980 — Centro, Teresina/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 23,
    numeroMatricula: "20260023",
    nomeAluno: "Luiza Rodrigues Carvalho",
    dataNascimento: "2008-02-14",
    cpfAluno: "11223344518",
    telefoneAluno: "86 99023-1023",
    emailAluno: "luiza.carvalho@aluno.edu.br",
    cepAluno: "64003-260",
    enderecoAluno: "Rua Bocaiúva, 145 — Centro, Teresina/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 24,
    numeroMatricula: "20260024",
    nomeAluno: "Vinícius Santos Freitas",
    dataNascimento: "2009-08-08",
    cpfAluno: "11223344519",
    telefoneAluno: "86 99024-1024",
    emailAluno: "vinícius.freitas@aluno.edu.br",
    cepAluno: "64200-610",
    enderecoAluno: "Rua Gabriel Ferreira, 233 — Centro, Parnaíba/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
  },
  {
    idAluno: 25,
    numeroMatricula: "20260025",
    nomeAluno: "Melissa Almeida Barros",
    dataNascimento: "2008-12-03",
    cpfAluno: "11223344520",
    telefoneAluno: "89 99025-1025",
    emailAluno: "melissa.barros@aluno.edu.br",
    cepAluno: "64800-560",
    enderecoAluno: "Rua José Ferreira, 155 — Centro, Floriano/PI",
    situacao: "Ativo",
    criadoEm: "2026-02-01T08:00:00",
    atualizadoEm: "2026-02-01T08:00:00"
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
  },
  {
    idMatricula: 5,
    alunoIdAluno: 6,
    turmaIdTurma: 1,
    dataMatricula: "2026-02-02",
    situacao: "Ativa",
    criadoEm: "2026-02-02T08:00:00",
    atualizadoEm: "2026-02-02T08:00:00"
  },
  {
    idMatricula: 6,
    alunoIdAluno: 7,
    turmaIdTurma: 1,
    dataMatricula: "2026-02-02",
    situacao: "Ativa",
    criadoEm: "2026-02-02T08:00:00",
    atualizadoEm: "2026-02-02T08:00:00"
  },
  {
    idMatricula: 7,
    alunoIdAluno: 8,
    turmaIdTurma: 1,
    dataMatricula: "2026-02-03",
    situacao: "Ativa",
    criadoEm: "2026-02-03T08:00:00",
    atualizadoEm: "2026-02-03T08:00:00"
  },
  {
    idMatricula: 8,
    alunoIdAluno: 9,
    turmaIdTurma: 2,
    dataMatricula: "2026-02-02",
    situacao: "Ativa",
    criadoEm: "2026-02-02T08:00:00",
    atualizadoEm: "2026-02-02T08:00:00"
  },
  {
    idMatricula: 9,
    alunoIdAluno: 10,
    turmaIdTurma: 2,
    dataMatricula: "2026-02-02",
    situacao: "Ativa",
    criadoEm: "2026-02-02T08:00:00",
    atualizadoEm: "2026-02-02T08:00:00"
  },
  {
    idMatricula: 10,
    alunoIdAluno: 11,
    turmaIdTurma: 2,
    dataMatricula: "2026-02-03",
    situacao: "Ativa",
    criadoEm: "2026-02-03T08:00:00",
    atualizadoEm: "2026-02-03T08:00:00"
  },
  {
    idMatricula: 11,
    alunoIdAluno: 12,
    turmaIdTurma: 2,
    dataMatricula: "2026-02-03",
    situacao: "Ativa",
    criadoEm: "2026-02-03T08:00:00",
    atualizadoEm: "2026-02-03T08:00:00"
  },
  {
    idMatricula: 12,
    alunoIdAluno: 13,
    turmaIdTurma: 3,
    dataMatricula: "2026-02-02",
    situacao: "Ativa",
    criadoEm: "2026-02-02T08:00:00",
    atualizadoEm: "2026-02-02T08:00:00"
  },
  {
    idMatricula: 13,
    alunoIdAluno: 14,
    turmaIdTurma: 3,
    dataMatricula: "2026-02-02",
    situacao: "Ativa",
    criadoEm: "2026-02-02T08:00:00",
    atualizadoEm: "2026-02-02T08:00:00"
  },
  {
    idMatricula: 14,
    alunoIdAluno: 15,
    turmaIdTurma: 3,
    dataMatricula: "2026-02-03",
    situacao: "Ativa",
    criadoEm: "2026-02-03T08:00:00",
    atualizadoEm: "2026-02-03T08:00:00"
  },
  {
    idMatricula: 15,
    alunoIdAluno: 16,
    turmaIdTurma: 3,
    dataMatricula: "2026-02-03",
    situacao: "Ativa",
    criadoEm: "2026-02-03T08:00:00",
    atualizadoEm: "2026-02-03T08:00:00"
  },
  {
    idMatricula: 16,
    alunoIdAluno: 17,
    turmaIdTurma: 4,
    dataMatricula: "2026-02-02",
    situacao: "Ativa",
    criadoEm: "2026-02-02T08:00:00",
    atualizadoEm: "2026-02-02T08:00:00"
  },
  {
    idMatricula: 17,
    alunoIdAluno: 18,
    turmaIdTurma: 4,
    dataMatricula: "2026-02-02",
    situacao: "Ativa",
    criadoEm: "2026-02-02T08:00:00",
    atualizadoEm: "2026-02-02T08:00:00"
  },
  {
    idMatricula: 18,
    alunoIdAluno: 19,
    turmaIdTurma: 4,
    dataMatricula: "2026-02-02",
    situacao: "Ativa",
    criadoEm: "2026-02-02T08:00:00",
    atualizadoEm: "2026-02-02T08:00:00"
  },
  {
    idMatricula: 19,
    alunoIdAluno: 20,
    turmaIdTurma: 4,
    dataMatricula: "2026-02-03",
    situacao: "Ativa",
    criadoEm: "2026-02-03T08:00:00",
    atualizadoEm: "2026-02-03T08:00:00"
  },
  {
    idMatricula: 20,
    alunoIdAluno: 21,
    turmaIdTurma: 4,
    dataMatricula: "2026-02-03",
    situacao: "Ativa",
    criadoEm: "2026-02-03T08:00:00",
    atualizadoEm: "2026-02-03T08:00:00"
  },
  {
    idMatricula: 21,
    alunoIdAluno: 22,
    turmaIdTurma: 4,
    dataMatricula: "2026-02-03",
    situacao: "Ativa",
    criadoEm: "2026-02-03T08:00:00",
    atualizadoEm: "2026-02-03T08:00:00"
  },
  {
    idMatricula: 22,
    alunoIdAluno: 23,
    turmaIdTurma: 4,
    dataMatricula: "2026-02-04",
    situacao: "Ativa",
    criadoEm: "2026-02-04T08:00:00",
    atualizadoEm: "2026-02-04T08:00:00"
  },
  {
    idMatricula: 23,
    alunoIdAluno: 24,
    turmaIdTurma: 4,
    dataMatricula: "2026-02-04",
    situacao: "Ativa",
    criadoEm: "2026-02-04T08:00:00",
    atualizadoEm: "2026-02-04T08:00:00"
  },
  {
    idMatricula: 24,
    alunoIdAluno: 25,
    turmaIdTurma: 4,
    dataMatricula: "2026-02-04",
    situacao: "Ativa",
    criadoEm: "2026-02-04T08:00:00",
    atualizadoEm: "2026-02-04T08:00:00"
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

export const vinculosMock: AlunoResponsavel[] = [
  { alunoIdAluno: 1, responsavelIdResponsavel: 1, tipoResponsavel: "Mae", responsavelFinanceiro: true },
  { alunoIdAluno: 1, responsavelIdResponsavel: 2, tipoResponsavel: "Pai", responsavelFinanceiro: false },
  { alunoIdAluno: 2, responsavelIdResponsavel: 3, tipoResponsavel: "ResponsavelLegal", responsavelFinanceiro: true },
  { alunoIdAluno: 3, responsavelIdResponsavel: 4, tipoResponsavel: "Mae", responsavelFinanceiro: true },
  { alunoIdAluno: 4, responsavelIdResponsavel: 5, tipoResponsavel: "Pai", responsavelFinanceiro: true },
  { alunoIdAluno: 5, responsavelIdResponsavel: 1, tipoResponsavel: "Outro", responsavelFinanceiro: true }
];

export const boletosMock: Boleto[] = [
  { idBoleto: 1, numeroBoleto: "BOL-2026-0001", alunoIdAluno: 1, competencia: "2026-01", valorMensalidade: 600.00, dataVencimento: "2026-01-10", dataPagamento: "2026-01-08", situacao: "Pago" },
  { idBoleto: 2, numeroBoleto: "BOL-2026-0002", alunoIdAluno: 2, competencia: "2026-01", valorMensalidade: 450.00, dataVencimento: "2026-01-10", dataPagamento: null, situacao: "Atrasado" },
  { idBoleto: 3, numeroBoleto: "BOL-2026-0003", alunoIdAluno: 3, competencia: "2026-01", valorMensalidade: 500.00, dataVencimento: "2026-01-15", dataPagamento: null, situacao: "Cancelado" },
  { idBoleto: 4, numeroBoleto: "BOL-2026-0004", alunoIdAluno: 4, competencia: "2026-02", valorMensalidade: 550.00, dataVencimento: "2026-02-10", dataPagamento: null, situacao: "Pendente" },
  { idBoleto: 5, numeroBoleto: "BOL-2026-0005", alunoIdAluno: 5, competencia: "2026-02", valorMensalidade: 600.00, dataVencimento: "2026-02-05", dataPagamento: null, situacao: "Pendente" },
  { idBoleto: 6, numeroBoleto: "BOL-2026-0006", alunoIdAluno: 1, competencia: "2026-02", valorMensalidade: 600.00, dataVencimento: "2026-02-10", dataPagamento: null, situacao: "Pendente" }
];

// Combinações (turmaIdTurma, materiaIdMateria) escolhidas para nunca colidir
// com a UNIQUE (uq_grade_turma_materia). Professor sempre da mesma escola da
// turma: Turma 1 e 3 → Escola 1 (professores 1 e 3); Turma 2 → Escola 2
// (professores 2 e 6); Turma 4 → Escola 4 (professor 4).
export const gradesCurricularesMock: GradeCurricular[] = [
  {
    idGrade: 1,
    turmaIdTurma: 1,
    materiaIdMateria: 1,
    professorIdProfessor: 1,
    anoLetivo: 2026,
    cargaHorariaSemanal: 5,
    criadoEm: "2026-01-20T08:00:00",
    atualizadoEm: "2026-01-20T08:00:00"
  },
  {
    idGrade: 2,
    turmaIdTurma: 1,
    materiaIdMateria: 2,
    professorIdProfessor: 3,
    anoLetivo: 2026,
    cargaHorariaSemanal: 5,
    criadoEm: "2026-01-20T08:00:00",
    atualizadoEm: "2026-01-20T08:00:00"
  },
  {
    idGrade: 3,
    turmaIdTurma: 1,
    materiaIdMateria: 3,
    professorIdProfessor: 1,
    anoLetivo: 2026,
    cargaHorariaSemanal: 3,
    criadoEm: "2026-01-20T08:00:00",
    atualizadoEm: "2026-01-20T08:00:00"
  },
  {
    idGrade: 4,
    turmaIdTurma: 2,
    materiaIdMateria: 1,
    professorIdProfessor: 2,
    anoLetivo: 2026,
    cargaHorariaSemanal: 4,
    criadoEm: "2026-01-22T08:30:00",
    atualizadoEm: "2026-01-22T08:30:00"
  },
  {
    idGrade: 5,
    turmaIdTurma: 2,
    materiaIdMateria: 4,
    professorIdProfessor: 6,
    anoLetivo: 2026,
    cargaHorariaSemanal: 3,
    criadoEm: "2026-01-22T08:30:00",
    atualizadoEm: "2026-01-22T08:30:00"
  },
  {
    idGrade: 6,
    turmaIdTurma: 2,
    materiaIdMateria: 10,
    professorIdProfessor: 6,
    anoLetivo: 2026,
    cargaHorariaSemanal: 2,
    criadoEm: "2026-01-22T08:30:00",
    atualizadoEm: "2026-01-22T08:30:00"
  },
  {
    idGrade: 7,
    turmaIdTurma: 3,
    materiaIdMateria: 2,
    professorIdProfessor: 3,
    anoLetivo: 2026,
    cargaHorariaSemanal: 5,
    criadoEm: "2026-02-01T09:15:00",
    atualizadoEm: "2026-02-01T09:15:00"
  },
  {
    idGrade: 8,
    turmaIdTurma: 3,
    materiaIdMateria: 5,
    professorIdProfessor: 1,
    anoLetivo: 2026,
    cargaHorariaSemanal: 3,
    criadoEm: "2026-02-01T09:15:00",
    atualizadoEm: "2026-02-01T09:15:00"
  },
  {
    idGrade: 9,
    turmaIdTurma: 4,
    materiaIdMateria: 6,
    professorIdProfessor: 4,
    anoLetivo: 2026,
    cargaHorariaSemanal: 4,
    criadoEm: "2026-01-20T07:45:00",
    atualizadoEm: "2026-01-20T07:45:00"
  },
  {
    idGrade: 10,
    turmaIdTurma: 4,
    materiaIdMateria: 7,
    professorIdProfessor: 4,
    anoLetivo: 2026,
    cargaHorariaSemanal: 4,
    criadoEm: "2026-01-20T07:45:00",
    atualizadoEm: "2026-01-20T07:45:00"
  }
];

export const avaliacoesMock: Avaliacao[] = [
  {
    idAvaliacao: 1,
    gradeIdGrade: 1,
    periodoIdPeriodo: 1,
    nomeAvaliacao: "Prova Bimestral 1",
    peso: 2.0,
    dataAvaliacao: "2026-03-20",
    tipo: "Prova",
    criadoEm: "2026-02-10T08:00:00",
    atualizadoEm: "2026-02-10T08:00:00"
  },
  {
    idAvaliacao: 2,
    gradeIdGrade: 1,
    periodoIdPeriodo: 2,
    nomeAvaliacao: "Prova Bimestral 2",
    peso: 2.0,
    dataAvaliacao: "2026-05-15",
    tipo: "Prova",
    criadoEm: "2026-02-10T08:00:00",
    atualizadoEm: "2026-02-10T08:00:00"
  },
  {
    idAvaliacao: 3,
    gradeIdGrade: 2,
    periodoIdPeriodo: 1,
    nomeAvaliacao: "Trabalho de Literatura",
    peso: 1.5,
    dataAvaliacao: "2026-03-25",
    tipo: "Trabalho",
    criadoEm: "2026-02-10T08:10:00",
    atualizadoEm: "2026-02-10T08:10:00"
  },
  {
    idAvaliacao: 4,
    gradeIdGrade: 3,
    periodoIdPeriodo: 1,
    nomeAvaliacao: "Seminário Revolução Francesa",
    peso: 1.0,
    dataAvaliacao: "2026-04-02",
    tipo: "Seminario",
    criadoEm: "2026-02-10T08:20:00",
    atualizadoEm: "2026-02-10T08:20:00"
  },
  {
    idAvaliacao: 5,
    gradeIdGrade: 4,
    periodoIdPeriodo: 2,
    nomeAvaliacao: "Prova de Funções",
    peso: 2.5,
    dataAvaliacao: "2026-05-20",
    tipo: "Prova",
    criadoEm: "2026-02-12T09:00:00",
    atualizadoEm: "2026-02-12T09:00:00"
  },
  {
    idAvaliacao: 6,
    gradeIdGrade: 5,
    periodoIdPeriodo: 2,
    nomeAvaliacao: "Participação em Sala",
    peso: 1.0,
    tipo: "Participacao",
    criadoEm: "2026-02-12T09:10:00",
    atualizadoEm: "2026-02-12T09:10:00"
  },
  {
    idAvaliacao: 7,
    gradeIdGrade: 6,
    periodoIdPeriodo: 1,
    nomeAvaliacao: "Listening Test",
    peso: 1.0,
    dataAvaliacao: "2026-03-18",
    tipo: "Prova",
    criadoEm: "2026-02-12T09:20:00",
    atualizadoEm: "2026-02-12T09:20:00"
  },
  {
    idAvaliacao: 8,
    gradeIdGrade: 7,
    periodoIdPeriodo: 1,
    nomeAvaliacao: "Redação Dissertativa",
    peso: 2.0,
    dataAvaliacao: "2026-03-30",
    tipo: "Trabalho",
    criadoEm: "2026-02-14T10:00:00",
    atualizadoEm: "2026-02-14T10:00:00"
  },
  {
    idAvaliacao: 9,
    gradeIdGrade: 7,
    periodoIdPeriodo: 2,
    nomeAvaliacao: "Prova de Gramática",
    peso: 2.0,
    dataAvaliacao: "2026-05-10",
    tipo: "Outro",
    criadoEm: "2026-02-14T10:05:00",
    atualizadoEm: "2026-02-14T10:05:00"
  },
  {
    idAvaliacao: 10,
    gradeIdGrade: 8,
    periodoIdPeriodo: 2,
    nomeAvaliacao: "Prova de Citologia",
    peso: 2.0,
    dataAvaliacao: "2026-05-22",
    tipo: "Prova",
    criadoEm: "2026-02-14T10:15:00",
    atualizadoEm: "2026-02-14T10:15:00"
  },
  {
    idAvaliacao: 11,
    gradeIdGrade: 9,
    periodoIdPeriodo: 3,
    nomeAvaliacao: "Trabalho de Mecânica",
    peso: 1.5,
    dataAvaliacao: "2026-08-10",
    tipo: "Trabalho",
    criadoEm: "2026-02-16T11:00:00",
    atualizadoEm: "2026-02-16T11:00:00"
  },
  {
    idAvaliacao: 12,
    gradeIdGrade: 10,
    periodoIdPeriodo: 3,
    nomeAvaliacao: "Seminário Tabela Periódica",
    peso: 1.0,
    dataAvaliacao: "2026-08-20",
    tipo: "Seminario",
    criadoEm: "2026-02-16T11:10:00",
    atualizadoEm: "2026-02-16T11:10:00"
  }
];

// Mapa de referência usado para montar os mocks abaixo (matrícula → turma →
// grades da turma): Matrícula 1 → Turma 1 → Grades 1,2,3 · Matrícula 2 →
// Turma 2 → Grades 4,5,6 · Matrícula 3 → Turma 4 → Grades 9,10 · Matrícula 4
// → Turma 3 → Grades 7,8.
export const frequenciasMock: Frequencia[] = [
  {
    idFrequencia: 1,
    matriculaIdMatricula: 1,
    gradeIdGrade: 1,
    dataAula: "2026-03-02",
    status: "Presente",
    criadoEm: "2026-03-02T12:00:00",
    atualizadoEm: "2026-03-02T12:00:00"
  },
  {
    idFrequencia: 2,
    matriculaIdMatricula: 1,
    gradeIdGrade: 1,
    dataAula: "2026-03-09",
    status: "Ausente",
    criadoEm: "2026-03-09T12:00:00",
    atualizadoEm: "2026-03-09T12:00:00"
  },
  {
    idFrequencia: 3,
    matriculaIdMatricula: 1,
    gradeIdGrade: 2,
    dataAula: "2026-03-03",
    status: "Presente",
    criadoEm: "2026-03-03T12:00:00",
    atualizadoEm: "2026-03-03T12:00:00"
  },
  {
    idFrequencia: 4,
    matriculaIdMatricula: 1,
    gradeIdGrade: 2,
    dataAula: "2026-03-10",
    status: "Justificado",
    justificativa: "Atestado médico anexado na secretaria.",
    criadoEm: "2026-03-10T12:00:00",
    atualizadoEm: "2026-03-10T12:00:00"
  },
  {
    idFrequencia: 5,
    matriculaIdMatricula: 1,
    gradeIdGrade: 3,
    dataAula: "2026-03-04",
    status: "Presente",
    criadoEm: "2026-03-04T12:00:00",
    atualizadoEm: "2026-03-04T12:00:00"
  },
  {
    idFrequencia: 6,
    matriculaIdMatricula: 2,
    gradeIdGrade: 4,
    dataAula: "2026-03-02",
    status: "Presente",
    criadoEm: "2026-03-02T13:00:00",
    atualizadoEm: "2026-03-02T13:00:00"
  },
  {
    idFrequencia: 7,
    matriculaIdMatricula: 2,
    gradeIdGrade: 4,
    dataAula: "2026-03-09",
    status: "Ausente",
    criadoEm: "2026-03-09T13:00:00",
    atualizadoEm: "2026-03-09T13:00:00"
  },
  {
    idFrequencia: 8,
    matriculaIdMatricula: 2,
    gradeIdGrade: 5,
    dataAula: "2026-03-03",
    status: "Justificado",
    justificativa: "Consulta médica agendada previamente.",
    criadoEm: "2026-03-03T13:00:00",
    atualizadoEm: "2026-03-03T13:00:00"
  },
  {
    idFrequencia: 9,
    matriculaIdMatricula: 2,
    gradeIdGrade: 6,
    dataAula: "2026-03-04",
    status: "Presente",
    criadoEm: "2026-03-04T13:00:00",
    atualizadoEm: "2026-03-04T13:00:00"
  },
  {
    idFrequencia: 10,
    matriculaIdMatricula: 4,
    gradeIdGrade: 7,
    dataAula: "2026-03-05",
    status: "Presente",
    criadoEm: "2026-03-05T09:00:00",
    atualizadoEm: "2026-03-05T09:00:00"
  },
  {
    idFrequencia: 11,
    matriculaIdMatricula: 4,
    gradeIdGrade: 7,
    dataAula: "2026-03-12",
    status: "Ausente",
    criadoEm: "2026-03-12T09:00:00",
    atualizadoEm: "2026-03-12T09:00:00"
  },
  {
    idFrequencia: 12,
    matriculaIdMatricula: 4,
    gradeIdGrade: 8,
    dataAula: "2026-03-06",
    status: "Justificado",
    justificativa: "Viagem em família documentada com declaração.",
    criadoEm: "2026-03-06T09:00:00",
    atualizadoEm: "2026-03-06T09:00:00"
  },
  {
    idFrequencia: 13,
    matriculaIdMatricula: 3,
    gradeIdGrade: 9,
    dataAula: "2026-03-05",
    status: "Presente",
    criadoEm: "2026-03-05T10:00:00",
    atualizadoEm: "2026-03-05T10:00:00"
  },
  {
    idFrequencia: 14,
    matriculaIdMatricula: 3,
    gradeIdGrade: 10,
    dataAula: "2026-03-06",
    status: "Ausente",
    criadoEm: "2026-03-06T10:00:00",
    atualizadoEm: "2026-03-06T10:00:00"
  }
];

export const notasMock: Nota[] = [
  {
    idNota: 1,
    matriculaIdMatricula: 1,
    avaliacaoIdAvaliacao: 1,
    valorNota: 8.5,
    criadoEm: "2026-03-21T08:00:00",
    atualizadoEm: "2026-03-21T08:00:00"
  },
  {
    idNota: 2,
    matriculaIdMatricula: 1,
    avaliacaoIdAvaliacao: 2,
    valorNota: 7.0,
    criadoEm: "2026-05-16T08:00:00",
    atualizadoEm: "2026-05-16T08:00:00"
  },
  {
    idNota: 3,
    matriculaIdMatricula: 1,
    avaliacaoIdAvaliacao: 3,
    valorNota: 9.0,
    observacao: "Trabalho bem estruturado, com boas referências.",
    criadoEm: "2026-03-26T08:00:00",
    atualizadoEm: "2026-03-26T08:00:00"
  },
  {
    idNota: 4,
    matriculaIdMatricula: 1,
    avaliacaoIdAvaliacao: 4,
    valorNota: 6.5,
    criadoEm: "2026-04-03T08:00:00",
    atualizadoEm: "2026-04-03T08:00:00"
  },
  {
    idNota: 5,
    matriculaIdMatricula: 2,
    avaliacaoIdAvaliacao: 5,
    valorNota: 5.5,
    observacao: "Precisa reforçar funções do 2º grau.",
    criadoEm: "2026-05-21T09:00:00",
    atualizadoEm: "2026-05-21T09:00:00"
  },
  {
    idNota: 6,
    matriculaIdMatricula: 2,
    avaliacaoIdAvaliacao: 6,
    valorNota: 10.0,
    criadoEm: "2026-06-10T09:00:00",
    atualizadoEm: "2026-06-10T09:00:00"
  },
  {
    idNota: 7,
    matriculaIdMatricula: 2,
    avaliacaoIdAvaliacao: 7,
    valorNota: 8.0,
    criadoEm: "2026-03-19T09:00:00",
    atualizadoEm: "2026-03-19T09:00:00"
  },
  {
    idNota: 8,
    matriculaIdMatricula: 4,
    avaliacaoIdAvaliacao: 8,
    valorNota: 7.5,
    criadoEm: "2026-03-31T10:00:00",
    atualizadoEm: "2026-03-31T10:00:00"
  },
  {
    idNota: 9,
    matriculaIdMatricula: 4,
    avaliacaoIdAvaliacao: 9,
    valorNota: 6.0,
    observacao: "Revisar concordância verbal.",
    criadoEm: "2026-05-11T10:00:00",
    atualizadoEm: "2026-05-11T10:00:00"
  },
  {
    idNota: 10,
    matriculaIdMatricula: 4,
    avaliacaoIdAvaliacao: 10,
    valorNota: 9.5,
    criadoEm: "2026-05-23T10:00:00",
    atualizadoEm: "2026-05-23T10:00:00"
  },
  {
    idNota: 11,
    matriculaIdMatricula: 3,
    avaliacaoIdAvaliacao: 11,
    valorNota: 8.0,
    criadoEm: "2026-08-11T11:00:00",
    atualizadoEm: "2026-08-11T11:00:00"
  },
  {
    idNota: 12,
    matriculaIdMatricula: 3,
    avaliacaoIdAvaliacao: 12,
    valorNota: 4.5,
    observacao: "Não apresentou domínio da tabela periódica; recomendado reforço.",
    criadoEm: "2026-08-21T11:00:00",
    atualizadoEm: "2026-08-21T11:00:00"
  }
];

// Mapa de referência (mesmo usado acima): Matrícula 1 → Aluno 1 → Turma 1 ·
// Matrícula 2 → Aluno 3 → Turma 2 · Matrícula 3 → Aluno 4 → Turma 4 ·
// Matrícula 4 → Aluno 5 → Turma 3. Pares (matrícula, período) únicos, como
// exige `uq_boletim_matricula_periodo`.
export const boletinsMock: Boletim[] = [
  {
    idBoletim: 1,
    matriculaIdMatricula: 1,
    periodoIdPeriodo: 1,
    mediaFinal: 7.5,
    totalFaltas: 1,
    situacao: "Aprovado",
    criadoEm: "2026-04-11T09:00:00",
    atualizadoEm: "2026-04-11T09:00:00"
  },
  {
    idBoletim: 2,
    matriculaIdMatricula: 1,
    periodoIdPeriodo: 2,
    mediaFinal: 6.8,
    totalFaltas: 2,
    situacao: "Aprovado",
    criadoEm: "2026-06-20T09:00:00",
    atualizadoEm: "2026-06-20T09:00:00"
  },
  {
    idBoletim: 3,
    matriculaIdMatricula: 1,
    periodoIdPeriodo: 3,
    mediaFinal: null,
    totalFaltas: 1,
    situacao: "Em Andamento",
    observacoes: "Período letivo em curso; notas parciais ainda sendo lançadas.",
    criadoEm: "2026-07-28T09:00:00",
    atualizadoEm: "2026-07-28T09:00:00"
  },
  {
    idBoletim: 4,
    matriculaIdMatricula: 2,
    periodoIdPeriodo: 1,
    mediaFinal: 4.5,
    totalFaltas: 5,
    situacao: "Recuperacao",
    observacoes: "Aluno encaminhado para recuperação em Matemática.",
    criadoEm: "2026-04-11T10:00:00",
    atualizadoEm: "2026-04-11T10:00:00"
  },
  {
    idBoletim: 5,
    matriculaIdMatricula: 2,
    periodoIdPeriodo: 2,
    mediaFinal: null,
    totalFaltas: 3,
    situacao: "Em Andamento",
    criadoEm: "2026-06-20T10:00:00",
    atualizadoEm: "2026-06-20T10:00:00"
  },
  {
    idBoletim: 6,
    matriculaIdMatricula: 2,
    periodoIdPeriodo: 3,
    mediaFinal: 6.0,
    totalFaltas: 3,
    situacao: "Aprovado",
    criadoEm: "2026-09-26T10:00:00",
    atualizadoEm: "2026-09-26T10:00:00"
  },
  {
    idBoletim: 7,
    matriculaIdMatricula: 3,
    periodoIdPeriodo: 1,
    mediaFinal: 8.0,
    totalFaltas: 0,
    situacao: "Aprovado",
    criadoEm: "2026-04-11T11:00:00",
    atualizadoEm: "2026-04-11T11:00:00"
  },
  {
    idBoletim: 8,
    matriculaIdMatricula: 3,
    periodoIdPeriodo: 3,
    mediaFinal: 3.2,
    totalFaltas: 8,
    situacao: "Reprovado",
    observacoes: "Faltas acima do limite regimental; reprovado por frequência e nota.",
    criadoEm: "2026-09-26T11:00:00",
    atualizadoEm: "2026-09-26T11:00:00"
  },
  {
    idBoletim: 9,
    matriculaIdMatricula: 4,
    periodoIdPeriodo: 1,
    mediaFinal: 7.0,
    totalFaltas: 2,
    situacao: "Aprovado",
    criadoEm: "2026-04-11T12:00:00",
    atualizadoEm: "2026-04-11T12:00:00"
  },
  {
    idBoletim: 10,
    matriculaIdMatricula: 4,
    periodoIdPeriodo: 2,
    mediaFinal: 5.0,
    totalFaltas: 4,
    situacao: "Recuperacao",
    observacoes: "Necessário reforço em Português para a recuperação.",
    criadoEm: "2026-06-20T12:00:00",
    atualizadoEm: "2026-06-20T12:00:00"
  }
];