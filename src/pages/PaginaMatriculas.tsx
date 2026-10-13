import { useCallback, useState } from "react";
import ListaMatriculas from "../components/matriculas/ListaMatriculas";
import FormularioMatricula from "../components/matriculas/FormularioMatricula";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast, { type TipoToast } from "../components/ui/Toast";
import { useLista } from "../hooks/useLista";
import {
  atualizarMatricula,
  criarMatricula,
  ehErroDeVinculo,
  excluirMatricula,
  mensagemDeErroMatricula,
} from "../services/matriculaService";
import type { Aluno, Matricula, MatriculaEntrada, Turma } from "../types";

type Tela = "lista" | "formulario";

interface Feedback {
  tipo: TipoToast;
  mensagem: string;
}

function PaginaMatriculas() {
  const {
    dados: matriculas,
    carregando: carregandoMatriculas,
    erro: erroMatriculas,
    recarregar: recarregarMatriculas,
  } = useLista<Matricula>("/matriculas");
  const { dados: alunos, carregando: carregandoAlunos, erro: erroAlunos } = useLista<Aluno>("/alunos");
  const { dados: turmas, carregando: carregandoTurmas, erro: erroTurmas } = useLista<Turma>("/turmas");

  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [matriculaEmEdicao, setMatriculaEmEdicao] = useState<Matricula | null>(null);
  const [matriculaParaExcluir, setMatriculaParaExcluir] = useState<Matricula | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const carregando = carregandoMatriculas || carregandoAlunos || carregandoTurmas;
  const erro = erroMatriculas ?? erroAlunos ?? erroTurmas;

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

  async function handleSalvarFormulario(dados: MatriculaEntrada): Promise<void> {
    try {
      if (matriculaEmEdicao) {
        await atualizarMatricula(matriculaEmEdicao.idMatricula, dados);
      } else {
        await criarMatricula(dados);
      }
      setFeedback({
        tipo: "sucesso",
        mensagem: matriculaEmEdicao
          ? "Matrícula atualizada com sucesso!"
          : "Matrícula cadastrada com sucesso!",
      });
      cancelarFormulario();
      await recarregarMatriculas();
    } catch (e: unknown) {
      throw new Error(mensagemDeErroMatricula(e, "Não foi possível salvar a matrícula."));
    }
  }

  function existeOutraMatriculaAtiva(alunoId: number): boolean {
    return matriculas.some(
      (matricula) =>
        matricula.alunoId === alunoId &&
        matricula.situacao === "Ativa" &&
        matricula.idMatricula !== matriculaEmEdicao?.idMatricula
    );
  }

  function pedirConfirmacaoExclusao(idMatricula: number) {
    const matricula = matriculas.find((item) => item.idMatricula === idMatricula) ?? null;
    setMatriculaParaExcluir(matricula);
  }

  const cancelarExclusao = useCallback(() => {
    if (!excluindo) setMatriculaParaExcluir(null);
  }, [excluindo]);

  async function confirmarExclusao() {
    if (!matriculaParaExcluir || excluindo) return;
    const alvo = matriculaParaExcluir;

    setExcluindo(true);
    try {
      await excluirMatricula(alvo.idMatricula);
      setFeedback({ tipo: "sucesso", mensagem: "Matrícula excluída com sucesso!" });
      await recarregarMatriculas();
    } catch (e: unknown) {
      setFeedback({
        tipo: "erro",
        mensagem: ehErroDeVinculo(e)
          ? "Não é possível excluir esta matrícula pois ela possui notas ou frequências vinculadas."
          : mensagemDeErroMatricula(e, "Não foi possível excluir a matrícula."),
      });
    } finally {
      setExcluindo(false);
      setMatriculaParaExcluir(null);
    }
  }

  const fecharFeedback = useCallback(() => setFeedback(null), []);

  const alunoDaMatriculaParaExcluir = matriculaParaExcluir
    ? alunos.find((aluno) => aluno.idAluno === matriculaParaExcluir.alunoId)
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
          key={matriculaEmEdicao?.idMatricula ?? "nova"}
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
          textoConfirmar={excluindo ? "Excluindo..." : "Excluir"}
          aoConfirmar={() => void confirmarExclusao()}
          aoCancelar={cancelarExclusao}
        />
      )}

      {feedback && (
        <Toast
          mensagem={feedback.mensagem}
          tipo={feedback.tipo}
          duracaoMs={feedback.tipo === "erro" ? 6000 : undefined}
          aoFechar={fecharFeedback}
        />
      )}
    </>
  );
}

export default PaginaMatriculas;