import { useState } from "react";
import ListaMatriculas from "../components/matriculas/ListaMatriculas";
import FormularioMatricula from "../components/matriculas/FormularioMatricula";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { alunosMock, matriculasMock, turmasMock } from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { Aluno, Matricula, MatriculaEntrada, Turma } from "../types";

type Tela = "lista" | "formulario";

function proximoId(matriculas: Matricula[]): number {
  return matriculas.reduce((maior, matricula) => Math.max(maior, matricula.idMatricula), 0) + 1;
}

function agora(): string {
  return new Date().toISOString();
}

function PaginaMatriculas() {
  const [matriculas, setMatriculas] = useColecaoPersistida<Matricula>(
    CHAVES_LOCALSTORAGE.matriculas,
    matriculasMock
  );
  const [alunos] = useColecaoPersistida<Aluno>(CHAVES_LOCALSTORAGE.alunos, alunosMock);
  const [turmas] = useColecaoPersistida<Turma>(CHAVES_LOCALSTORAGE.turmas, turmasMock);
  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [matriculaEmEdicao, setMatriculaEmEdicao] = useState<Matricula | null>(null);

  const [matriculaParaExcluir, setMatriculaParaExcluir] = useState<Matricula | null>(null);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function abrirNovaMatricula() {
    setMatriculaEmEdicao(null);
    setTelaAtual("formulario");
  }

  function abrirEdicaoMatricula(idMatricula: number) {
    const matricula = matriculas.find((item) => item.idMatricula === idMatricula) ?? null;
    setMatriculaEmEdicao(matricula);
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setMatriculaEmEdicao(null);
    setTelaAtual("lista");
  }

  function adicionarMatricula(dados: MatriculaEntrada) {
    const novaMatricula: Matricula = {
      ...dados,
      idMatricula: proximoId(matriculas),
      criadoEm: agora(),
      atualizadoEm: agora(),
    };
    setMatriculas((atual) => [...atual, novaMatricula]);
    setTelaAtual("lista");
    setMensagemSucesso("Matrícula criada com sucesso!");
  }

  function atualizarMatricula(idMatricula: number, dados: MatriculaEntrada) {
    setMatriculas((atual) =>
      atual.map((matricula) =>
        matricula.idMatricula === idMatricula
          ? { ...matricula, ...dados, atualizadoEm: agora() }
          : matricula
      )
    );
    setMatriculaEmEdicao(null);
    setTelaAtual("lista");
    setMensagemSucesso("Matrícula atualizada com sucesso!");
  }

  function handleSalvarFormulario(dados: MatriculaEntrada) {
    if (matriculaEmEdicao) {
      atualizarMatricula(matriculaEmEdicao.idMatricula, dados);
    } else {
      adicionarMatricula(dados);
    }
  }

  /**
   * Mesma regra do trigger `func_matricula_unica_ativa_ins/upd` do banco:
   * um aluno não pode ter duas matrículas com `situacao = 'Ativa'` ao mesmo
   * tempo. Roda no client antes do `salvar()` para dar feedback imediato,
   * em vez de deixar o usuário só descobrir isso quando a API rejeitar.
   */
  function existeOutraMatriculaAtiva(alunoIdAluno: number): boolean {
    return matriculas.some(
      (matricula) =>
        matricula.alunoIdAluno === alunoIdAluno &&
        matricula.situacao === "Ativa" &&
        matricula.idMatricula !== matriculaEmEdicao?.idMatricula
    );
  }

  function pedirConfirmacaoExclusao(idMatricula: number) {
    const matricula = matriculas.find((item) => item.idMatricula === idMatricula) ?? null;
    setMatriculaParaExcluir(matricula);
  }

  function confirmarExclusao() {
    if (!matriculaParaExcluir) return;
    setMatriculas((atual) =>
      atual.filter((matricula) => matricula.idMatricula !== matriculaParaExcluir.idMatricula)
    );
    setMatriculaParaExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  function cancelarExclusao() {
    setMatriculaParaExcluir(null);
  }

  const alunoDaMatriculaParaExcluir = matriculaParaExcluir
    ? alunos.find((aluno) => aluno.idAluno === matriculaParaExcluir.alunoIdAluno)
    : null;

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaMatriculas
          matriculas={matriculas}
          alunos={alunos}
          turmas={turmas}
          aoNovaMatricula={abrirNovaMatricula}
          aoEditarMatricula={abrirEdicaoMatricula}
          aoExcluirMatricula={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioMatricula
          matriculaEditando={matriculaEmEdicao}
          alunos={alunos}
          turmas={turmas}
          existeOutraMatriculaAtiva={existeOutraMatriculaAtiva}
          salvar={handleSalvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {matriculaParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir matrícula"
          mensagem={`Tem certeza que deseja excluir a matrícula${
            alunoDaMatriculaParaExcluir ? ` de "${alunoDaMatriculaParaExcluir.nomeAluno}"` : ""
          }? Essa ação não pode ser desfeita.`}
          textoCancelar="Cancelar"
          textoConfirmar="Excluir"
          aoConfirmar={confirmarExclusao}
          aoCancelar={cancelarExclusao}
        />
      )}

      {mensagemSucesso && (
        <Toast
          mensagem={mensagemSucesso}
          tipo="sucesso"
          aoFechar={() => setMensagemSucesso(null)}
        />
      )}
    </>
  );
}

export default PaginaMatriculas;
