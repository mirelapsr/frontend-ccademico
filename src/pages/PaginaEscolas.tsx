import { useCallback, useEffect, useState } from "react";
import ListaEscolas from "../components/escolas/ListaEscolas";
import FormularioEscola from "../components/escolas/FormularioEscola";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import {
  atualizarEscola,
  criarEscola,
  ehErroDeVinculo,
  excluirEscola,
  listarEscolas,
  mensagemDeErroEscola,
} from "../services/escolaService";
import type { Escola, EscolaEntrada } from "../types";

function PaginaEscolas() {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [escolaEmEdicao, setEscolaEmEdicao] = useState<Escola | null>(null);

  const [escolaParaExcluir, setEscolaParaExcluir] = useState<Escola | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // --- Carregamento ----------------------------------------------------------

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setEscolas(await listarEscolas());
    } catch (e) {
      setErro(mensagemDeErroEscola(e, "Não foi possível carregar as escolas."));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  // --- Formulário (criar / editar) ---------------------------------------------

  function abrirNovaEscola() {
    setEscolaEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicaoEscola(idEscola: number) {
    const escola = escolas.find((item) => item.idEscola === idEscola) ?? null;
    if (!escola) return;
    setEscolaEmEdicao(escola);
    setModalAberto(true);
  }

  function cancelarFormulario() {
    setEscolaEmEdicao(null);
    setModalAberto(false);
  }

  /** Lança em caso de falha: o formulário exibe o erro e permanece aberto. */
  async function salvarFormulario(dados: EscolaEntrada): Promise<void> {
    try {
      if (escolaEmEdicao) {
        const atualizada = await atualizarEscola(escolaEmEdicao.idEscola, dados);
        setEscolas((atual) =>
          atual.map((e) => (e.idEscola === atualizada.idEscola ? atualizada : e))
        );
        setMensagemSucesso("Escola atualizada com sucesso!");
      } else {
        const nova = await criarEscola(dados);
        setEscolas((atual) => [...atual, nova]);
        setMensagemSucesso("Escola criada com sucesso!");
      }
    } catch (e) {
      throw new Error(mensagemDeErroEscola(e, "Não foi possível salvar a escola."));
    }
    cancelarFormulario();
  }

  // --- Exclusão ------------------------------------------------------------------

  function pedirConfirmacaoExclusao(idEscola: number) {
    setEscolaParaExcluir(escolas.find((item) => item.idEscola === idEscola) ?? null);
  }

  const cancelarExclusao = useCallback(() => {
    if (!excluindo) setEscolaParaExcluir(null);
  }, [excluindo]);

  async function confirmarExclusao() {
    if (!escolaParaExcluir || excluindo) return;
    const alvo = escolaParaExcluir;

    setExcluindo(true);
    setErro(null);
    try {
      await excluirEscola(alvo.idEscola);
      // Atualiza a lista localmente: sem novo GET e sem recarregar a página.
      setEscolas((atual) => atual.filter((e) => e.idEscola !== alvo.idEscola));
      setMensagemSucesso("Deletado com sucesso!");
    } catch (e) {
      setErro(
        ehErroDeVinculo(e)
          ? `Não é possível excluir "${alvo.nomeEscola}": existem turmas, professores ou outros ` +
              `vínculos ativos associados a esta escola. Remova ou transfira esses registros e tente novamente.`
          : mensagemDeErroEscola(e, "Não foi possível excluir a escola.")
      );
    } finally {
      setExcluindo(false);
      setEscolaParaExcluir(null);
    }
  }

  const fecharToast = useCallback(() => setMensagemSucesso(null), []);

  return (
    <>
      {!modalAberto ? (
        <ListaEscolas
          escolas={escolas}
          carregando={carregando}
          erro={erro}
          aoDispensarErro={() => setErro(null)}
          aoRecarregar={() => void carregar()}
          aoNovaEscola={abrirNovaEscola}
          aoEditarEscola={abrirEdicaoEscola}
          aoExcluirEscola={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioEscola
          key={escolaEmEdicao?.idEscola ?? "nova"}
          escolaEditando={escolaEmEdicao}
          salvar={salvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {escolaParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir escola"
          mensagem={`Tem certeza que deseja excluir "${escolaParaExcluir.nomeEscola}"? Essa ação não pode ser desfeita.`}
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

export default PaginaEscolas;
