import { useCallback, useState } from "react";
import ListaAvaliacoes from "../components/avaliacoes/ListaAvaliacoes";
import FormularioAvaliacao from "../components/avaliacoes/FormularioAvaliacao";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast, { type TipoToast } from "../components/ui/Toast";
import { useLista } from "../hooks/useLista";
import {
  atualizarAvaliacao,
  criarAvaliacao,
  ehErroDeVinculo,
  excluirAvaliacao,
  mensagemDeErroAvaliacao,
} from "../services/avaliacaoService";
import type {
  Avaliacao,
  AvaliacaoEntrada,
  GradeCurricular,
  Materia,
  Turma,
  Periodo,
} from "../types";

type Tela = "lista" | "formulario";

interface Feedback {
  tipo: TipoToast;
  mensagem: string;
}

function PaginaAvaliacoes() {
  const {
    dados: avaliacoes,
    carregando: carregandoAvaliacoes,
    erro: erroAvaliacoes,
    recarregar: recarregarAvaliacoes,
  } = useLista<Avaliacao>("/avaliacoes");
  const { dados: grades, carregando: carregandoGrades, erro: erroGrades } =
    useLista<GradeCurricular>("/grades");
  const { dados: materias, carregando: carregandoMaterias, erro: erroMaterias } =
    useLista<Materia>("/materias");
  const { dados: turmas, carregando: carregandoTurmas, erro: erroTurmas } =
    useLista<Turma>("/turmas");
  const { dados: periodos, carregando: carregandoPeriodos, erro: erroPeriodos } =
    useLista<Periodo>("/periodos");

  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [avaliacaoEmEdicao, setAvaliacaoEmEdicao] = useState<Avaliacao | null>(null);
  const [avaliacaoParaExcluir, setAvaliacaoParaExcluir] = useState<Avaliacao | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const carregando =
    carregandoAvaliacoes ||
    carregandoGrades ||
    carregandoMaterias ||
    carregandoTurmas ||
    carregandoPeriodos;

  const erroGeral =
    erroAvaliacoes ?? erroGrades ?? erroMaterias ?? erroTurmas ?? erroPeriodos;

  function abrirNovaAvaliacao() {
    setAvaliacaoEmEdicao(null);
    setTelaAtual("formulario");
  }

  function abrirEdicaoAvaliacao(idAvaliacao: number) {
    const avaliacao = avaliacoes.find((item) => item.idAvaliacao === idAvaliacao) ?? null;
    setAvaliacaoEmEdicao(avaliacao);
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setAvaliacaoEmEdicao(null);
    setTelaAtual("lista");
  }

  async function handleSalvarFormulario(dados: AvaliacaoEntrada): Promise<void> {
    try {
      if (avaliacaoEmEdicao) {
        await atualizarAvaliacao(avaliacaoEmEdicao.idAvaliacao, dados);
      } else {
        await criarAvaliacao(dados);
      }
      setFeedback({
        tipo: "sucesso",
        mensagem: avaliacaoEmEdicao
          ? "Avaliação atualizada com sucesso!"
          : "Avaliação cadastrada com sucesso!",
      });
      cancelarFormulario();
      await recarregarAvaliacoes();
    } catch (e: unknown) {
      throw new Error(mensagemDeErroAvaliacao(e, "Não foi possível salvar a avaliação."));
    }
  }

  function pedirConfirmacaoExclusao(idAvaliacao: number) {
    const avaliacao = avaliacoes.find((item) => item.idAvaliacao === idAvaliacao) ?? null;
    setAvaliacaoParaExcluir(avaliacao);
  }

  const cancelarExclusao = useCallback(() => {
    if (!excluindo) setAvaliacaoParaExcluir(null);
  }, [excluindo]);

  async function confirmarExclusao() {
    if (!avaliacaoParaExcluir || excluindo) return;
    const alvo = avaliacaoParaExcluir;

    setExcluindo(true);
    try {
      await excluirAvaliacao(alvo.idAvaliacao);
      setFeedback({ tipo: "sucesso", mensagem: "Avaliação excluída com sucesso!" });
      await recarregarAvaliacoes();
    } catch (e: unknown) {
      setFeedback({
        tipo: "erro",
        mensagem: ehErroDeVinculo(e)
          ? "Não é possível excluir esta avaliação pois já existem notas vinculadas a ela."
          : mensagemDeErroAvaliacao(e, "Não foi possível excluir a avaliação."),
      });
    } finally {
      setExcluindo(false);
      setAvaliacaoParaExcluir(null);
    }
  }

  const fecharFeedback = useCallback(() => setFeedback(null), []);

  if (carregando && avaliacoes.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
        <p>Carregando avaliações...</p>
      </div>
    );
  }

  return (
    <>
      {erroGeral && (
        <div
          style={{
            margin: "0 0 16px",
            padding: "10px 12px",
            background: "#fbeae9",
            color: "#a4302b",
            borderRadius: "4px",
          }}
        >
          {erroGeral}
        </div>
      )}

      {telaAtual === "lista" ? (
        <ListaAvaliacoes
          avaliacoes={avaliacoes}
          grades={grades}
          materias={materias}
          turmas={turmas}
          periodos={periodos}
          aoNovaAvaliacao={abrirNovaAvaliacao}
          aoEditarAvaliacao={abrirEdicaoAvaliacao}
          aoExcluirAvaliacao={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioAvaliacao
          key={avaliacaoEmEdicao?.idAvaliacao ?? "nova"}
          avaliacaoEditando={avaliacaoEmEdicao}
          grades={grades}
          materias={materias}
          turmas={turmas}
          periodos={periodos}
          salvar={handleSalvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {avaliacaoParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir avaliação"
          mensagem={`Tem certeza que deseja excluir a avaliação "${avaliacaoParaExcluir.nomeAvaliacao}"? Essa ação não pode ser desfeita.`}
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

export default PaginaAvaliacoes;