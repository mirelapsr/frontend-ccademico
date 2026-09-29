
// Mapeamento específico entre campos do banco e do frontend
const mapaBackendParaFrontend: Record<string, string> = {
  id_aluno: 'idAluno',
  nome_aluno: 'nome',
  cpf_aluno: 'cpf',
  telefone_aluno: 'telefone',
  email_aluno: 'email',
  cep_aluno: 'cep',
  endereco_aluno: 'endereco',
  numero_matricula: 'numeroMatricula',
  data_nascimento: 'dataNascimento',
  situacao: 'situacao',
};

const mapaFrontendParaBackend: Record<string, string> = {
  idAluno: 'id_aluno',
  nome: 'nome_aluno',
  cpf: 'cpf_aluno',
  telefone: 'telefone_aluno',
  email: 'email_aluno',
  cep: 'cep_aluno',
  endereco: 'endereco_aluno',
  numeroMatricula: 'numero_matricula',
  dataNascimento: 'data_nascimento',
  situacao: 'situacao',
};

export function normalizarAlunoParaFront(dadoBackend: any): any {
  if (!dadoBackend) return dadoBackend;
  const resultado: any = {};
  for (const chave in dadoBackend) {
    const chaveFront = mapaBackendParaFrontend[chave] || chave;
    resultado[chaveFront] = dadoBackend[chave];
  }
  return resultado;
}

export function normalizarAlunoParaBack(dadoFront: any): any {
  if (!dadoFront) return dadoFront;
  const resultado: any = {};
  for (const chave in dadoFront) {
    const chaveBack = mapaFrontendParaBackend[chave] || chave;
    resultado[chaveBack] = dadoFront[chave];
  }
  return resultado;
}