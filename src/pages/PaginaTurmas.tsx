import { useCallback, useEffect, useState } from "react";
import ListaTurmas from "../components/turmas/ListaTurmas";
import FormularioTurma from "../components/turmas/FormularioTurma";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { listarEscolas } from "../services/escolaService";
import {
  atualizarTurma,
  criarTurma,
  ehErroDeVinculo,
  excluirTurma,
  listarTurmas,
  mensagemDeErroTurma,
} from "../services/turmaService";
import type { Escola, Turma, TurmaEntrada } from "../types";

function PaginaTurmas() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [turmaEmEdicao, setTurmaEmEdicao] = useState<Turma | null>(null);

  const [turmaParaExcluir, setTurmaParaExcluir] = useState<Turma | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [listaTurmas, listaEscolas] = await Promise.all([listarTurmas(), listarEscolas()]);
      setTurmas(listaTurmas);
      setEscolas(listaEscolas);
    } catch (e) {
      setErro(mensagemDeErroTurma(e, "Não foi possível carregar as turmas."));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  function abrirNovaTurma() {
    setTurmaEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicaoTurma(idTurma: number) {
    const turma = turmas.find((item) => item.idTurma === idTurma) ?? null;
    if (!turma) return;
    setTurmaEmEdicao(turma);
    setModalAberto(true);
  }

  function cancelarFormulario() {
    setTurmaEmEdicao(null);
    setModalAberto(false);
  }

  async function salvarFormulario(dados: TurmaEntrada): Promise<void> {
    try {
      if (turmaEmEdicao) {
        const atualizada = await atualizarTurma(turmaEmEdicao.idTurma, dados);
        setTurmas((atual) => atual.map((t) => (t.idTurma === atualizada.idTurma ? atualizada : t)));
        setMensagemSucesso("Turma atualizada com sucesso!");
      } else {
        const nova = await criarTurma(dados);
        setTurmas((atual) => [...atual, nova]);
        setMensagemSucesso("Turma criada com sucesso!");
      }
    } catch (e) {
      throw new Error(mensagemDeErroTurma(e, "Não foi possível salvar a turma."));
    }
    cancelarFormulario();
  }

  function pedirConfirmacaoExclusao(idTurma: number) {
    setTurmaParaExcluir(turmas.find((item) => item.idTurma === idTurma) ?? null);
  }

  const cancelarExclusao = useCallback(() => {
    if (!excluindo) setTurmaParaExcluir(null);
  }, [excluindo]);

  async function confirmarExclusao() {
    if (!turmaParaExcluir || excluindo) return;
    const alvo = turmaParaExcluir;

    setExcluindo(true);
    setErro(null);
    try {
      await excluirTurma(alvo.idTurma);
      setTurmas((atual) => atual.filter((t) => t.idTurma !== alvo.idTurma));
      setMensagemSucesso("Deletado com sucesso!");
    } catch (e) {
      setErro(
        ehErroDeVinculo(e)
          ? `Não é possível excluir "${alvo.nomeTurma}": a turma possui matrículas ou grades ` +
              `curriculares vinculadas. Remova esses vínculos e tente novamente.`
          : mensagemDeErroTurma(e, "Não foi possível excluir a turma.")
      );
    } finally {
      setExcluindo(false);
      setTurmaParaExcluir(null);
    }
  }

  const fecharToast = useCallback(() => setMensagemSucesso(null), []);

  return (
    <>
      {!modalAberto ? (
        <ListaTurmas
          turmas={turmas}
          escolas={escolas}
          carregando={carregando}
          erro={erro}
          aoDispensarErro={() => setErro(null)}
          aoRecarregar={() => void carregar()}
          aoNovaTurma={abrirNovaTurma}
          aoEditarTurma={abrirEdicaoTurma}
          aoExcluirTurma={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioTurma
          key={turmaEmEdicao?.idTurma ?? "nova"}
          turmaEditando={turmaEmEdicao}
          escolas={escolas}
          salvar={salvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {turmaParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir turma"
          mensagem={`Tem certeza que deseja excluir "${turmaParaExcluir.nomeTurma}"? Essa ação não pode ser desfeita.`}
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

export default PaginaTurmas;
