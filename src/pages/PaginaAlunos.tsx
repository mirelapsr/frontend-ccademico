import { useCallback, useMemo, useState } from "react";
import ListaAlunos from "../components/alunos/ListaAlunos";
import FormularioAluno from "../components/alunos/FormularioAluno";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast, { type TipoToast } from "../components/ui/Toast";
import { useLista } from "../hooks/useLista";
import {
  atualizarAluno,
  criarAluno,
  ehErroDeVinculo,
  excluirAluno,
  mensagemDeErroAluno,
} from "../services/alunoService";
import type { Aluno, AlunoEntrada, Matricula, Turma } from "../types";

type Tela = "lista" | "formulario";

interface Feedback {
  tipo: TipoToast;
  mensagem: string;
}

function PaginaAlunos() {
  const { dados: alunos, carregando, erro, recarregar: recarregarAlunos } = useLista<Aluno>("/alunos");
  const { dados: matriculas, erro: erroMatriculas, recarregar: recarregarMatriculas } =
    useLista<Matricula>("/matriculas");
  const { dados: turmas, erro: erroTurmas, recarregar: recarregarTurmas } = useLista<Turma>("/turmas");

  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [alunoEmEdicao, setAlunoEmEdicao] = useState<Aluno | null>(null);
  const [alunoParaExcluir, setAlunoParaExcluir] = useState<Aluno | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const recarregarTudo = useCallback(async () => {
    await Promise.all([recarregarAlunos(), recarregarMatriculas(), recarregarTurmas()]);
  }, [recarregarAlunos, recarregarMatriculas, recarregarTurmas]);

  // Join no frontend: para cada aluno, acha a matrícula ativa e, a partir
  // dela, a turma correspondente. Resultado indexado por idAluno.
  const nomeTurmaPorAluno = useMemo(() => {
    const mapa: Record<number, string | undefined> = {};
    for (const aluno of alunos) {
      const matriculaAtiva = matriculas.find(
        (matricula) => matricula.alunoId === aluno.idAluno && matricula.situacao === "Ativa"
      );
      const turma = matriculaAtiva
        ? turmas.find((item) => item.idTurma === matriculaAtiva.turmaId)
        : undefined;
      mapa[aluno.idAluno] = turma ? `${turma.nomeTurma} (${turma.turno})` : undefined;
    }
    return mapa;
  }, [alunos, matriculas, turmas]);

  function abrirNovoAluno() {
    setAlunoEmEdicao(null);
    setTelaAtual("formulario");
  }

  function abrirEdicaoAluno(idAluno: number) {
    const aluno = alunos.find((item) => item.idAluno === idAluno) ?? null;
    setAlunoEmEdicao(aluno);
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setAlunoEmEdicao(null);
    setTelaAtual("lista");
  }

  async function handleSalvarFormulario(dados: AlunoEntrada): Promise<void> {
    try {
      if (alunoEmEdicao) {
        await atualizarAluno(alunoEmEdicao.idAluno, dados);
      } else {
        await criarAluno(dados);
      }
    } catch (e: unknown) {
      throw new Error(mensagemDeErroAluno(e, "Não foi possível salvar o aluno."));
    }
    setFeedback({
      tipo: "sucesso",
      mensagem: alunoEmEdicao ? "Aluno atualizado com sucesso!" : "Aluno criado com sucesso!",
    });
    cancelarFormulario();
    await recarregarAlunos();
  }

  function pedirConfirmacaoExclusao(idAluno: number) {
    setAlunoParaExcluir(alunos.find((item) => item.idAluno === idAluno) ?? null);
  }

  const cancelarExclusao = useCallback(() => {
    if (!excluindo) setAlunoParaExcluir(null);
  }, [excluindo]);

  async function confirmarExclusao() {
    if (!alunoParaExcluir || excluindo) return;
    const alvo = alunoParaExcluir;

    setExcluindo(true);
    try {
      await excluirAluno(alvo.idAluno);
      setFeedback({ tipo: "sucesso", mensagem: "Deletado com sucesso!" });
      await recarregarAlunos();
    } catch (e: unknown) {
      setFeedback({
        tipo: "erro",
        mensagem: ehErroDeVinculo(e)
          ? `Não é possível excluir "${alvo.nomeAluno}": o aluno possui matrículas, notas, frequências, boletins ou boletos vinculados.`
          : mensagemDeErroAluno(e, "Não foi possível excluir o aluno."),
      });
    } finally {
      setExcluindo(false);
      setAlunoParaExcluir(null);
    }
  }

  const fecharFeedback = useCallback(() => setFeedback(null), []);

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaAlunos
          alunos={alunos}
          nomeTurmaPorAluno={nomeTurmaPorAluno}
          carregando={carregando}
          erro={erro ?? erroMatriculas ?? erroTurmas}
          aoRecarregar={() => void recarregarTudo()}
          aoNovoAluno={abrirNovoAluno}
          aoEditarAluno={abrirEdicaoAluno}
          aoExcluirAluno={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioAluno
          key={alunoEmEdicao?.idAluno ?? "novo"}
          alunoEditando={alunoEmEdicao}
          salvar={handleSalvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {alunoParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir aluno"
          mensagem={`Tem certeza que deseja excluir "${alunoParaExcluir.nomeAluno}"? Essa ação não pode ser desfeita.`}
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

export default PaginaAlunos;
