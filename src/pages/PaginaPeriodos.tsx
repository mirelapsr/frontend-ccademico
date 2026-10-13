import { useCallback, useEffect, useState } from "react";
import ListaPeriodos from "../components/periodos/ListaPeriodos";
import FormularioPeriodo from "../components/periodos/FormularioPeriodo";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import {
  atualizarPeriodo,
  criarPeriodo,
  ehErroDeVinculo,
  excluirPeriodo,
  listarPeriodos,
  mensagemDeErroPeriodo,
} from "../services/periodoService";
import type { Periodo, PeriodoEntrada } from "../types";

function PaginaPeriodos() {
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [periodoEmEdicao, setPeriodoEmEdicao] = useState<Periodo | null>(null);

  const [periodoParaExcluir, setPeriodoParaExcluir] = useState<Periodo | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // --- Carregamento ----------------------------------------------------------

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setPeriodos(await listarPeriodos());
    } catch (e) {
      setErro(mensagemDeErroPeriodo(e, "Não foi possível carregar os períodos."));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  // --- Formulário (criar / editar) ---------------------------------------------

  function abrirNovoPeriodo() {
    setPeriodoEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicaoPeriodo(idPeriodo: number) {
    const periodo = periodos.find((item) => item.idPeriodo === idPeriodo) ?? null;
    if (!periodo) return;
    setPeriodoEmEdicao(periodo);
    setModalAberto(true);
  }

  function cancelarFormulario() {
    setPeriodoEmEdicao(null);
    setModalAberto(false);
  }

  async function salvarFormulario(dados: PeriodoEntrada): Promise<void> {
    try {
      if (periodoEmEdicao) {
        const atualizado = await atualizarPeriodo(periodoEmEdicao.idPeriodo, dados);
        setPeriodos((atual) =>
          atual.map((p) => (p.idPeriodo === atualizado.idPeriodo ? atualizado : p))
        );
        setMensagemSucesso("Período atualizado com sucesso!");
      } else {
        const novo = await criarPeriodo(dados);
        setPeriodos((atual) => [...atual, novo]);
        setMensagemSucesso("Período criado com sucesso!");
      }
    } catch (e) {
      throw new Error(mensagemDeErroPeriodo(e, "Não foi possível salvar o período."));
    }
    cancelarFormulario();
  }

  // --- Exclusão ------------------------------------------------------------------

  function pedirConfirmacaoExclusao(idPeriodo: number) {
    setPeriodoParaExcluir(periodos.find((item) => item.idPeriodo === idPeriodo) ?? null);
  }

  const cancelarExclusao = useCallback(() => {
    if (!excluindo) setPeriodoParaExcluir(null);
  }, [excluindo]);

  async function confirmarExclusao() {
    if (!periodoParaExcluir || excluindo) return;
    const alvo = periodoParaExcluir;

    setExcluindo(true);
    setErro(null);
    try {
      await excluirPeriodo(alvo.idPeriodo);
      setPeriodos((atual) => atual.filter((p) => p.idPeriodo !== alvo.idPeriodo));
      setMensagemSucesso("Deletado com sucesso!");
    } catch (e) {
      setErro(
        ehErroDeVinculo(e)
          ? `Não é possível excluir "${alvo.nomePeriodo}": existem avaliações ou boletins ` +
              `vinculados a este período. Remova esses registros e tente novamente.`
          : mensagemDeErroPeriodo(e, "Não foi possível excluir o período.")
      );
    } finally {
      setExcluindo(false);
      setPeriodoParaExcluir(null);
    }
  }

  const fecharToast = useCallback(() => setMensagemSucesso(null), []);

  return (
    <>
      {!modalAberto ? (
        <ListaPeriodos
          periodos={periodos}
          carregando={carregando}
          erro={erro}
          aoDispensarErro={() => setErro(null)}
          aoRecarregar={() => void carregar()}
          aoNovoPeriodo={abrirNovoPeriodo}
          aoEditarPeriodo={abrirEdicaoPeriodo}
          aoExcluirPeriodo={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioPeriodo
          // `key` reinicia o estado interno ao alternar entre períodos.
          key={periodoEmEdicao?.idPeriodo ?? "novo"}
          periodoEditando={periodoEmEdicao}
          salvar={salvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {periodoParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir período"
          mensagem={`Tem certeza que deseja excluir "${periodoParaExcluir.nomePeriodo}"? Essa ação não pode ser desfeita.`}
          textoCancelar="Cancelar"
          textoConfirmar={excluindo ? "Excluindo..." : "Excluir"}
          aoConfirmar={() => void confirmarExclusao()}
          aoCancelar={cancelarExclusao}
        />
      )}

      {mensagemSucesso && (
        <Toast mensagem={mensagemSucesso} tipo="sucesso" aoFechar={fecharToast} />
      )}
    </>
  );
}

export default PaginaPeriodos;
