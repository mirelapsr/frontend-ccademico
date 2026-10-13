import { useCallback, useEffect, useState } from "react";
import ListaResponsaveis from "../components/responsaveis/ListaResponsaveis";
import FormularioResponsavel from "../components/responsaveis/FormularioResponsavel";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import {
  atualizarResponsavel,
  criarResponsavel,
  ehErroDeVinculo,
  excluirResponsavel,
  listarResponsaveis,
  mensagemDeErroResponsavel,
} from "../services/responsavelService";
import type { Responsavel, ResponsavelEntrada } from "../types";

function PaginaResponsaveis() {
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [responsavelEmEdicao, setResponsavelEmEdicao] = useState<Responsavel | null>(null);

  const [responsavelParaExcluir, setResponsavelParaExcluir] = useState<Responsavel | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setResponsaveis(await listarResponsaveis());
    } catch (e) {
      setErro(mensagemDeErroResponsavel(e, "Não foi possível carregar os responsáveis."));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  function abrirNovoResponsavel() {
    setResponsavelEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicaoResponsavel(idResponsavel: number) {
    const responsavel = responsaveis.find((item) => item.idResponsavel === idResponsavel) ?? null;
    if (!responsavel) return;
    setResponsavelEmEdicao(responsavel);
    setModalAberto(true);
  }

  const cancelarFormulario = useCallback(() => {
    setResponsavelEmEdicao(null);
    setModalAberto(false);
  }, []);

  async function salvarFormulario(dados: ResponsavelEntrada): Promise<void> {
    try {
      if (responsavelEmEdicao) {
        const atualizado = await atualizarResponsavel(responsavelEmEdicao.idResponsavel, dados);
        setResponsaveis((atual) =>
          atual.map((r) => (r.idResponsavel === atualizado.idResponsavel ? atualizado : r))
        );
        setMensagemSucesso(`Responsável "${atualizado.nomeResp}" atualizado com sucesso!`);
      } else {
        const novo = await criarResponsavel(dados);
        setResponsaveis((atual) => [...atual, novo]);
        setMensagemSucesso(`Responsável "${novo.nomeResp}" cadastrado com sucesso!`);
      }
      cancelarFormulario();
    } catch (e) {
      throw new Error(mensagemDeErroResponsavel(e, "Não foi possível salvar o responsável."));
    }
  }

  function pedirConfirmacaoExclusao(idResponsavel: number) {
    setResponsavelParaExcluir(
      responsaveis.find((item) => item.idResponsavel === idResponsavel) ?? null
    );
  }

  const cancelarExclusao = useCallback(() => {
    if (!excluindo) setResponsavelParaExcluir(null);
  }, [excluindo]);

  async function confirmarExclusao() {
    if (!responsavelParaExcluir || excluindo) return;
    const alvo = responsavelParaExcluir;

    setExcluindo(true);
    setErro(null);
    try {
      await excluirResponsavel(alvo.idResponsavel);
      setResponsaveis((atual) => atual.filter((r) => r.idResponsavel !== alvo.idResponsavel));
      setMensagemSucesso(`Responsável "${alvo.nomeResp}" excluído com sucesso!`);
    } catch (e) {
      setErro(
        ehErroDeVinculo(e)
          ? `Não é possível excluir "${alvo.nomeResp}": o responsável está vinculado a alunos ou registros financeiros ativos. Remova esses vínculos e tente novamente.`
          : mensagemDeErroResponsavel(e, "Não foi possível excluir o responsável.")
      );
    } finally {
      setExcluindo(false);
      setResponsavelParaExcluir(null);
    }
  }

  const fecharToast = useCallback(() => setMensagemSucesso(null), []);

  return (
    <>
      {!modalAberto ? (
        <ListaResponsaveis
          responsaveis={responsaveis}
          carregando={carregando}
          erro={erro}
          aoDispensarErro={() => setErro(null)}
          aoRecarregar={() => void carregar()}
          aoNovoResponsavel={abrirNovoResponsavel}
          aoEditarResponsavel={abrirEdicaoResponsavel}
          aoExcluirResponsavel={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioResponsavel
          key={responsavelEmEdicao?.idResponsavel ?? "novo"}
          responsavelEditando={responsavelEmEdicao}
          salvar={salvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {responsavelParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir responsável"
          mensagem={
            excluindo
              ? "Excluindo..."
              : `Tem certeza de que deseja excluir "${responsavelParaExcluir.nomeResp}"? Esta ação não pode ser desfeita.`
          }
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

export default PaginaResponsaveis;